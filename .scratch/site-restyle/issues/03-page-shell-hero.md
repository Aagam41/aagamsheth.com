# 03 — Page shell: 1000px column + photo-column hero

Status: resolved
Type: task
Blocked by: 02

## What

Rework `templates/page.hbs` shell to a centered 1000px container. Hero becomes a flex row:

- narrow left column stacking headshot, contact icons/email, and the link row
- right column holds the existing Intro statement text unchanged (mini-markdown rendering preserved)
- name as an ~40px regular-weight heading above the row

Existing bio copy, photo, email, and the four links (CV, GitHub, LeetCode, Kaggle) stay exactly as configured in `site.yaml`.

## Done when

Built page shows photo-column-plus-intro-statement hero; smoke-test hero assertions pass.
