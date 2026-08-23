# 07 — Reskin remaining templates + footer source pill

Status: resolved
Type: task
Blocked by: 02, 05

## What

- Entry rows standardized on thumbnail-column + info-column anatomy with rounded static thumbnails; hover-to-zoom dropped (Publications + Research detailed rows)
- Own-name bold in author lists additionally accented blue
- News keeps markup; bold month-year prefix styling only
- Education / Experience / Skills / Other / Contact content untouched; Templates reskinned to tokens — logo circles retained, hairlines removed, whitespace-only separation, multi-column rows stack full-width on small screens
- All link pills use `.pill-link` uniformly: hero links, publication link pills, project GitHub pills, and a new footer source-code pill linking the site repo
- Semantic headings and image alt text preserved

## Done when

Full suite (`npm test`) green end to end.
