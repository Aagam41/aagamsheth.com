# Aagam Sheth's Academic Site

A one-page hybrid site serving two audiences at once: an academic homepage (research-led) and a professional portfolio. YAML content is rendered through Handlebars templates into one static HTML page deployed by GitHub Actions.

## Language

### Audiences

**Academic reader**:
A professor, peer, or admissions committee evaluating research potential. Served primarily by the hero statement, News, Publications, and research Projects.
_Avoid_: researcher (ambiguous — the site owner is also a researcher)

**Industry reader**:
A recruiter or engineer evaluating shipping ability. Served primarily by Experience, Skills, Certificates, and engineering Projects.
_Avoid_: employer, recruiter (each names only part of this audience)

### Page anatomy

**Section**:
A titled block of the single page (News, Publications, Projects, …), configured and ordered in `site.yaml`.
_Avoid_: block, module

**Entry**:
One item rendered inside a Section (one paper, one project, one news line).
_Avoid_: item, card, post

**Template**:
A Handlebars file that renders an Entry. Sections have a default Template; individual Entries may override it.
_Avoid_: layout, partial

### Content model

**Intro statement**:
The short first-person bio paragraph(s) in the hero — who, where, what — without numbered threads or taglines.
_Avoid_: research statement (that implies Pratyusha-style numbered threads, explicitly rejected)

**Placeholder**:
A stand-in Entry with visibly fake data, kept in place until real content exists.
_Avoid_: dummy, sample data, lorem
