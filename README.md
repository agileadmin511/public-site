# Systems Field Notes

A static-first technical blog and knowledge base built with Astro, Markdown/MDX, GitHub Actions, and GitHub Pages. The starter includes separate collections for time-oriented posts, evergreen guides, and project write-ups.

> The repository ships with example branding and content. Before launch, update `src/config.ts`, replace the example documents, and configure the real domain.

## Architecture

```text
Markdown / MDX
      ↓
    GitHub
      ↓
GitHub Actions
      ↓
 Astro build
      ↓
GitHub Pages
      ↓
Custom domain + HTTPS
```

Astro and Node.js run during authoring and CI only. Production is the generated `dist/` directory: HTML, CSS, XML, SVG, and other static assets. There is no database, CMS, application server, or production container.

## Requirements

- Node.js 24 (the version used in CI; Node 22.12 or later is supported)
- npm
- Git

## Local development

```bash
npm install
npm run dev
```

Astro prints a local URL, normally `http://localhost:4321`. Development mode includes content marked `draft: true` so unpublished work can be reviewed locally.

Build and inspect the production output:

```bash
npm run build
npm run preview
```

Run the same checks used by CI:

```bash
npm run format:check
npm run check
npm test
```

`npm test` builds the site and verifies representative routes, metadata, RSS, sitemap output, and draft exclusion.

## Creating content

Choose the collection that matches the document:

| Content  | Location                | URL                     | Use it for                             |
| -------- | ----------------------- | ----------------------- | -------------------------------------- |
| Blog     | `src/content/blog/`     | `/blog/<filename>/`     | Experience, opinion, and timely notes  |
| Guides   | `src/content/guides/`   | `/guides/<filename>/`   | Durable, task-focused documentation    |
| Projects | `src/content/projects/` | `/projects/<filename>/` | Build notes and architecture decisions |

Create a `.md` file for ordinary writing. Use `.mdx` only when an Astro component materially improves the article.

```markdown
---
title: 'Understanding Linux namespaces'
description: 'A practical introduction to Linux namespaces.'
pubDate: 2026-09-10
updatedDate: 2026-09-12
tags:
  - linux
  - containers
draft: false
---

Write the article here.
```

`title`, `description`, and `pubDate` are required. `updatedDate` is optional; `tags` defaults to an empty list and `draft` defaults to `false`. An invalid document fails the build with a content-schema error.

Filenames become public URLs. Treat a published filename as immutable; changing it breaks existing links.

### Drafts

Set `draft: true` while an article is in progress. Drafts appear under `npm run dev`, but production builds omit their pages and remove them from indexes, RSS, and the sitemap.

### Images

Store repository-managed images under `public/images/` using descriptive filenames. Reference them from the site root:

```html
<img
  src="/images/network-path.svg"
  width="960"
  height="420"
  alt="A request moving through four network services"
/>
```

Always provide meaningful alt text plus intrinsic width and height. Resize and compress large raster images before committing them. Astro's optimized image component can be adopted later if image-heavy content makes it worthwhile.

## Configuration and branding

The central site settings live in `src/config.ts`:

- publication name and short name
- tagline and description
- canonical URL
- author
- GitHub link
- primary navigation

The Astro configuration imports the same canonical URL, so it is not duplicated. Change the logo in `src/components/Logo.astro`, the browser icon in `public/favicon.svg`, and design tokens near the top of `src/styles/global.css`.

The placeholder domain is `https://blog.example.com`. Replace it before the first production deployment.

## Publishing workflow

For a new article:

```bash
git switch -c post/article-name
# write and preview the article
npm test
git add .
git commit -m "Add article name"
git push -u origin post/article-name
```

Open a pull request, review the checks and preview artifact, then merge to `main`. Merging triggers the production workflow automatically.

### Pull-request previews

`.github/workflows/preview.yml` creates a seven-day `dist/` artifact for every pull request. Download it from the workflow run and serve the extracted directory locally with one of these commands:

```bash
npx serve .
# or
python -m http.server
```

GitHub's official Pages deploy action exposes a `preview` input, but public PR preview deployments are not currently available. This repository therefore does not grant write permissions to untrusted PR code or add a third-party host merely to obtain a URL. If a clickable hosted preview becomes a firm requirement, choose and review a preview service explicitly; that decision expands the deployment architecture and credentials surface.

## GitHub Pages deployment

The production workflow uses Astro's official Pages build action and GitHub's official deploy action. It does not commit `dist/`.

