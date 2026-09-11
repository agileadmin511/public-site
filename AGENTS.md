# AGENTS.md

## Mission

This repository is a personal software/infrastructure publication and knowledge base. Optimize changes for simplicity, security, portability, maintainability, and authoring experience, in that order.

> This is a static Astro site. Do not introduce a backend, database, CMS, server-side runtime, or containerized production infrastructure without explicit approval.

Do not add authentication, analytics, comments, search, external image storage, a UI framework, or a third-party deployment service unless a concrete request requires it. Ask before making any change that materially expands the architecture, operating cost, credential surface, or production runtime.

## Architecture

- Astro statically generates the entire production site into `dist/`.
- Markdown/MDX and repository assets are the source of truth.
- GitHub Actions validates pull requests and deploys `main`.
- GitHub Pages serves only static output behind a custom domain and HTTPS.
- Production does not run Node.js, Docker, a database, or an application server.

## Content

Content collections are declared in `src/content.config.ts`:

- `src/content/blog/` → `/blog/<id>/`
- `src/content/guides/` → `/guides/<id>/`
- `src/content/projects/` → `/projects/<id>/`

Required frontmatter: `title`, `description`, `pubDate`. Optional fields: `updatedDate`, `tags`, `draft`. Keep the schema narrow; add metadata only to support a real publishing feature.

Production-visible collection queries must use `visibleEntries()` from `src/lib/content.ts` or equivalent draft filtering. A document with `draft: true` must not produce a production page or appear in an index, RSS, or sitemap. Development mode intentionally shows drafts.

Published filenames are public IDs and URLs. Do not rename them casually. Place static content images in `public/images/`; use descriptive names, alt text, and intrinsic dimensions.

## Site configuration

`src/config.ts` is the central source for the publication identity, canonical origin, GitHub Pages base path, author, social link, and navigation. `astro.config.mjs` imports the canonical origin and base path. Internal links in templates must use `sitePath()` from `src/lib/url.ts`; links authored directly in Markdown should be relative. Do not scatter domains, repository paths, or brand values through templates.

Shared design tokens and responsive rules live in `src/styles/global.css`. Preserve the restrained, readable engineering-publication character. Prefer semantic HTML and CSS. The site must remain functional without client-side JavaScript.

## Commands

```bash
npm install
npm run dev
npm run format:check
npm run check
npm test
npm run preview
```

Before handing off a code change, run at minimum:

```bash
npm run check
npm test
```

Run `npm run format` only when formatting changes are intended; inspect the diff afterward. `npm test` performs the production build and checks representative pages, draft exclusion, RSS, sitemap, metadata, and the no-JavaScript baseline.

## Deployment

- `.github/workflows/ci.yml`: read-only validation for PRs and non-main pushes.
- `.github/workflows/preview.yml`: read-only PR build plus a short-lived downloadable artifact.
- `.github/workflows/deploy.yml`: official Astro/GitHub Actions production deployment from `main`.

GitHub's official Pages PR-preview mode is not publicly available. Do not work around this with `pull_request_target`, broad write permissions, a third-party host, or a branch-publishing action without explicit approval and a security review.

Keep GitHub Actions permissions least-privilege. Pin actions to current reviewed major versions or immutable SHAs. Never commit credentials, tokens, private certificates, personal data, `.env` files, or generated `dist/` output.

## Dependency principles

Keep dependencies small and established. Prefer Astro core, official integrations, browser capabilities, or a small local function. Do not add React, Vue, Svelte, a component framework, or heavy client-side JavaScript unless an actual interaction requires it.

Preserve `package-lock.json`. When changing dependencies, verify the lockfile, run the checks, and review the install audit. Do not upgrade unrelated packages as drive-by cleanup.

## Accessibility and quality

Maintain semantic headings, keyboard-operable navigation, visible focus styles, meaningful link text, sufficient contrast, responsive layouts, and at least 16px body copy. Images need appropriate alt text and dimensions. Avoid animation and respect reduced-motion preferences if motion is ever added.

Metadata comes from layouts and the content schema. Each page needs a unique title, description, canonical URL, Open Graph fields, and useful semantic headings. Keep RSS at `/rss.xml`, robots at `/robots.txt`, and sitemap generation enabled.

## Change discipline

- Preserve unrelated user changes in a dirty worktree.
- Use idiomatic Astro conventions for the installed version.
- Prefer small, reversible changes over speculative abstractions.
- Add tests for publishing invariants, not implementation trivia.
- Update README and this file when workflows, authoring conventions, or architecture change.
- Do not add future features merely to make them easier later. The content collections already provide a clean path for additional types such as notes.
