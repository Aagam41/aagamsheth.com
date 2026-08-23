# Spec: Research-led restyle of the academic site

Status: ready-for-agent
Labels: ready-for-agent

## Problem Statement

The site owner has a working one-page hybrid site, but it reads as a generic card-based template rather than a credible academic homepage. The Academic reader — a professor, peer, or admissions committee member — lands on a busy page where placeholder Publications compete with Django patches for attention, and a wall of fifteen MOOC certificates dilutes the research signal. The Industry reader can't quickly separate shipping ability from coursework. The owner admires the dense, text-first aesthetic of reference academic homepages and wants his site to look and feel like those, without giving up either audience or the simple "edit YAML in a browser" maintenance model.

## Solution

Restyle the entire page to an extracted design system from the reference site the owner chose: Nunito type throughout, black text on white, a single blue accent, uppercase pill links, thumbnail-plus-info entry rows, whitespace instead of hairlines, and a 1000px column. Replace the centered business-card hero with a photo-column-plus-intro-statement layout (Ying Wang style — short first-person bio, no numbered threads, no tagline). Add a fixed navigation bar that gains a white background and shadow on scroll and collapses to a hamburger on small screens. Split the single Projects Section into two adjacent Sections — Research and Engineering & OSS — so each audience gets its own reading path. Switch Certificates to its compact one-line-per-entry Template. All content remains Placeholder-driven where it already is; nothing is hidden and no real papers are added yet.

## User Stories

1. As an Academic reader, I want a short first-person intro statement at the top, so that I can tell within seconds who this person is, where they study, and what they work on
2. As an Academic reader, I want Publications to appear high on the page with venue names and paper/code/arxiv pill links, so that I can scan research output the way I do on colleagues' homepages
3. As an Academic reader, I want research projects separated from general software work, so that I don't have to wade through framework patches to find UAV tracking and clinical ML
4. As an Academic reader, I want my own name bolded and accented in author lists, so that authorship position is instantly clear when scanning entries
5. As an Industry reader, I want a dedicated Engineering & OSS Section, so that I can evaluate real-world shipping ability without hunting through research projects
6. As an Industry reader, I want Experience rows with company logos and date ranges kept intact, so that employment history stays verifiable
7. As an Industry reader, I want Skills grouped by category as scannable pills, so that I can check a stack match quickly
8. As a Site owner, I want the visual design to use Nunito, black-on-white, and a single blue accent, so that the page looks like the dense academic homepages I admire rather than a card template
9. As a Site owner, I want the hero to show my headshot beside my existing bio paragraph, so that my identity is personal and immediate without inventing new copy
10. As a Site owner, I want Email, CV, GitHub, LeetCode, and Kaggle links in the hero, so that every way of reaching or checking me is one click from the top
11. As a Site owner, I want my placeholder Publications to stay exactly as they are, so that the section's structure is proven now and I only swap in real papers later
12. As a Site owner, I want to keep editing only YAML to change any Entry, Section order, or Section title, so that maintaining the site never requires touching code
13. As a Site owner, I want the Certificates Section compressed to one line per certificate, so that evidence of continuous learning exists without dominating the page
14. As a Site owner, I want light-only styling with no dark-mode variant, so that the aesthetic matches my chosen reference and ships without extra theming work
15. As a Mobile visitor, I want the navigation bar to collapse into a hamburger below phone-width, so that section jumps stay reachable on a small screen
16. As a Mobile visitor, I want all multi-column rows to stack full-width, so that nothing is cramped or horizontally scrolled on my phone
17. As a First-time visitor, I want a fixed navigation bar that becomes white with a shadow once I scroll, so that I always know where I am on a long single page
18. As a First-time visitor, I want anchor links to every Section, so that I can jump directly to Publications or Contact
19. As a First-time visitor, I want sections separated by generous whitespace with no divider lines, so that the page feels calm and editorial rather than boxed-in
20. As a First-time visitor, I want News items rendered with a bold month-year prefix, so that recency is scannable at a glance
21. As an Academic reader, I want publication and research-project Entries to show a rounded thumbnail beside their info, so that each item has visual identity like reference homepage paper rows
22. As an Industry reader, I want Engineering & OSS Entries rendered compactly with direct GitHub pill links, so that I can open the actual code in a new tab
23. As a Screen-reader user, I want semantic headings and preserved image alt text throughout the restyle, so that the redesigned page remains navigable non-visually
24. As a Returning visitor, I want the page to remain a single generated HTML document with no client framework, so that load times stay instant on any connection
25. As the Site owner, I want the pre-build validator extended to cover the new Sections automatically, so that a typo in the new content files still can never blank the live site

## Implementation Decisions

