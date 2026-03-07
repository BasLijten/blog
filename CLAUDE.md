# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev              # Start development server at localhost:8000
yarn build            # Production build (with experimental page build on data changes)
yarn lint             # ESLint on .js/.jsx files (excludes public/)
yarn format           # Prettier formatting for src/**/*.js and content/**/*.md
```

No test suite exists — the test script only prints a placeholder message.

## Architecture

**Tech Stack**: Gatsby v5 + React 18 + SCSS + Markdown content, deployed on Netlify.

**Page generation** (`gatsby-node.js`):
- Blog posts: one page per markdown file, with previous/next context for navigation
- Paginated list pages: 10 posts per page, root `/` is page 1
- Tag pages: auto-generated at `/tags/[kebab-case-tag]/` from frontmatter `tags` field

**Component structure** (`src/`):
- `templates/blog-post.js`, `blog-list.js`, `tags.js` — page templates using GraphQL page queries
- `components/layout.js` — sidebar + main content wrapper
- `components/sidebar.js` — sidebar with author info and social links
- `components/seo.js` — React Helmet with OpenGraph meta tags

**Styling**: SCSS with partials imported into `main.scss` (order matters for normalize, variables, syntax highlighting).

## Content

Blog posts live in `content/blog/[slug]/index.md` with co-located images in `content/blog/[slug]/images/`.

Required frontmatter:
```yaml
---
title: "Post title"
date: YYYY-MM-DD
categories: [tag1, tag2]
img: ./images/banner.jpg
---
```

Key constraints:
- Images must be co-located with the markdown file for `gatsby-remark-images` to process them
- Use `GatsbyImage` component (not `<img>`) in React components
- Tag pages are auto-generated — don't create them manually
- The frontmatter field for tags is `tags` in GraphQL/`gatsby-node.js` but `categories` is used in the copilot instructions — check existing posts for the actual field name in use

## Netlify & Security

`netlify.toml` configures CSP headers allowing Google Analytics/GTM, YouTube (privacy mode via `youtube-nocookie.com`), GitHub Gists, and Twitter embeds. When adding new external resources, update the CSP there.
