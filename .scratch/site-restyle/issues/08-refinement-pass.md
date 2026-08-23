# 08 — Reference refinement pass (Ying Wang socials, Anjali Gupta type/rows/spacing)

Status: ready-for-agent
Type: task
Blocked by: 01

## What

Second pass from owner feedback, references fetched and analyzed:

- Nav links lowercase + muted (#8c909c), hover darkens; `.page` widened to 1100px
- Hero socials become Ying Wang-style pipe-separated text row under the intro (`email | CV | GitHub | LeetCode | Kaggle`); envelope icon + pill row removed
- Typography per Anjali Gupta: Inter (400–700) replaces Nunito, body 17px, name 48px bold, section headings 31px semibold
- Publications / Research / Engineering rows share one Anjali-style anatomy: 20% thumbnail column (larger thumbs; placeholder box when no image), info as stacked lines — bold title, description/authors, italic venue, bracketed `[label]` links; stack on mobile
- Section titles: "Research Projects", "Engineering Projects"
- News prefix becomes bold numeric `M/YY.` (build.js adds `dateLabelShort`)
- Footer reduced to one centered muted line ("Applying design and engineering principles to solve complex problems through sound analytical and creative skills")
- Spacing tightened (~30–40px between sections)

## Done when

Smoke test updated first (red), then green end-to-end after implementation.
