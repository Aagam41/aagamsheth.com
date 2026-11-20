#!/usr/bin/env node
/**
 * build.js
 * ---------------------------------------------------------------------------
 * Reads content/site.yaml + each section's content yaml file, renders each
 * entry through its Handlebars template, and assembles the final index.html.
 *
 * Run with: node scripts/build.js
 * (this runs automatically in GitHub Actions on every push — see
 *  .github/workflows/deploy.yml)
 * ---------------------------------------------------------------------------
 */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const Handlebars = require("handlebars");

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const TEMPLATES_DIR = path.join(ROOT, "templates");
const OUTPUT_FILE = path.join(ROOT, "index.html");

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function readYaml(relPath) {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Content file not found: ${relPath}`);
  }
  const raw = fs.readFileSync(fullPath, "utf8");
  return yaml.load(raw);
}

// Email obfuscation: emits an inert anchor carrying the address split across
// data attributes, displayed in classic [at]/[dot] form. A few lines of JS in
// page.hbs assemble the real mailto: at runtime (the visible label keeps its
// [at]/[dot] form), so the plaintext address never appears in the static HTML.
// The yaml field accepts either the raw address or an already-obfuscated
// display string ("me [at] host [dot] com") — both normalize to the same output.
Handlebars.registerHelper("webp", function (p) {
  return String(p || "").replace(/\\.[^.]+$/, ".webp");
});
Handlebars.registerHelper("emailParts", function (email) {
  const addr = String(email)
    .replace(/\s*\[\s*at\s*\]\s*/gi, "@")
    .replace(/\s*\[\s*dot\s*\]\s*/gi, ".");
  const [user, domain] = addr.split("@");
  if (!user || !domain || domain.includes(" ")) return new Handlebars.SafeString("");
  const display = `${user.replace(/\./g, " [dot] ")} [at] ${domain.replace(/\./g, " [dot] ")}`;
  return new Handlebars.SafeString(
    `<a class="js-email" href="#" data-user="${user}" data-domain="${domain}">${display}</a>`
  );
});

function readTemplate(templateDir, name) {
  const fullPath = path.join(ROOT, templateDir, `${name}.hbs`);
  if (!fs.existsSync(fullPath)) {
    throw new Error(
      `Template not found: ${templateDir}/${name}.hbs — check the "template:" field in your yaml file, or default_template in site.yaml`
    );
  }
  const raw = fs.readFileSync(fullPath, "utf8");
  return Handlebars.compile(raw);
}

// Very small markdown-ish helper: turns **bold** and [text](url) into HTML.
// Kept intentionally minimal — this is not a full markdown parser, just
// enough to make yaml content files easy to write by hand.
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function mdToHtml(str) {
  if (!str) return "";
  // Extract markdown links first (before escaping), replacing them with
  // placeholders, so the raw URL/label text doesn't get HTML-escaped twice.
  const linkStash = [];
  let working = String(str).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, label, url) => {
    const token = `\u0000LINK${linkStash.length}\u0000`;
    linkStash.push(
      `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`
    );
    return token;
  });

  let out = escapeHtml(working);

  // restore stashed links (already-escaped-safe HTML)
  out = out.replace(/\u0000LINK(\d+)\u0000/g, (m, idx) => linkStash[Number(idx)]);

  // bold: **text**
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // italics: *text*
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return out;
}

function formatDateLabel(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return dateStr;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

function sortEntries(entries, sortMode) {
  if (sortMode !== "date") return entries; // manual = yaml order, untouched
  return [...entries].sort((a, b) => {
    const da = a.date ? new Date(a.date) : new Date(0);
    const db = b.date ? new Date(b.date) : new Date(0);
    return db - da; // newest first
  });
}

// -----------------------------------------------------------------------------
// Per-entry field prep: adds computed fields (dateLabel, textHtml, authorsHtml)
// that templates rely on, without requiring the yaml author to write HTML.
// -----------------------------------------------------------------------------

function prepEntry(entry) {
  const prepped = { ...entry };
  if (entry.date) {
    prepped.dateLabel = formatDateLabel(entry.date);
    const d = new Date(entry.date + "T00:00:00");
    if (!isNaN(d.getTime())) {
      prepped.dateLabelShort = `${d.getMonth() + 1}/${String(d.getFullYear()).slice(-2)}.`;
    }
  }
  if (entry.text) prepped.textHtml = mdToHtml(entry.text);
  if (entry.description) prepped.descriptionHtml = mdToHtml(entry.description);
  if (entry.authors) {
    prepped.authorsHtml = entry.authors.map((a) => mdToHtml(a)).join(", ");
  }
  if (entry.items && Array.isArray(entry.items)) {
    prepped.itemsJoined = entry.items.join(", ");
  }
  return prepped;
}

// -----------------------------------------------------------------------------
// Main build
// -----------------------------------------------------------------------------

function build() {
  console.log("Building site...");

  const siteConfig = readYaml("content/site.yaml");
  const { site, header, sections } = siteConfig;

  if (!sections || !Array.isArray(sections)) {
    throw new Error("content/site.yaml must define a 'sections' list.");
  }

  const renderedSections = [];

  for (const section of sections) {
    if (section.enabled === false) continue;

    if (!section.content_file || !section.template_dir) {
      throw new Error(
        `Section "${section.id}" is missing content_file or template_dir in site.yaml`
      );
    }

    let entries = readYaml(section.content_file);
    if (!Array.isArray(entries)) {
      throw new Error(`${section.content_file} must contain a YAML list ("- ..." entries).`);
    }

    entries = sortEntries(entries, section.sort);

    // Group consecutive entries sharing an org under one company header
    // (LinkedIn company-page style). The first entry of each run renders
    // the org name + logo; subsequent ones render as plain roles.
    let prevOrg = null;
    const htmlParts = entries.map((entry) => {
      const templateName = entry.template || section.default_template;
      const renderFn = readTemplate(section.template_dir, templateName);
      const prepped = prepEntry(entry);
      prepped.companyHeader = !!prepped.org && prepped.org !== prevOrg;
      prevOrg = prepped.org || prevOrg;
      return renderFn(prepped);
    });

    const isListSection = ["news"].includes(section.id);
    const bodyHtml = isListSection
      ? `<ul class="entry-list">\n${htmlParts.join("\n")}\n</ul>`
      : htmlParts.join("\n");

    renderedSections.push({
      id: section.id,
      title: section.title,
      html: bodyHtml,
    });
  }

  // Prep header links / bio text through the same mini-markdown helper.
  // tagline may be a single string or a list — each list item becomes its own
  // <p> paragraph inside the hero-intro block.
  const taglineParts = Array.isArray(header.tagline)
    ? header.tagline
    : [header.tagline].filter(Boolean);
  const preppedHeader = {
    ...header,
    tagline: Array.isArray(header.tagline)
      ? taglineParts.map((t) => `<p>${mdToHtml(t)}</p>`).join("")
      : mdToHtml(header.tagline || ""),
  };
  preppedHeader.taglineHtml = preppedHeader.tagline;

  const pageTemplateSrc = fs.readFileSync(
    path.join(TEMPLATES_DIR, "page.hbs"),
    "utf8"
  );
  const pageTemplate = Handlebars.compile(pageTemplateSrc);

  // Inline the compiled (minified) stylesheet so the page renders without a
  // render-blocking CSS request on slow networks.
  const cssPath = path.join(ROOT, "assets", "css", "style.css");
  const inlinedCss = fs.existsSync(cssPath)
    ? fs.readFileSync(cssPath, "utf8")
    : "";

  const html = pageTemplate({
    site,
    header: {
      ...header,
      tagline: preppedHeader.taglineHtml,
    },
    sections: renderedSections,
    currentYear: new Date().getFullYear(),
    css: inlinedCss,
  });

  // Minify the final HTML to reduce transfer size on slow networks.
  const minified = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .trim();
  fs.writeFileSync(OUTPUT_FILE, minified, "utf8");
  console.log(`Built index.html (${renderedSections.length} sections).`);
}

try {
  build();
} catch (err) {
  console.error("BUILD FAILED:", err.message);
  process.exit(1);
}
