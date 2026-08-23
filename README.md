# Personal Site

A one-page personal/academic site. No database, no server, no login panel —
you edit plain YAML files right in GitHub's website, and the site rebuilds
itself automatically.

---

## How to edit content (your "admin panel")

1. Go to your repo on GitHub.com and open the **`content/`** folder.
2. Click the file for the section you want to change (e.g. `news.yaml`,
   `education.yaml`, `publications.yaml`, `research.yaml`,
   `engineering-oss.yaml`, `experience.yaml`,
   `other.yaml`, `certificates.yaml`, `contact.yaml`).
3. Click the pencil icon (✏️) in the top right to edit.
4. Add, remove, or change entries. Each entry starts with `- ` and has a few
   fields — comments at the top of each file explain them.
5. Scroll down, click **"Commit changes"**.
6. Wait ~30–60 seconds. Check the **Actions** tab to watch it build. When the
   green checkmark appears, your live site is updated.

To change your name, photo, bio, contact links, or to **reorder / rename /
hide sections**, edit **`content/site.yaml`** instead.

### Adding a new entry (example: a new publication)

Open `content/publications.yaml` and add a new block at the top or bottom
(order doesn't matter if sort is `date`, since it auto-sorts by the `date`
field):

```yaml
- date: "2026-05-01"
  title: "My New Paper Title"
  authors:
    - "Some Coauthor"
    - "**Jane A. Doe**"
  venue: "Some Conference 2026"
  image: "assets/img/my-new-paper.png"
  links:
    - label: "pdf"
      url: "https://example.com/paper.pdf"
  template: "detailed"
```

- `**Jane A. Doe**` (double asterisks) makes your name **bold** automatically.
- `[link text](https://example.com)` inside any `text` field makes a clickable link.
- `template: "detailed"` or `template: "compact"` picks which layout to use for
  that one entry — leave it out to use the section's default (set in `site.yaml`).

### Uploading images / your CV

1. Go to `assets/img/` (for images) or `assets/files/` (for your CV PDF) in
   the GitHub web UI.
2. Click **"Add file" → "Upload files"**, drag your file in, commit.
3. Reference it in the relevant yaml file, e.g. `image: "assets/img/your-file.jpg"`.

### Reordering or hiding a section

Open `content/site.yaml`, find the `sections:` list, and either reorder the
blocks (top to bottom = order on the page) or set `enabled: false` on a
section to hide it without deleting its content.

---

## First-time setup

### 1. Create the repo

1. Create a new **public** GitHub repository (Pages requires public unless
   you have GitHub Pro/Enterprise).
2. Push all these files to the `main` branch.

### 2. Turn on GitHub Pages

1. In your repo: **Settings → Pages**.
2. Under **"Build and deployment" → Source**, choose **"GitHub Actions"**
   (not "Deploy from a branch").
3. Push any commit to `main` (or go to the **Actions** tab and run the
   "Build and Deploy Site" workflow manually). This triggers the first build.
4. After it finishes (green check), your site is live at:
   `https://<your-username>.github.io/<repo-name>/`

### 3. Connect your custom domain

1. **At your domain registrar** (Namecheap, GoDaddy, Google Domains, etc.),
   add these DNS records:

   **If using an apex/root domain (`example.com`):**
   | Type | Name | Value |
   |------|------|-------|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |

   **If using a subdomain (`www.example.com`):**
   | Type | Name | Value |
   |------|------|-------|
   | CNAME | www | `<your-username>.github.io` |

   (You can set up both the apex and `www` and let GitHub redirect one to
   the other — see step 3 below.)

2. **In your repo**, create a file literally named `CNAME` (no extension) at
   the repo root, containing just your domain, e.g.:
   ```
   example.com
   ```
   The build workflow already copies this file into the deploy output
   automatically if it exists — you just need to add it once.

3. **In GitHub: Settings → Pages → Custom domain**, enter your domain and
   save. Wait for DNS to verify (can take a few minutes to a few hours).
   Once verified, tick **"Enforce HTTPS"**.

Full official reference if anything looks different by the time you set
this up: <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site>

---

## Local development (optional)

You don't need Node.js installed to *edit content* — GitHub Actions does the
building for you. This is only if you want to preview changes on your own
computer before committing.

```bash
npm install
npm run dev      # builds index.html + CSS once
npx serve .       # or: python3 -m http.server 8000
```

---

## Project structure

```
content/
  site.yaml           ← header, contact links, section order/titles/templates
  news.yaml
  education.yaml
  publications.yaml
  research.yaml         ← research projects (UAV tracking, clinical ML, …)
  engineering-oss.yaml  ← open-source contributions + shipping work
  experience.yaml
  other.yaml
  certificates.yaml
  contact.yaml

templates/
  page.hbs            ← overall page shell (rarely needs editing)
  news/default.hbs, news/compact.hbs
  education/default.hbs, education/compact.hbs
  publications/detailed.hbs, publications/compact.hbs
  projects/detailed.hbs, projects/compact.hbs
  experience/default.hbs, experience/compact.hbs
  other/default.hbs, other/compact.hbs
  certificates/default.hbs, certificates/compact.hbs
  contact/default.hbs, contact/compact.hbs

assets/
  css/input.css        ← source styles (Tailwind)
  css/style.css         ← built CSS (generated, committed for convenience)
  img/                  ← photos, teasers
  files/                ← CV PDF etc.

scripts/
  build.js              ← reads yaml + templates, writes index.html
  validate.js            ← checks yaml for errors before build/deploy
  smoke-test.js          ← runs the pipeline and asserts the built page

.github/workflows/deploy.yml   ← validates, builds, deploys on every push
```

### Adding a brand-new template variant

Say you want a third publication layout called `minimal`:

1. Create `templates/publications/minimal.hbs` using the same `{{fields}}`
   as the existing publication templates.
2. In `content/publications.yaml`, set `template: "minimal"` on any entry
   that should use it.

No build script changes needed — it's picked up automatically.

## Tech stack (all open-source / free)

- [Node.js](https://nodejs.org/) — build runtime
- [Handlebars](https://handlebarsjs.com/) (MIT) — templating
- [js-yaml](https://github.com/nodeca/js-yaml) (MIT) — YAML parsing
- [Tailwind CSS](https://tailwindcss.com/) (MIT) — styling
- [GitHub Actions](https://github.com/features/actions) — free CI for public repos
- [GitHub Pages](https://pages.github.com/) — free static hosting
