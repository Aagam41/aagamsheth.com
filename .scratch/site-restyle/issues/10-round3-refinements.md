# Ticket 10 — Round-3 refinement pass

Status: resolved

Owner feedback after round 2 (commit 2759ccc):

1. Floating right-hand outline nav like docs sites (replaces top bar ≥1100px; hamburger bar stays below).
2. News hanging indent: continuation lines start where the first text line starts.
3. Research projects get [GitHub] / [Paper] / [Video] style links (`links` field).
4. Experience → "Work Experience", LinkedIn-style rows with dates inline after company.
5. Smaller font sizes overall.

Implementation: smoke-test updated first (12 new/red checks), then side-nav component + scrollspy in page.hbs, CSS clamps scaled down, news pl-[6ch]/absolute date, exp template reorder, site.yaml title, research.yaml links arrays. All 65 checks green.
