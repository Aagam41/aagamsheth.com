# 01 — Smoke test at the pipeline seam

Status: resolved
Type: task

## What

Create `scripts/smoke-test.js` + `npm test`: run validation, build, and CSS build, then assert against the emitted `index.html` (and `assets/css/style.css`). This is the single pre-agreed seam — no unit tests of build-script internals or Handlebars helpers.

## Asserts

- Section headings present in order: News, Education, Publications, Research, Engineering & OSS, Experience, Skills, Other, Certificates, Contact
- Hero contains email (mailto) plus CV, GitHub, LeetCode, Kaggle links
- Nunito referenced (page head link + built CSS)
- Pill classes on known links (hero, publication pills, project GitHub pill, footer source pill)
- Compact one-line Certificate rows; row count equals entry count in `content/certificates.yaml`
- Hamburger/nav markup present
- Zero occurrences of old serif theme tokens (Georgia, paper/hairline/highlight/muted, #2673b9)
- Count checks (not exact-match): publications/research/engineering rows equal their content-file entry counts
- News items have a bold month-year prefix
- No hover-zoom transform left in CSS

## Done when

`npm test` runs the whole pipeline and fails on the current (pre-restyle) output.
