import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

test('404 page contains recovery links', () => {
  const notFound = fs.readFileSync(
    path.join(process.cwd(), 'public', '404.html'),
    'utf8'
  )
  assert.match(notFound, /doesn.?t exist|could not be found/i)
  assert.match(notFound, /href="\/"/i)
  assert.match(notFound, /href="\/tags\/?"/i)
  assert.match(notFound, /href="\/sitemap-index\.xml"/i)
  assert.match(notFound, /href="\/llms\.txt"/i)
})
