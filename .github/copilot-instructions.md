# Bas Lijten's Blog

A technical blog built with Gatsby, React, SCSS, and Markdown focusing on Sitecore, Azure, .NET, and Security. The blog contains 200+ detailed blog posts with extensive imagery and code examples.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Bootstrap the Repository
- Check Node.js version: `node --version` (requires Node.js >= 18.0.0)
- Install dependencies: `npm install --legacy-peer-deps` -- **REQUIRED**: Use `--legacy-peer-deps` flag due to Gatsby plugin version conflicts
- **NEVER CANCEL**: Dependency installation takes 1-2 minutes. Set timeout to 300+ seconds.

### Build Commands  
- **Production Build**: `npm run build` -- **NEVER CANCEL**: Takes 12+ minutes due to 200+ blog posts with extensive image processing. Set timeout to 20+ minutes minimum.
- **Development Server**: `npm run develop` -- **NETWORK ISSUE**: Currently fails due to Google Fonts connectivity (`fonts.googleapis.com` is unreachable). Development server would normally take 8+ minutes to start due to image processing.
- **CRITICAL BUILD WORKAROUND**: If build fails with Google Fonts errors, temporarily comment out the `gatsby-plugin-webfonts` plugin in `gatsby-config.js` (lines 112-145). The build will succeed without fonts in ~11-12 minutes.

### Linting and Formatting
- Lint code: `npm run lint` -- Takes 5-10 seconds. Always run before committing.
- Format code: `npm run format` -- Takes 30-60 seconds to format all JS and Markdown files. Always run before committing.
- ESLint configuration: `.eslintrc.js` (basic React/ES6 rules)
- Prettier configuration: `.prettierrc` (single quotes, no semicolons, trailing commas)

### Test Commands
- Tests: `npm run test` -- Currently returns a placeholder message. No functional tests exist.

## Validation Requirements

### Always Validate These Steps
- **NEVER CANCEL**: All builds take 10+ minutes due to image processing. Be patient.
- After making changes, always run: `npm run lint && npm run format`
- For builds: Test with `npm run build` and wait the full 12+ minutes
- **Manual Validation**: If you modify React components or styling, you must validate by starting the development server (when connectivity allows) and manually checking the UI

### Network Connectivity Issues
- **Google Fonts**: `fonts.googleapis.com` is currently unreachable in this environment
- **Workaround**: Comment out `gatsby-plugin-webfonts` plugin temporarily for builds
- **Production**: Netlify deployment works normally with full network access

## Repository Structure

### Key Directories
- `/content/blog/` -- 200+ Markdown blog posts, each in its own folder with images
- `/src/components/` -- React components (layout, sidebar, SEO)
- `/src/pages/` -- Gatsby pages (404, tags index)
- `/src/templates/` -- Page templates (blog-post, blog-list, tags)
- `/src/styles/` -- SCSS stylesheets
- `/static/` -- Static assets and images

### Configuration Files
- `gatsby-config.js` -- Main Gatsby configuration with plugins and site metadata
- `gatsby-node.js` -- Page generation logic for blog posts and tags
- `gatsby-browser.js` -- Browser-specific code
- `package.json` -- Dependencies and scripts
- `netlify.toml` -- Netlify deployment configuration

### Content Management
- **Blog Posts**: Add new posts in `/content/blog/post-slug/index.md`
- **Images**: Place images in the same folder as the blog post
- **Front Matter**: Each post requires title, date, and optional categories/tags
- **Markdown**: Supports code highlighting, embedded videos, KaTeX math

## Common Tasks

### Adding a New Blog Post
1. Create folder: `/content/blog/your-post-slug/`
2. Add `index.md` with frontmatter:
   ```markdown
   ---
   title: "Your Post Title"
   date: "2024-01-01"
   categories: ["category1", "category2"]
   tags: ["tag1", "tag2"]
   description: "Brief description"
   ---
   ```
3. Add any images to the same folder
4. Run `npm run format` to ensure consistent formatting

### Modifying Site Configuration
- Site metadata: Edit `siteMetadata` in `gatsby-config.js`
- Author info, social links, site description are all configurable
- Google Analytics tracking ID in `gatsby-plugin-google-gtag` configuration

### Styling Changes
- Global styles: `/src/styles/` directory
- Component-specific styles: Import SCSS in React components
- Font configuration: `gatsby-plugin-webfonts` plugin (currently disabled due to network issues)

## Deployment

### Netlify Deployment
- **Automatic**: Deployed via Netlify on pushes to main branch
- **Build Command**: `npm run build`
- **Environment**: Node.js 18, Yarn 1.22.5
- **Build Time**: ~15-20 minutes in production (includes full network access)
- **Security Headers**: Comprehensive CSP, HSTS, and security headers configured in `netlify.toml`

### Performance Considerations
- **Image Optimization**: Gatsby automatically optimizes all images with WebP/AVIF support
- **Code Splitting**: Automatic via Gatsby's webpack configuration
- **RSS Feed**: Generated automatically at `/rss.xml`
- **Sitemap**: Generated automatically
- **Offline Support**: PWA capabilities with gatsby-plugin-offline (currently disabled)

## Troubleshooting

### Common Issues
- **Dependency Conflicts**: Always use `npm install --legacy-peer-deps`
- **Google Fonts Failure**: Comment out `gatsby-plugin-webfonts` plugin temporarily
- **Long Build Times**: Normal due to 200+ posts with images - expect 12+ minutes
- **Development Server Timeout**: Be patient, image processing takes 8+ minutes on first run
- **Browserslist Warning**: Run `npx update-browserslist-db@latest` if needed

### Build Failure Recovery
1. Clear cache: `npm run clean` (if available) or delete `.cache/` and `public/` directories
2. Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install --legacy-peer-deps`
3. For font issues: Temporarily disable `gatsby-plugin-webfonts` in `gatsby-config.js`

## Development Workflow

### Before Making Changes
1. Ensure dependencies are installed: `npm install --legacy-peer-deps`
2. Check current state: `npm run lint`
3. Start development: `npm run develop` (if network allows)

### After Making Changes
1. **ALWAYS** run: `npm run lint && npm run format`
2. Test build: `npm run build` -- **NEVER CANCEL**, wait full 12+ minutes
3. Validate functionality manually if UI changes were made
4. Commit changes

### Code Style Guidelines
- Use single quotes for strings
- No trailing semicolons
- ES5 trailing commas
- React functional components preferred
- SCSS for styling
- Markdown for content with proper frontmatter

## CRITICAL Reminders

- **NEVER CANCEL BUILDS**: Image processing requires 10-20 minutes
- **USE --legacy-peer-deps**: Required for dependency installation
- **GOOGLE FONTS WORKAROUND**: Disable plugin if build fails
- **ALWAYS LINT AND FORMAT**: Run before every commit
- **NETWORK LIMITATIONS**: Some external services may be unreachable in development
- **TIMEOUT SETTINGS**: Use 20+ minute timeouts for build commands
- **MANUAL VALIDATION**: Test UI changes when possible despite network limitations