1. Push this project to a GitHub repository whose production branch is `main`.
2. In **Settings → Pages → Build and deployment**, choose **GitHub Actions** as the source.
3. In **Settings → Environments → github-pages**, optionally restrict deployments to `main`.
4. Replace the placeholder `SITE.url` in `src/config.ts`.
5. Add the real hostname under **Settings → Pages → Custom domain**.
6. Push to `main` or manually run **Deploy to GitHub Pages**.

GitHub ignores and does not require a `CNAME` file when Pages publishes through a custom Actions workflow, so this repository does not include one.

The deploy workflow has `contents: read`, `pages: write`, and `id-token: write`. CI and PR preview workflows are read-only.

## Custom domain and DNS

Configure the custom domain in the GitHub repository's **Settings → Pages** area before changing DNS. GitHub displays domain verification and DNS status there.

For a subdomain such as `blog.example.com`:

```text
Type: CNAME
Name: blog
Value: <your-github-username>.github.io
```

For an apex domain such as `example.com`, add all four `A` records:

```text
@  A  185.199.108.153
@  A  185.199.109.153
@  A  185.199.110.153
@  A  185.199.111.153
```

IPv6 support is optional; if enabled, keep the `A` records and add all four `AAAA` records:

```text
@  AAAA  2606:50c0:8000::153
@  AAAA  2606:50c0:8001::153
@  AAAA  2606:50c0:8002::153
@  AAAA  2606:50c0:8003::153
```

Alternatively, a DNS provider that supports apex `ALIAS` or `ANAME` records can point `@` to `<your-github-username>.github.io`. Do not use wildcard DNS records. GitHub recommends also pointing `www` to `<your-github-username>.github.io` with a `CNAME` when using an apex domain. After GitHub confirms the domain, enable **Enforce HTTPS**.

Keep two values aligned:

1. `SITE.url` in `src/config.ts`, including `https://` and no trailing slash
2. The custom domain in GitHub Pages settings

The generated canonical links, Open Graph URLs, RSS URLs, robots file, and sitemap all derive from the centralized URL.

## Automation

- `ci.yml` runs formatting, Astro/type checks, schema validation, a production build, and output tests on pull requests and non-main pushes.
- `preview.yml` builds and stores a short-lived PR preview artifact with read-only repository access.
- `deploy.yml` builds and deploys `main` using the official Astro and GitHub Pages actions.

Dependabot or automated dependency updates are intentionally not preconfigured. Add them only if the repository owner wants that maintenance workflow.

## Dependency policy

The application dependencies are Astro plus official Astro integrations for MDX, RSS, sitemap generation, and Markdown processing. `remark-gfm` enables explicit GitHub-Flavored Markdown behavior. Prettier and Astro's checker are development-only safeguards.

Before adding a package, prefer Astro's platform, the browser platform, or a small local function. Avoid UI frameworks and client JavaScript unless a concrete interactive requirement appears.

## Troubleshooting

### A content file fails the build

Read the reported collection, filename, and frontmatter field. Dates must be valid dates, tags must be a YAML list, and the three required strings cannot be empty.

### A draft appears in production

Run `npm test`. The build verification checks the draft route, blog index, RSS feed, and sitemap. Content filtering should go through `visibleEntries()` in `src/lib/content.ts`.

### The deployed site has broken links or assets

This starter assumes a custom domain and root-relative URLs. Confirm `SITE.url`, `public/CNAME`, and the Pages custom-domain setting agree. If deploying to `username.github.io/repository` without a custom domain, configure Astro's `base` option and update internal URL construction consistently.

### GitHub Pages deployment fails

Confirm Pages uses **GitHub Actions** as its source, Actions are enabled, the `github-pages` environment permits `main`, and the lockfile is committed. Open the failed job before rerunning it; build failures are usually content validation errors.

### RSS or sitemap URLs show the placeholder domain

Replace `SITE.url` in `src/config.ts`, rebuild, and confirm the generated files in `dist/`.

## Repository map

```text
.github/workflows/       CI, preview artifact, and deployment
public/                  Copied static assets
src/components/          Header, footer, logo, and content cards
src/content/             Markdown and MDX source
src/layouts/             Shared page and article structures
src/lib/                 Content filtering and date helpers
src/pages/               Routes, RSS, and robots endpoint
src/styles/              Global visual system
tests/                   Generated-output checks
```

## License

[MIT](LICENSE)
