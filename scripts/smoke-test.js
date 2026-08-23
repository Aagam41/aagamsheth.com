#!/usr/bin/env node
/**
 * smoke-test.js
 * ---------------------------------------------------------------------------
 * Output-side sibling of validate.js: runs the full pipeline (validate ->
 * build -> css) and asserts external behavior against the emitted artifacts
 * (index.html + assets/css/style.css). Never inspects HOW templates achieve
 * the output, only what came out of the pipe.
 *
 * Run with: npm test   (or: node scripts/smoke-test.js)
 * ---------------------------------------------------------------------------
 */

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const ROOT = path.resolve(__dirname, "..");
const INDEX_FILE = path.join(ROOT, "index.html");
const CSS_FILE = path.join(ROOT, "assets", "css", "style.css");

let failures = 0;
let checks = 0;

function ok(cond, label) {
  checks++;
  if (cond) {
    console.log(`  ✓ ${label}`);
  } else {
    failures++;
    console.error(`  ✗ ${label}`);
  }
}

function readYaml(relPath) {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) return null;
  return yaml.load(fs.readFileSync(full, "utf8"));
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractSection(html, id) {
  const start = html.indexOf(`<section class="content-section" id="${id}">`);
  if (start === -1) return null;
  const next = html.indexOf('<section class="content-section"', start + 1);
  return next === -1 ? html.slice(start) : html.slice(start, next);
}

function count(haystack, needle) {
  let n = 0;
  let i = haystack.indexOf(needle);
  while (i !== -1) {
    n++;
    i = haystack.indexOf(needle, i + needle.length);
  }
  return n;
}

function runStep(cmd, args) {
  const res = spawnSync(cmd, args, { cwd: ROOT, stdio: "inherit" });
  if (res.status !== 0) {
    console.error(`\n✗ pipeline step failed: ${cmd} ${args.join(" ")}`);
    process.exit(1);
  }
}

// -----------------------------------------------------------------------------
// 1. Pipeline: validate -> build -> css
// -----------------------------------------------------------------------------

console.log("Running pipeline (validate → build → css)...\n");
runStep("node", [path.join("scripts", "validate.js")]);
runStep("node", [path.join("scripts", "build.js")]);
runStep("npx", ["tailwindcss", "-i", "./assets/css/input.css", "-o", "./assets/css/style.css", "--minify"]);

const html = fs.readFileSync(INDEX_FILE, "utf8");
const css = fs.readFileSync(CSS_FILE, "utf8");

console.log("\nAsserting against emitted artifacts...\n");

// -----------------------------------------------------------------------------
// 2. Section headings present, in order
// -----------------------------------------------------------------------------

const expectedOrder = [
  "News",
  "Education",
  "Publications",
  "Research",
  "Engineering & OSS",
  "Experience",
  "Skills",
  "Other",
  "Certificates",
  "Contact",
];
const actualHeadings = [...html.matchAll(/<h2 class="section-title">(.*?)<\/h2>/g)].map((m) =>
  decodeEntities(m[1])
);
ok(
  JSON.stringify(actualHeadings) === JSON.stringify(expectedOrder),
  `section headings in order (${actualHeadings.length})`
);

// -----------------------------------------------------------------------------
// 3. Hero: email + the five agreed links
// -----------------------------------------------------------------------------

const heroStart = html.indexOf("<header");
const heroEnd = html.indexOf("</header>");
const hero = heroStart !== -1 && heroEnd !== -1 ? html.slice(heroStart, heroEnd) : "";

const siteConfig = readYaml("content/site.yaml");
ok(hero.includes(`href="mailto:${siteConfig.header.email}"`), `hero has mailto link for ${siteConfig.header.email}`);
for (const link of siteConfig.header.links) {
  const re = new RegExp(`<a href="${link.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*class="pill-link`);
  ok(re.test(hero), `hero pill link "${link.label}"`);
}
// Email icon counts as the fifth agreed link; CV/GitHub/LeetCode/Kaggle come from site.yaml.
ok(
  ["CV", "GitHub", "LeetCode", "Kaggle"].every((l) => siteConfig.header.links.some((x) => x.label === l)),
  "hero carries the five agreed reach links (Email + CV/GitHub/LeetCode/Kaggle)"
);

// -----------------------------------------------------------------------------
// 4. Nunito font referenced
// -----------------------------------------------------------------------------

ok(/fonts\.googleapis\.com[^"']*Nunito/.test(html), "index.html references Nunito via Google Fonts");
ok(css.includes("Nunito"), "built CSS sets Nunito as font family");
ok(!/prefers-color-scheme/.test(css), "no prefers-color-scheme rules (light only)");

// -----------------------------------------------------------------------------
// 5. Pill classes on known links
// -----------------------------------------------------------------------------

const pubsSection = extractSection(html, "publications") || "";
const researchSection = extractSection(html, "research") || "";
const engSection = extractSection(html, "engineering-oss") || "";

ok(/<div class="pub-links">/.test(pubsSection) && /class="pill-link[ "]/.test(pubsSection),
  "publication link pills use .pill-link");
ok(/GitHub<\/a>/.test(engSection) && /class="pill-link[ "]/.test(engSection),
  "Engineering & OSS GitHub pills use .pill-link");
