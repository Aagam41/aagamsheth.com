# Ticket 11 — Round-4 refinement pass

Status: resolved

Owner feedback after round 3 (commit 66f548b):

1. Change the contact section layout → card with lead line + channels row.
2. Obfuscate the email (no plaintext/mailto in static HTML); remove phone number.
3. Hero photo = portrait layout at 25% section width.
4. Add space between hero description and News.
5. Publications always have a thumbnail (third entry moved to detailed + teaser image).
6. Other section less text-ridden → lead line + interest pills.

Implementation: smoke-test updated first (10 red checks), then emailParts Handlebars helper in build.js, runtime assembly script in page.hbs, CSS for photo/contact/other, content yaml rewrites. All 76 checks green.
