# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- test: verify non-dependabot PRs are not auto-approved -->

## Project Overview

Personal tech blog by Bas Lijten (Sitecore MVP) at https://blog.baslijten.com. Built with Gatsby v5 + React + SCSS + Markdown, deployed on Netlify.

## Commands

```bash
yarn dev              # Start development server (localhost:8000)
yarn build            # Production build with experimental page optimization
yarn lint             # ESLint check on .js/.jsx files
yarn format           # Prettier format JS/JSX and Markdown
```

No test framework is configured — `yarn test` just prints a reminder.

## Architecture

**Content pipeline**: Markdown files in `content/blog/[slug]/index.md` → `gatsby-transformer-remark` → GraphQL → page templates

**Page generation** (`gatsby-node.js`):
- Reads all markdown nodes, creates slug fields from file paths
- Generates paginated blog list pages (10 posts/page) with prev/next context
- Generates individual post pages with previous/next navigation
- Generates tag archive pages using `lodash.kebabCase` on frontmatter categories

**Key files:**
- `gatsby-config.js` — plugins and site metadata
- `gatsby-node.js` — page generation: blog posts, paginated index (10/page), tag pages
- `src/templates/` — `blog-post.js`, `blog-list.js`, `tags.js` (use GraphQL page queries)
- `src/components/` — `layout.js` (StaticQuery sidebar + content wrapper), `sidebar.js`, `seo.js`
- `src/styles/` — SCSS partials imported into `main.scss` (import order: normalize → variables → syntax → components)
- `netlify.toml` — security headers and CSP policy

## Blog Post Content

Each post lives at `content/blog/[slug]/index.md` with images in `content/blog/[slug]/images/`.

Required frontmatter:
```yaml
title: "Post title"
date: "YYYY-MM-DD"
categories: ["tag1", "tag2"]
description: "SEO description"
img: ./images/banner.jpg
```

- `categories` drives auto-generated tag pages (kebab-cased URLs at `/tags/[tag]/`) — do not create tag pages manually
- Images must be co-located with the markdown file for `gatsby-remark-images` to process them
- Use `GatsbyImage` component (not `<img>`) in React components

## Remark Plugins

- `gatsby-remark-highlight-code` — Dracula theme via DeckDeckGo web component (not PrismJS)
- `gatsby-remark-embed-video` — YouTube embeds use privacy mode (`youtube-nocookie.com`)
- `gatsby-remark-katex` — math rendering
- `gatsby-remark-images` — auto WebP/AVIF conversion

## Deployment

Netlify with `netlify-plugin-gatsby-cache`. Node 18, Yarn 1.x. The CSP in `netlify.toml` explicitly allows Google Analytics/GTM, GitHub Gists, Twitter embeds, and YouTube (privacy mode only) — update it when adding new external resources.
