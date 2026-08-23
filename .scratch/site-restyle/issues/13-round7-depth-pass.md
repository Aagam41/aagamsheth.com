# 13 — Round-7 depth pass

Status: done

Owner asks:
1. Longer text descriptions for Work Experience, Engineering Projects, Research Projects.
2. Publications: optional short description line between authors and venue.
3. More skills; split dissimilar ones into separate categories.
4. Correction: AI4Life Grand Challenge = 1st place in BOTH tracks (not 4th).

Implementation:
- build.js: `descriptionHtml` via mdToHtml when a `description` field exists.
- publications/detailed.hbs + compact.hbs: conditional `.entry-summary` line after authors, before venue.
- input.css: `.entry-summary { @apply text-black/85 mt-0.5 leading-snug; }`.
- publications.yaml: summaries for SSBC + AI4Life papers (+ header docs).
- research.yaml / engineering-oss.yaml / experience.yaml: expanded narratives.
- skills.yaml: restructured to 7 categories, 58 items.
- news.yaml + research.yaml: AI4Life claim fixed to 1st/both tracks.

Smoke tests first: summary-count == entries-with-description, authors<summary<venue
ordering, stale "Placed 4th"/"improving from 5th" absent, "both tracks"/1st present.
All 88 checks green.
