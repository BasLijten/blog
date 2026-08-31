# Agent readiness policy

## Reachability policy

The site is intended to be reachable by legitimate AI agents and crawlers.
Netlify or any upstream WAF must not block these User-Agent families:

- `ChatGPT-User`
- `ClaudeBot`
- `Google-Extended`
- `ora-agent`
- `DeepSeekBot`
- `GPTBot`
- `PerplexityBot`

This list is an operational allow policy, not an assertion that User-Agent
strings are proof of identity. Keep normal rate limiting, request validation,
and abuse controls enabled. Do not use `robots.txt` as a substitute for WAF
configuration.

## Verification

Run `node scripts/verify-agent-readiness.mjs [base-url]` against a deploy
preview and production. Every listed agent must receive the normal homepage
with HTTP 200, HTML content, and no challenge or denial page.

If a check fails in production while the repository contains no matching edge
rule, inspect the Netlify User Agent Blocker extension and any DNS-provider or
WAF configuration before changing the Gatsby application.

The production hostname currently reports Cloudflare in front of Netlify. The
Cloudflare configuration must therefore also allow the listed User-Agent
families and must bypass or vary its cache key when `Accept` contains
`text/markdown`; otherwise Cloudflare can serve an HTML response to a Markdown
request even when the origin Edge Function is correct.

## Deferred organization data

The site currently publishes an email address but no approved public telephone
number or postal address. Do not add fabricated values to Organization JSON-LD.
Organization schema can be completed after approved public values are supplied.