- **Design tokens**: replace the current serif/paper theme in the Tailwind theme configuration with the extracted system — Nunito (weights ~200–1000) as the sole family, white background, black text, accent blue #1772d0; body text ~18px, name heading ~40px regular weight, Section headings bold ~30px.
- **Pill link component**: restyle all link pills to small uppercase bold labels (~11px, wide letter-spacing) with a thin accent border that fills accent-blue with white text on hover; apply uniformly across hero links, publication link pills, project GitHub links, and the footer source-code link.
- **Page shell**: rework the shell Template to a centered 1000px container; hero becomes a flex row — narrow left column stacking headshot, contact icons/email, and the link row; right column holding the existing Intro statement text unchanged. Existing mini-markdown rendering of the bio is preserved.
- **Navigation**: add a fixed top bar with uppercase anchor links to every enabled Section; transparent at rest, switching to white background with drop shadow after scroll via a few lines of vanilla JS; hamburger toggle below ~600px replacing inline links. Section anchor ids come from the site configuration manifest, so renaming the Projects Section updates nav automatically.
- **Projects split**: rename the existing Projects Section to "Research" (keeping its detailed row Template and manual sort) and add a new adjacent Section "Engineering & OSS" with a second content file; both Sections point at the same Templates folder. Entry classification: Research = both UAV tracking/detection projects, fluorescence microscopy denoising, sepsis detection, LayoutLM vs RoBERTa document understanding, planetary rover; Engineering & OSS = React Headless Token Auth, Django Dynamic Models, Django DB File Storage, SahajPranali, SPAPAS.
- **Engineering & OSS default Template**: use the compact variant by default — title plus one-line description plus GitHub pill; individual Entries may override if they ever need thumbnails.
- **Certificates**: flip the Section's default Template to its existing compact variant (one line per credential: month-year pill, name, issuer) with no content changes.
- **Entry rows**: standardize detailed rows on thumbnail-column + info-column anatomy with rounded static thumbnails; the hover-to-zoom effect on thumbnails is dropped in favor of the reference system's static images.
- **News**: keep the existing dated list markup; styling only (bold month-year prefix).
- **Education/Experience/Skills/Other/Contact**: content untouched; Templates reskinned to the token system (logo circles retained, hairlines removed, spacing normalized to whitespace-only separation).
- **No dark mode**: no prefers-color-scheme rules anywhere; light palette only.
- **Validation/build contract unchanged**: the pipeline still emits a single index.html at the repo root; the input-side validator already validates Sections generically, so the new Section needs no special-casing beyond satisfying the same required-field rules as Projects.
- **Anchor id change accepted**: renaming Projects → Research gives it a new anchor id; inbound links to the old #projects anchor will break and are accepted (no redirects exist in a static Pages deploy anyway).

## Testing Decisions

- **One seam**: the highest seam in this codebase is the full pipeline — run validation and the build, then assert against the emitted HTML document. A single new smoke-test script does exactly this; no unit tests touch build-script internals or Handlebars helpers.
- **Good tests assert external behavior**: presence and order of Section headings ("News", "Education", "Publications", "Research", "Engineering & OSS", "Experience", "Skills", "Other", "Certificates", "Contact"), hero containing email plus the five agreed links, Nunito font referenced, pill classes on known links, compact single-line Certificate rows, hamburger/nav markup present, and zero occurrences of the old serif theme tokens. Tests never inspect how templates achieve these outputs.
- **Prior art**: the existing pre-build validator is the model — declarative checks over the artifact with hard failure. The smoke test is its output-side sibling, runnable locally and suitable as a CI step after build.
- **Count checks over exact-match checks**: e.g., assert the number of certificate rows equals the number of Entries in its content file, rather than asserting specific certificate titles, so content edits don't break tests.

## Out of Scope

- Dark mode or any prefers-color-scheme support
- Multi-page architecture; the site stays one generated page
- Custom-domain DNS setup (aagamsheth.com currently does not resolve)
- Replacing Placeholder Publications or the placeholder CV with real content
- Adding a Google Scholar link (explicitly declined)
- Rewriting the Intro statement copy or inventing numbered research threads/taglines (explicitly rejected)
- Press/media pill variants, analytics, RSS, SEO work beyond the existing meta description
- Any change to deployment workflows, hosting, or the admin-via-GitHub-web-UI story

## Further Notes

- The site auto-deploys on every push to main and is publicly reachable at its github.io URL right now; the owner has explicitly accepted placeholder Papers remaining publicly visible during and after this rebuild.
- Domain vocabulary (Section, Entry, Template, Intro statement, Placeholder, Academic reader, Industry reader) is defined in CONTEXT.md at the repo root; consumer rules in docs/agents/domain.md. The rejected terms "research statement" and "research thread" are recorded there as Avoid-language.
- Design tokens were extracted from the live reference site chosen by the owner (its stylesheet and markup were fetched and analyzed); they are faithful copies, not approximations, and deviations should be flagged rather than silently smoothed over.

