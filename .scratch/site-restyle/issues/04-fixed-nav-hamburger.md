# 04 — Fixed nav bar + hamburger

Status: resolved
Type: task
Blocked by: 03

## What

- Fixed top bar with uppercase anchor links to every enabled Section (ids from the `site.yaml` manifest, so renames propagate)
- Transparent at rest; white background + drop shadow once scrolled — a few lines of vanilla JS toggling a class
- Below ~600px the inline links collapse into a hamburger toggle (aria-expanded managed) revealing a vertical menu
- Sections get scroll margin so anchors land under the fixed bar

## Done when

Nav markup + scrolled/hamburger behavior present in built output; smoke-test nav assertions pass.
