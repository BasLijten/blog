#!/usr/bin/env node

import assert from 'node:assert/strict'

const baseUrl = process.argv[2] || 'https://blog.baslijten.com'
const agents = [
  'ChatGPT-User',
  'ClaudeBot',
  'Google-Extended',
  'ora-agent',
  'DeepSeekBot',
  'GPTBot',
  'PerplexityBot',
]

const fetchHomepage = async (userAgent) => {
  const response = await fetch(`${baseUrl}/`, {
    headers: { 'User-Agent': `${userAgent}/1.0` },
    redirect: 'manual',
  })
  const body = await response.text()

  assert.equal(response.status, 200, `${userAgent} received ${response.status}`)
  assert.match(
    response.headers.get('content-type') || '',
    /text\/html/i,
    `${userAgent} did not receive HTML`
  )
  assert.ok(
    !/captcha|challenge|access denied|sign in/i.test(body),
    `${userAgent} received a bot challenge or denial page`
  )
}

for (const agent of agents) {
  await fetchHomepage(agent)
  console.log(`${agent}: reachable`)
}
