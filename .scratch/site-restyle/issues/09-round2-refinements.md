# Ticket 09 — Round-2 refinement pass

Status: resolved

Owner feedback after round 1 (commit dd9badd):

1. Width: a bit less than 1100px → 1000px (Anjali's exact content width).
2. Fonts/sizes EXACTLY Anjali Gupta's (copy her clamp() values verbatim) + more spacing between sections.
3. Education: add a coursework line per school (`courses` field).
4. Research Projects: publication-like layout — description line, institute·date line, authors line (`org`/`dates`/`authors` fields).
5. Engineering Projects: same layout.

Implementation: smoke-test expectations updated first (5 new checks → red), then input.css clamps/width/mb-16/.entry-meta/.edu-courses, projects templates restructured, content YAMLs split org/dates out of descriptions, education courses added. All 57 checks green.