## Amendment 2026-08-23 — Reference refinement pass (owner feedback)

Owner reviewed the rebuilt page against two references and directed a second pass:

1. **Navbar**: muted, lowercase links; page column widened past 1000px (→1100px).
2. **Socials**: Ying Wang (yingwangg.github.io) style — a plain pipe-separated text row under the Intro statement (`email | CV | GitHub | LeetCode | Kaggle`); pill row and envelope icon removed.
3. **Type**: Anjali Gupta (anjaliwgupta.com) typography — Inter family (400–700), body ~17px, name ~48px bold, section headings ~31px semibold; link color muted slate #8c909c darkening on hover.
4. **Entry rows (Publications, Research, Engineering)**: Anjali Gupta pattern — thumbnail column at 20% row width (larger thumbnails), info side as stacked lines: bold title, description/authors, italic venue where present, bracketed plain-text links `[label]`; rows stack full-width on mobile.
5. **Section titles**: "Research Projects" and "Engineering Projects".
6. **News**: Anjali Gupta pattern — bold numeric `M/YY.` date prefix per line.
7. **Footer**: copyright/generator/source removed; single centered muted line: "Applying design and engineering principles to solve complex problems through sound analytical and creative skills" ("though" corrected to "through").
8. **Spacing**: tighter, Anjali-style (~30–40px between sections).

All other Implementation Decisions (placeholders, YAML-only maintenance, light-only, validator contract) stand.

## Amendment 2026-08-23 — Round-2 refinement pass (owner feedback)

Owner reviewed the round-1 result and directed five further changes:

1. **Column width**: "a bit less" than 1100px → 1000px, Anjali Gupta's exact content width (nav inner width matches).
2. **Typography**: Anjali Gupta's exact values copied verbatim from her stylesheet —
   body `clamp(0.825rem, 0.825rem + ((1vw - 0.2rem) * 0.389), 1.0625rem)` w400 lh1.6;
   name h1 `clamp(1.743rem, 1.743rem + ((1vw - 0.2rem) * 2.052), 3rem)` w700 mb8px;
   section headings `clamp(1.563rem, 1.563rem + ((1vw - 0.2rem) * 0.637), 1.953rem)` w600 lh1.2;
   intro statement `clamp(0.929rem, 0.929rem + ((1vw - 0.2rem) * 0.769), 1.4rem)` lh1.4.
3. **Section spacing**: noticeably MORE space between sections than round 1 (mb-10 → mb-16).
4. **Education**: optional `courses` field; renders a muted "Coursework: …" line under the degree details for each school that has one.
5. **Research & Engineering rows**: publication-style stacked lines — title / description / `institute · date` line / authors line — via new optional entry fields `org`, `dates`, `authors`; institute+date text removed from descriptions in research.yaml and engineering-oss.yaml.

All other decisions stand.

## Amendment 2026-08-23 — Round-3 refinement pass (owner feedback)

1. **Navigation**: wide screens get a floating right-hand outline nav (docs-site style) with scroll-spy highlighting of the section in view; the fixed top bar (with hamburger) remains below 1100px and hides above it.
2. **News**: hanging indent — wrapped text lines align under the first text line, not under the bold M/YY. date.
3. **Research Projects**: typed link lists (`links: [{label,url}]`) rendered as bracketed [GitHub] / [Paper] / [Video] links; single `link` still supported as [GitHub]. Placeholder URLs point at the GitHub profile until real ones exist.
4. **Experience**: renamed to "Work Experience"; rows restyled LinkedIn-style — role line bold, company followed by italic dates on the same line, description below.
5. **Type scale**: everything one notch smaller — body clamp(.78rem→.95rem), name clamp(1.563rem→2.6rem), section headings clamp(1.35rem→1.75rem), intro clamp(.85rem→1.2rem); entry titles 16px, socials/links/cert rows/details trimmed ~1px each.

All other decisions stand.

## Amendment 2026-08-23 — Round-4 refinement pass (owner feedback)

1. **Contact**: redesigned as a soft card (`contact-card`) — short lead line plus a channels row (obfuscated email + location chip).
2. **Email obfuscation / phone removal**: build emits an inert `<a class="js-email" data-user=… data-domain=…>` hook; a few lines of JS in page.hbs assemble the mailto at runtime, so the plaintext address and any `mailto:` never appear in the static HTML (hero socials + contact both use it). Phone number deleted from content.
3. **Hero photo**: photo column takes 25% of the hero row width; image renders in a portrait 3:4 frame.
4. **Spacing**: hero block carries its own bottom margin so News doesn't crowd the intro statement.
5. **Publications**: every row shows a thumbnail — all entries use the detailed template; missing images fall back to the title placeholder box.
6. **Other**: no longer a text wall — short lead line plus interests rendered as compact pills.

