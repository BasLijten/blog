# AGENTS.md

## Rules for all agents

Before marking any task as finished, always:

1. Run `yarn build` and confirm it succeeds
2. Start `yarn dev` in the background and wait for the dev server to be ready
3. Run the following smoke test with `playwright-cli`:
   - `playwright-cli open http://localhost:8000` — open the homepage
   - `playwright-cli snapshot` — verify the homepage renders with blog post links
   - Click on a blog post link from the snapshot
   - `playwright-cli snapshot` — verify the blog post page renders with content
   - `playwright-cli close` — close the browser
4. Stop the dev server

Do not consider work complete until the build and the smoke test both pass.

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

Netlify with `netlify-plugin-gatsby-cache`. Node 22.12.0, Yarn 1.22.22. The CSP in `netlify.toml` explicitly allows Google Analytics/GTM, GitHub Gists, Twitter embeds, and YouTube (privacy mode only) — update it when adding new external resources.

## Agent skills

### Issue tracker

Issues and specs live in GitHub Issues and are managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the canonical labels `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, and `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repository; domain context lives in `CONTEXT.md` and architectural decisions in `docs/adr/`. See `docs/agents/domain.md`.
