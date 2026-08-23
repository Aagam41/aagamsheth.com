# 14 — Round-8: three-paragraph tagline + email display form

Status: done

- site.yaml: tagline is a 3-item list (owner-supplied text).
- build.js: tagline list → per-item <p>; emailParts normalizes "[at]/[dot]"
  tokens in the yaml value before re-emitting canonical display + data attrs.
- page.hbs: hero-intro wrapper <p> → <div>; socials line keeps
  {{emailParts header.email}} (restored after accidental hand-edit).
- input.css: .hero-intro p margins (+ mt-3 between paragraphs).
- Owner changes kept: News disabled, education copy, new images.

Smoke tests first: 3 paragraphs in hero-intro div, tirthinfotech.com link,
exact "contact [dot] me [at] aagamsheth [dot] com" label, intact
data-user/data-domain, no plaintext address, no old "contact.me [at]" form,
news renders nothing while disabled. All 94 checks green.