All other decisions stand.

## Amendment 2026-08-23 — Round-5 pass (mechanical items)

1. **Nav**: "home" link prepended to the side outline, desktop bar, and mobile menu — scrolls to `#top`.
2. **Hero title**: name centered horizontally.
3. **Contact section**: removed entirely (email already lives in the hero socials row).
4. **Email obfuscation display**: rendered in classic `[at]`/`[dot]` form (`contact.me [at] aagamsheth [dot] com`); JS still assembles the real mailto: for clicks, and the plaintext address never appears statically.

Content enrichment (resumes, GitHub, LinkedIn) tracked separately in ticket 12 pending owner answers.

## Amendment 2026-08-23 — Round-5b: real publications

Placeholder publications replaced with two real papers (supplied as PDFs, text extracted via pdftotext):

1. **Label-Efficient Sclera Segmentation with Foundation Models: SSBC 2026** — IEEE IJCB 2026 (SSBC competition); full 30-author list, self bolded; [code] links to the ieee-ijcb-ssbc-2026 repo.
2. **AI4Life Open Calls and Public Challenges: why, how, and what we have learned.** — Preprint, 2026; full author list incl. AI4Life Consortium, self bolded.

Research project "Unsupervised Denoising for Fluorescence Microscopy" updated around Restormer3D (topped all four AI4Life challenge leaderboards); [GitHub] now points at the Restormer3D repo.

## Amendment 2026-08-23 — Round-6 refinement pass

1. **Nav**: "Home" (capitalized) in all three navs.
2. **Work Experience**: LinkedIn company-page layout — one header per company (logo + name, rendered when the entry's `org` differs from the previous entry's; driven by a `companyHeader` flag computed in build.js), roles beneath with dates inline after the title and an optional `context` line naming the client/project. All seven roles now correctly grouped under **Tirth Infotech** (Archives Portal/FDCA is the client context, not the employer).
3. **Descriptions**: Work Experience, Research Projects, and Engineering Projects descriptions rewritten — outcome-first, concrete numbers kept (21.5% FP reduction, 0.921 ROC-AUC / 0.812 PR-AUC / ~83.6% recall, ~5000 rpm / ~70% CPU, etc.).
4. **Skills**: new "Techniques" category (PEFT/LoRA, multi-object tracking, feature engineering & SMOTE, full-text search); Frameworks += Hugging Face Transformers, Optuna, SHAP, Noise2Noise/N2V; Tools += MySQL; Software += Crystal Reports.

All other decisions stand. (Owner's list item 5 was empty — nothing omitted intentionally.)

## Amendment 2026-08-23 — Round-7 depth pass

1. **Longer descriptions**: Work Experience, Engineering Projects, and Research
   Project descriptions expanded to richer multi-sentence narratives (motivation,
   approach, outcome) while keeping every concrete number.
2. **Publications**: new optional `description` field — a one-to-two-sentence
   summary rendered between the authors and the venue line (`.entry-summary`,
   prepEntry emits `descriptionHtml` via mdToHtml; supported in detailed and
   compact templates). Both real papers now carry summaries.
3. **Skills**: split "Frameworks / Libraries" into "ML / Deep Learning & Computer
   Vision" and "Web & Backend Frameworks"; split databases/messaging out of
   tools into "Databases & Messaging" and servers into "DevOps & Servers".
   Added SAHI, SIFT/HoG/LBP descriptors, REST API design, T-SQL stored
   procedures, mod_wsgi, GitHub. 58 pills across 7 categories.
4. **Correction**: AI4Life Grand Challenge result corrected to **1st place in
   both tracks** (was "4th, improving from 5th") — research.yaml and news.yaml.

## Amendment 2026-08-24 — Round-8: three-paragraph tagline + email display

1. **Tagline**: `header.tagline` now accepts a LIST — each item becomes its own
   `<p>` inside the hero intro (page.hbs wrapper is a `<div class="hero-intro">`;
   build.js maps items through mdToHtml and wraps them; `.hero-intro p + p`
   spacing). Single-string form still supported. Owner supplied the three
   paragraphs (research focus / CTO role / coffee-and-cycling outreach).
2. **Email display**: visible obfuscation is now
   "contact [dot] me [at] aagamsheth [dot] com" — dots inside the local part are
   spelled out too. emailParts helper normalizes either raw or pre-obfuscated
   yaml values, so data-user/data-domain still carry the real address for the
   runtime mailto assembly.
3. **Owner edits folded in**: News section disabled (enabled: false) and its
   smoke checks inverted accordingly; education degrees/courses updated;
   headshot/logos replaced.
