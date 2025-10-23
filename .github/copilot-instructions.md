# Copilot Instructions for Bas Lijten's Blog

This is a Gatsby-based blog focused on Sitecore, Azure, .NET, and security content. It's deployed on Netlify with strong security headers.

## Architecture Overview

**Tech Stack**: Gatsby v5 + React + SCSS + Markdown content + Netlify hosting
**Content**: Blog posts in `content/blog/[post-name]/index.md` with frontmatter (title, date, categories, img)
**Deployment**: Netlify with caching plugin, security headers, and CSP policies

## Key File Structure

```
├── content/blog/          # Markdown blog posts (each in own folder with index.md)
├── src/
│   ├── components/        # React components (layout.js, sidebar.js, seo.js)
│   ├── templates/         # Page templates (blog-post.js, blog-list.js, tags.js)
│   ├── pages/             # Static pages
│   └── styles/            # SCSS with partial imports
├── gatsby-config.js       # Plugins & site metadata
├── gatsby-node.js         # Page generation & GraphQL schema
└── netlify.toml          # Deploy config with security headers
```

## Content Management Patterns

- **Blog posts**: Each post lives in `content/blog/[slug]/index.md` with images in same folder
- **Frontmatter structure**: `title`, `date` (YYYY-MM-DD), `categories[]`, `img` (relative path)
- **Image handling**: Uses `gatsby-plugin-image` with WebP/AVIF generation
- **Tags**: Auto-generated tag pages from frontmatter categories using lodash kebabCase

## Component Architecture

- **Layout**: Sidebar + main content wrapper in `layout.js`
- **Templates**: Use GraphQL page queries, not static queries
- **Styling**: SCSS partials imported into `main.scss` (normalize, variables, syntax highlighting)
- **Fonts**: Google Fonts (Lato, PT Serif) loaded via `gatsby-plugin-webfonts`

## Development Workflows

```bash
yarn dev              # Start development server (localhost:8000)
yarn build            # Production build with experimental page optimization
yarn lint             # ESLint with React plugin
yarn format           # Prettier formatting for JS/JSX and Markdown
```

## Content Features

- **Video embeds**: `gatsby-remark-embed-video` with YouTube privacy mode
- **Code highlighting**: `gatsby-remark-highlight-code` with Dracula theme
- **Math**: KaTeX support via `gatsby-remark-katex`
- **RSS feed**: Auto-generated at `/rss.xml`
- **SEO**: React Helmet with OpenGraph meta tags

## Security Configuration

Strong CSP in `netlify.toml` allows:
- Google Analytics/GTM tracking
- YouTube embeds (privacy mode only)
- GitHub Gists
- Twitter embeds
- Report URI for CSP violations

## GraphQL Patterns

Page creation in `gatsby-node.js`:
- Sorts posts by date DESC
- Creates pagination (10 posts per page)
- Generates tag pages with kebab-case URLs
- Passes previous/next context for navigation

## Common Gotchas

- Images must be co-located with markdown files for `gatsby-remark-images`
- Use `GatsbyImage` component, not regular `<img>` tags
- Frontmatter dates must be in YYYY-MM-DD format
- Tag pages are auto-generated - don't create manually
- SCSS partials must be imported in dependency order