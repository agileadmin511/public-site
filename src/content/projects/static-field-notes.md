---
title: 'Systems Field Notes'
description: 'The architecture and constraints behind this static technical publication.'
pubDate: 2026-09-10
tags:
  - astro
  - static-site
  - github-actions
draft: false
---

> Example project: adapt this page to describe your own implementation.

This publication is deliberately small: Markdown is the source, Git is the editorial history, Astro is the compiler, and GitHub Pages serves static files.

## Architecture

```text
Markdown → GitHub → GitHub Actions → Astro → GitHub Pages
```

There is no production Node.js process, database, container, CMS, or application server. That constraint removes entire categories of patching and runtime failure.

## A document moves through the system

1. An author creates a Markdown file with validated frontmatter.
2. A pull request runs type, format, content, and build checks.
3. The preview artifact makes the generated site available for review.
4. A merge to `main` produces and deploys a fresh static artifact.

## Content metadata

```json
{
  "title": "Understanding Linux namespaces",
  "description": "A practical introduction.",
  "tags": ["linux", "containers"],
  "draft": false
}
```

The schema stays intentionally narrow. Metadata earns its place by powering a visible feature or a publishing invariant.

## Highlighting coverage

Representative examples keep the publication's common languages exercised without loading a client-side highlighter:

```javascript
export const healthy = (response) =>
  response.status >= 200 && response.status < 300;
```

```python
def bounded_retry(attempt: int) -> bool:
    return attempt < 3
```

```rust
fn main() {
    println!("static by design");
}
```

```dockerfile
FROM scratch
COPY public/ /public/
```

## Operating principle

The source should remain useful if the site generator changes. Articles are ordinary Markdown, images live beside the repository, and URLs do not contain implementation details.
