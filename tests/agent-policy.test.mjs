import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

test('agent reachability policy documents all supported crawler families', () => {
  const policy = fs.readFileSync(
    path.join(process.cwd(), 'docs', 'agent-readiness.md'),
    'utf8'
  )
  for (const agent of [
    'ChatGPT-User',
    'ClaudeBot',
    'Google-Extended',
    'ora-agent',
    'DeepSeekBot',
    'GPTBot',
    'PerplexityBot',
  ]) {
    assert.match(policy, new RegExp(`\\b${agent}\\b`))
  }
})
