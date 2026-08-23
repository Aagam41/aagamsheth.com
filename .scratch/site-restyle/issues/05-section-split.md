# 05 — Split Projects into Research + Engineering & OSS

Status: resolved
Type: task
Blocked by: 01

## What

- Rename the existing Projects Section to **Research** (id `research`, title "Research"), keeping the detailed row Template and manual sort
- Add adjacent Section **Engineering & OSS** (id `engineering-oss`, title "Engineering & OSS") with new content file `content/engineering-oss.yaml`; both Sections point at `templates/projects/`
- Entry classification:
  - Research = both UAV tracking/detection projects, fluorescence microscopy denoising, sepsis detection, LayoutLM vs RoBERTa document understanding, planetary rover
  - Engineering & OSS = React Headless Token Auth, Django Dynamic Models, Django DB File Storage, SahajPranali, SPAPAS
- Engineering & OSS default Template is the compact variant (title + one-line description + GitHub pill); entries may override per-entry
- Extend pre-build validator required-field rules to cover `research` and `engineering-oss` (same rules as old projects); remove the stale `projects` key
- Old `#projects` anchor breaks — accepted per spec

## Done when

Validate passes with both Sections; built page shows them adjacent between Publications and Experience; smoke-test order/count assertions pass.
