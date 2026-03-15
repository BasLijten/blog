# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal tech blog by Bas Lijten (Sitecore MVP) at https://blog.baslijten.com. Built with Gatsby v5 + React + SCSS + Markdown, deployed on Netlify.

## Commands

```bash
yarn dev              # Start development server (localhost:8000)
yarn build            # Production build with GATSBY_EXPERIMENTAL_PAGE_BUILD_ON_DATA_CHANGES
yarn lint             # ESLint check on .js/.jsx files
yarn format           # Prettier format JS/JSX and Markdown
```

No test suite is configured (placeholder only).

## Architecture

**Content pipeline**: Markdown files in `content/blog/[slug]/index.md` → `gatsby-transformer-remark` → GraphQL → page templates

**Page generation** (`gatsby-node.js`):
- Reads all markdown nodes, creates slug fields from file paths
- Generates paginated blog list pages (10 posts/page) with prev/next context
- Generates individual post pages with previous/next navigation
- Generates tag archive pages using `lodash.kebabCase` on frontmatter categories

**Templates** (`src/templates/`):
- `blog-post.js` — single post, uses page-level GraphQL query, class component
- `blog-list.js` — paginated index with prev/next page navigation
- `tags.js` — archive page for a single tag

**Layout** (`src/components/layout.js`): Uses `StaticQuery` (not hooks) to read site metadata once; wraps all pages with sidebar + main content.

**Styling**: SCSS partials loaded via `main.scss`. Import order matters: normalize → variables → syntax → component partials.

## Blog Post Frontmatter

```yaml
title: "Post Title"
date: "YYYY-MM-DD"
categories: ["tag1", "tag2"]
description: "SEO description"
img: ./images/header.jpg
```

- Images must be co-located with their post (`content/blog/[slug]/images/`)
- Tag pages are auto-generated from `categories` — do not create manually
- Use `GatsbyImage` component, not `<img>` tags

## Content Features

- **Code highlighting**: `gatsby-remark-highlight-code` with Dracula theme (DeckDeckGo web component)
- **Video embeds**: `youtube: https://www.youtube.com/embed/VIDEO_ID` in markdown (privacy mode)
- **Math**: KaTeX syntax blocks via `gatsby-remark-katex`
- **RSS feed**: Auto-generated at `/rss.xml`

## Security

`netlify.toml` contains a strict CSP. When adding new third-party scripts or embeds, update the CSP allowlist in `netlify.toml` accordingly. Current allowlist covers: Google Analytics, YouTube (privacy mode), GitHub Gists, Twitter embeds, Report URI.
