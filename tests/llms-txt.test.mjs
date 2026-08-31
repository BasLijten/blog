import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

test('llms.txt follows the required high-level structure', () => {
  const llms = fs.readFileSync(
    path.join(process.cwd(), 'static', 'llms.txt'),
    'utf8'
  )
  assert.match(llms, /^# .+/)
  assert.match(llms, /^> .+/m)
  assert.match(llms, /\*\*When to use this site:\*\*/)
  assert.match(llms, /^## .+/m)
  assert.match(llms, /^- \[[^\]]+\]\([^\)]+\)/m)
})
