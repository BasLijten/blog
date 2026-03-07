# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # Start dev server at localhost:8000
yarn build        # Production build (with experimental page build on data changes)
yarn lint         # ESLint on .js/.jsx files
yarn format       # Prettier formatting for src JS and content Markdown
```

No test framework is configured — `yarn test` just prints a reminder.

## Architecture

Gatsby v5 blog deployed on Netlify. Content is Markdown; pages are generated at build time.

**Key files:**
- `gatsby-config.js` — plugins and site metadata
- `gatsby-node.js` — page generation: blog posts, paginated index (10/page), tag pages
- `src/templates/` — `blog-post.js`, `blog-list.js`, `tags.js` (use GraphQL page queries)
- `src/components/` — `layout.js` (sidebar + content wrapper), `sidebar.js`, `seo.js`
- `src/styles/` — SCSS partials imported into `main.scss`
- `netlify.toml` — security headers and CSP policy

## Blog Post Content

Each post lives at `content/blog/[slug]/index.md` with images in `content/blog/[slug]/images/`.

Required frontmatter:
```yaml
---
title: "Post title"
date: YYYY-MM-DD
categories: [tag1, tag2]
img: ./images/banner.jpg
---
```

- `categories` drives auto-generated tag pages (kebab-cased URLs at `/tags/[tag]/`)
- Images must be co-located with the markdown file for `gatsby-remark-images` to process them
- Use relative paths for all images
- Use `GatsbyImage` component (not `<img>`) in React components

## Remark Plugins

- `gatsby-remark-highlight-code` — Carbon terminal, Dracula theme (not PrismJS)
- `gatsby-remark-embed-video` — YouTube embeds use `youtube-nocookie.com`
- `gatsby-remark-katex` — math rendering
- `gatsby-remark-images` — auto WebP/AVIF conversion, maxWidth 970px

## Deployment

Netlify with `netlify-plugin-gatsby-cache`. Node 18, Yarn 1.x. The CSP in `netlify.toml` explicitly allows Google Analytics/GTM, GitHub Gists, Twitter embeds, and YouTube (privacy mode only) — update it when adding new external resources.
