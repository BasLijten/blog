import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'

const homepagePath = path.join(process.cwd(), 'public', 'index.html')
const readableText = (html) =>
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script[^>]*>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

test('homepage contains meaningful raw HTML content and one h1', () => {
  const homepage = fs.readFileSync(homepagePath, 'utf8')
  assert.equal((homepage.match(/<h1\b/gi) || []).length, 1)
  assert.ok(readableText(homepage).length >= 500)
  assert.match(homepage, /href="\/[^\"]+"/i)
})
