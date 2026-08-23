# 02 — Design tokens: Nunito, black-on-white, single blue accent

Status: resolved
Type: task
Blocked by: 01

## What

Replace the serif/paper Tailwind theme with the extracted system:

- Nunito (variable, weights ~200–1000) as the sole font family; loaded via Google Fonts in `templates/page.hbs`
- White background, black text (`#000000`), accent blue `#1772d0`
- Body text ~18px, name heading ~40px regular weight, Section headings bold ~30px
- No `prefers-color-scheme` rules anywhere (light only)
- Pill link component `.pill-link`: small uppercase bold labels (~11px, wide letter-spacing), thin accent border, fills accent-blue with white text on hover

Old tokens (`paper`, `ink #333332`, `muted`, `accent #2673b9`, `hairline`, `highlight`, Georgia) must be fully gone from config and CSS.

## Done when

`npm run css` builds cleanly; smoke-test token assertions pass for this slice.
