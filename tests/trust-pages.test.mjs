import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const readableText = (html) =>
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script[^>]*>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

for (const page of ['about', 'contact', 'privacy']) {
  test(`${page} is a substantial trust page`, () => {
    const html = fs.readFileSync(
      path.join(process.cwd(), 'public', page, 'index.html'),
      'utf8'
    )
    assert.equal((html.match(/<h1\b/gi) || []).length, 1)
    assert.ok(readableText(html).length >= 500)
    assert.match(html, /href="\/"/i)
    assert.match(html, /href="\/(about|contact|privacy)\/?"/i)
  })
}
