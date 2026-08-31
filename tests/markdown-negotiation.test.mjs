import assert from 'node:assert/strict'
import test from 'node:test'

import {
  acceptsMarkdown,
  markdownMirrorPath,
  withVaryAccept,
} from '../netlify/markdown-utils.mjs'

test('Markdown negotiation parses media types and quality values', () => {
  assert.equal(acceptsMarkdown('text/markdown'), true)
  assert.equal(acceptsMarkdown('text/markdown, text/html;q=0.8'), true)
  assert.equal(acceptsMarkdown('text/html, text/markdown;q=0.8'), false)
  assert.equal(acceptsMarkdown('*/*'), false)
  assert.equal(markdownMirrorPath('/article/'), '/article/index.md')
  assert.equal(markdownMirrorPath('/'), '/index.md')
})

test('negotiated responses vary on Accept and encoding', () => {
  const response = withVaryAccept(
    new Response('html', { headers: { Vary: 'Accept-Encoding' } })
  )
  assert.equal(response.headers.get('Vary'), 'Accept, Accept-Encoding')
})
