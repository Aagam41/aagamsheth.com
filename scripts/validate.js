#!/usr/bin/env node
/**
 * validate.js
 * ---------------------------------------------------------------------------
 * Runs in CI before every build to catch mistakes early:
 *   - yaml syntax errors (typos, bad indentation)
 *   - site.yaml pointing at a content_file or template_dir that doesn't exist
 *   - a section's default_template file missing
 *   - an entry's "template:" field pointing at a template that doesn't exist
 *   - required fields missing per section type
 *   - local image/file paths referenced in yaml that don't exist in the repo
 *
 * If this script fails, the GitHub Action stops BEFORE deploying, so a typo
 * in a yaml file can never silently break (or blank out) the live site.
 * ---------------------------------------------------------------------------
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const ROOT = path.resolve(__dirname, "..");
let errors = [];
let warnings = [];

function readYamlSafe(relPath) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing file: ${relPath}`);
    return null;
  }
  try {
    return yaml.load(fs.readFileSync(fullPath, "utf8"));
  } catch (e) {
    errors.push(`YAML syntax error in ${relPath}: ${e.message}`);
    return null;
  }
}

function checkLocalPath(relPath, context) {
  // Only check local (non-URL) paths
  if (!relPath || /^https?:\/\//.test(relPath) || relPath.startsWith("mailto:")) return;
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    warnings.push(`${context}: file not found at "${relPath}" (this will 404 on the live site)`);
  }
}

const REQUIRED_FIELDS = {
  news: ["text"],
  education: ["dates", "institution", "degree"],
  publications: ["title", "venue"],
  projects: ["title", "description"],
  experience: ["role", "org"],
  other: ["text"],
  certificates: ["title", "issuer"],
  contact: ["text"],
};

function validate() {
  console.log("Validating site content...\n");

  const siteConfig = readYamlSafe("content/site.yaml");
  if (!siteConfig) {
    printAndExit();
    return;
  }

  if (!siteConfig.header) errors.push("site.yaml: missing 'header' block");
  if (!siteConfig.sections || !Array.isArray(siteConfig.sections)) {
    errors.push("site.yaml: missing or invalid 'sections' list");
    printAndExit();
    return;
  }

  if (siteConfig.header && siteConfig.header.photo) {
    checkLocalPath(siteConfig.header.photo, "header.photo");
  }
  if (siteConfig.header && siteConfig.header.links) {
    for (const link of siteConfig.header.links) {
      if (!link.label || !link.url) {
        errors.push(`site.yaml: header link missing 'label' or 'url' — ${JSON.stringify(link)}`);
      } else {
        checkLocalPath(link.url, `header link "${link.label}"`);
      }
    }
  }

  const seenIds = new Set();

  for (const section of siteConfig.sections) {
    if (!section.id) {
      errors.push(`A section in site.yaml is missing an "id" field.`);
      continue;
    }
    if (seenIds.has(section.id)) {
      errors.push(`Duplicate section id "${section.id}" in site.yaml — ids must be unique.`);
    }
    seenIds.add(section.id);

    if (section.enabled === false) {
      console.log(`  - [${section.id}] skipped (enabled: false)`);
      continue;
    }

    if (!section.content_file) {
      errors.push(`Section "${section.id}": missing content_file in site.yaml`);
      continue;
    }
    if (!section.template_dir) {
      errors.push(`Section "${section.id}": missing template_dir in site.yaml`);
      continue;
    }
    if (!section.default_template) {
      errors.push(`Section "${section.id}": missing default_template in site.yaml`);
    }
    if (!["date", "manual"].includes(section.sort)) {
      errors.push(`Section "${section.id}": sort must be "date" or "manual", got "${section.sort}"`);
    }

    const templateDirFull = path.join(ROOT, section.template_dir);
    if (!fs.existsSync(templateDirFull)) {
      errors.push(`Section "${section.id}": template_dir "${section.template_dir}" does not exist`);
    } else if (section.default_template) {
      const defaultTplPath = path.join(templateDirFull, `${section.default_template}.hbs`);
      if (!fs.existsSync(defaultTplPath)) {
        errors.push(
          `Section "${section.id}": default_template "${section.default_template}" not found in ${section.template_dir}`
        );
      }
    }

    const entries = readYamlSafe(section.content_file);
    if (entries === null) continue;
    if (!Array.isArray(entries)) {
      errors.push(`${section.content_file} must be a YAML list (start each entry with "- ").`);
      continue;
    }

    const requiredFields = REQUIRED_FIELDS[section.id] || [];

    entries.forEach((entry, idx) => {
      const label = `${section.content_file} entry #${idx + 1}`;

      for (const field of requiredFields) {
        if (entry[field] === undefined || entry[field] === null || entry[field] === "") {
          errors.push(`${label}: missing required field "${field}"`);
        }
      }

      if (entry.date && isNaN(new Date(entry.date).getTime())) {
        errors.push(`${label}: "date" value "${entry.date}" is not a valid date (use YYYY-MM-DD)`);
      }

      if (entry.template) {
        const tplPath = path.join(ROOT, section.template_dir, `${entry.template}.hbs`);
        if (!fs.existsSync(tplPath)) {
          errors.push(
            `${label}: template "${entry.template}" not found in ${section.template_dir} — check for a typo`
          );
        }
      }

      if (entry.image) checkLocalPath(entry.image, label);
      if (entry.link && !/^https?:\/\//.test(entry.link) && !entry.link.startsWith("mailto:")) {
        checkLocalPath(entry.link, label);
      }
      if (entry.links && Array.isArray(entry.links)) {
        entry.links.forEach((l) => {
          if (!l.label || !l.url) {
            errors.push(`${label}: a link is missing "label" or "url"`);
          }
        });
      }
    });

    console.log(`  - [${section.id}] ${entries.length} entr${entries.length === 1 ? "y" : "ies"} OK`);
  }

  printAndExit();
}

function printAndExit() {
  console.log("");
  if (warnings.length) {
    console.log(`⚠ ${warnings.length} warning(s):`);
    warnings.forEach((w) => console.log(`  - ${w}`));
    console.log("");
  }
  if (errors.length) {
    console.error(`✗ ${errors.length} error(s) found — build stopped:`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  } else {
    console.log("✓ All content valid.");
    process.exit(0);
  }
}

validate();
