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
