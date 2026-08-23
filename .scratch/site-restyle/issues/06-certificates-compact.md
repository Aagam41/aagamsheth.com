# 06 — Certificates: compact one-line-per-entry

Status: resolved
Type: task
Blocked by: 01

## What

- Flip the Certificates Section default Template to the compact variant (one line per credential: month-year pill, name, issuer)
- Extend `templates/certificates/compact.hbs` to include the month-year pill as described
- Strip redundant per-entry `template: "default"` pins from `content/certificates.yaml` so entries inherit the Section default — credential data itself unchanged

## Done when

Built page renders 15 one-line rows matching the entry count; smoke-test certificate assertions pass.
