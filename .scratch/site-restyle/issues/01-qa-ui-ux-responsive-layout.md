# 01 — QA: responsive UI/UX improvements across hero, nav, and entry rows

Status: ready-for-agent
Labels: ready-for-agent

## Summary

QA pass and implementation of the responsive UI/UX improvements defined in the amended spec (see `.scratch/site-restyle/spec.md` → "Amendment: Responsive UI/UX"). Goal: make the restyled page deterministic and usable at laptop, tablet, and mobile widths, with a mobile navigation drawer and stacked entry rows.

## Type

QA / UI / UX improvement

## Scope

- Hero layout at ≥ 900px, < 900px, and < 700px breakpoints
- Mobile top bar + right-side slide-in nav drawer
- Research project and Publication entry rows at ≤ 900px

## Acceptance criteria

### Hero — ≥ 900px (laptop)
- [ ] Hero is a row: left column 40%, right column 60%
- [ ] Left column stacks headshot, then email on its own line, then `CV | GitHub | LeetCode | Kaggle` on one line
- [ ] 4rem gap between the name title and the intro statement

### Hero — < 900px (tablet)
- [ ] Hero remains a row
- [ ] Image section and intro section are centered toward each other (tighter centered alignment)

### Hero — < 700px (mobile)
- [ ] Hero stacks vertically: image on top, socials below image, intro below that
- [ ] Image is 50% width, centered, in a flex column
- [ ] Email on its own line; remaining socials on one line

### Mobile navigation
- [ ] Top bar is always visible on scroll
- [ ] Top bar shows the menu icon and "Aagam Sheth"
- [ ] Tapping the menu icon slides a side nav in from the right
- [ ] Tapping a nav item scrolls to that section and closes the drawer

### Entry rows — ≤ 900px
- [ ] Research project and Publication rows stack thumbnail-above-info
- [ ] Stacking persists at all smaller widths (no reversion to side-by-side)

### Cross-cutting
- [ ] No horizontal scroll at any tested width
- [ ] `npm run validate` passes
- [ ] `npm run build` succeeds and emits a single index.html
- [ ] Smoke test (per spec Testing Decisions) asserts the new responsive markup/classes

## References

- Amended spec: `.scratch/site-restyle/spec.md` (Amendment: Responsive UI/UX)
- Domain glossary: `CONTEXT.md` (Academic reader, Industry reader, Section, Entry, Template, Intro statement, Placeholder)
- Consumer rules: `docs/agents/domain.md`

## Notes

- Placeholders (Publications, CV) remain visible throughout; do not hide or replace them
- Light-only; no dark-mode variant
- Implement against the extracted design-token system; flag deviations rather than smoothing them over

## Comments
