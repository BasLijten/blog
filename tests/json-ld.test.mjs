import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

test('homepage JSON-LD is valid and identifies the blog', () => {
  const homepage = fs.readFileSync(
    path.join(process.cwd(), 'public', 'index.html'),
    'utf8'
  )
  const match = homepage.match(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i
  )
  assert.ok(match, 'expected JSON-LD script')
  const schema = JSON.parse(match[1])
  assert.equal(schema['@context'], 'https://schema.org')
  assert.equal(schema['@type'], 'Blog')
  assert.ok(schema.name)
  assert.ok(schema.description)
  assert.ok(schema.url)
  assert.equal(schema.author['@type'], 'Person')
})