ok(/class="pill-link"/.test(hero), "hero links use .pill-link");
ok(/Built with a static, open-source site generator\./.test(html) && /github\.com\/Aagam41\/aagamsheth\.com/.test(html),
  "footer keeps generator line and links the source repo");

// -----------------------------------------------------------------------------
// 6. Count checks (not exact-match)
// -----------------------------------------------------------------------------

const certEntries = readYaml("content/certificates.yaml");
const certRows = count(extractSection(html, "certificates") || "", 'class="cert-item');
ok(!!certEntries && certRows === certEntries.length, `certificate rows (${certRows}) == entries in certificates.yaml (${certEntries ? certEntries.length : "missing"})`);

const pubEntries = readYaml("content/publications.yaml");
const pubRows = count(pubsSection, 'class="pub-item');
ok(!!pubEntries && pubRows === pubEntries.length, `publication rows (${pubRows}) == entries (${pubEntries ? pubEntries.length : "missing"})`);

const researchEntries = readYaml("content/research.yaml");
const engEntries = readYaml("content/engineering-oss.yaml");
const researchRows = count(researchSection, 'class="project-item');
const engRows = count(engSection, 'class="project-item');
ok(!!researchEntries && researchRows === researchEntries.length, `research rows (${researchRows}) == entries in research.yaml (${researchEntries ? researchEntries.length : "missing"})`);
ok(!!engEntries && engRows === engEntries.length, `engineering rows (${engRows}) == entries in engineering-oss.yaml (${engEntries ? engEntries.length : "missing"})`);

// -----------------------------------------------------------------------------
// 7. Compact single-line certificate rows carry a month-year pill
// -----------------------------------------------------------------------------

const certSectionHtml = extractSection(html, "certificates") || "";
const certRowsHtml = [...certSectionHtml.matchAll(/<div class="cert-item">[\s\S]*?<\/div>/g)].map((m) => m[0]);
ok(certRowsHtml.every((row) => /class="cert-date">[A-Z][a-z]{2} \d{4}</.test(row)), "certificate rows show month-year pill");
ok(certRowsHtml.length > 0 && certRowsHtml.every((row) => !/\n\s*\n/.test(row)), "certificate rows are single-line markup");

// -----------------------------------------------------------------------------
// 8. Nav: hamburger markup + scrolled-state hook
// -----------------------------------------------------------------------------

ok(/id="site-nav"/.test(html), "fixed nav bar present");
ok(/id="nav-toggle"/.test(html) && /aria-label="Toggle navigation"/.test(html), "hamburger toggle present with aria-label");
ok(/nav--scrolled/.test(html), "scroll listener wired to nav--scrolled class");
ok(/aria-expanded/.test(html), "hamburger manages aria-expanded");

// -----------------------------------------------------------------------------
// 9. News: bold month-year prefix
// -----------------------------------------------------------------------------

const newsItems = [...html.matchAll(/<li class="news-item">(.*?)<\/li>/gs)].map((m) => m[1]);
ok(newsItems.length > 0, "news items rendered");
ok(
  newsItems.every((item) => /^<span class="news-date">[A-Z][a-z]{2} \d{4}<\/span>/.test(item.trim())),
  "every news item starts with a month-year prefix"
);
ok(/\.news-date\{[^}]*font-weight:(700|800|900)/.test(css), "news date prefix styled bold in CSS");

// -----------------------------------------------------------------------------
// 10. Old serif theme tokens fully gone
// -----------------------------------------------------------------------------

const OLD_TOKENS = ["Georgia", "Times New Roman", "#2673b9", "#333332", "bg-paper", "text-muted", "hairline"];
for (const token of OLD_TOKENS) {
  ok(!html.toLowerCase().includes(token.toLowerCase()), `index.html free of old token "${token}"`);
  ok(!css.toLowerCase().includes(token.toLowerCase()), `style.css free of old token "${token}"`);
}
ok(!css.includes("scale(2.6"), "hover-to-zoom thumbnail transform removed");

// -----------------------------------------------------------------------------
// 11. Research thumbnails: rounded static images present
// -----------------------------------------------------------------------------

ok(/class="project-image">\s*<img[^>]*loading="lazy"/.test(researchSection), "research detailed rows keep lazy thumbnails");

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------

console.log("");
if (failures > 0) {
  console.error(`✗ ${failures}/${checks} smoke checks failed.`);
  process.exit(1);
} else {
  console.log(`✓ All ${checks} smoke checks passed.`);
}
