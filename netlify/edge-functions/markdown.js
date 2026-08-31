const MARKDOWN_BYPASS_HEADER = 'x-agent-markdown-bypass'
import {
  acceptsMarkdown,
  markdownMirrorPath,
  withVaryAccept,
} from './markdown-utils.mjs'

export default function markdown(request, context) {
  const accept = request.headers.get('accept') || ''

  if (
    request.headers.get(MARKDOWN_BYPASS_HEADER) === '1' ||
    request.method !== 'GET' && request.method !== 'HEAD'
  ) {
    return context.next()
  }

  if (!acceptsMarkdown(accept)) {
    return context.next().then(withVaryAccept)
  }

  const requestUrl = new URL(request.url)
  const mirrorUrl = new URL(markdownMirrorPath(requestUrl.pathname), requestUrl)
  const mirrorHeaders = new Headers(request.headers)
  mirrorHeaders.set('Accept', 'text/html')
  mirrorHeaders.set(MARKDOWN_BYPASS_HEADER, '1')

  return fetch(
    new Request(mirrorUrl, {
      method: request.method,
      headers: mirrorHeaders,
    })
  ).then((mirrorResponse) => {
    if (mirrorResponse.status !== 200) {
      return context.next().then(withVaryAccept)
    }

    const headers = new Headers(mirrorResponse.headers)
    headers.set('Content-Type', 'text/markdown; charset=utf-8')
    headers.set('Vary', 'Accept, Accept-Encoding')

    return new Response(mirrorResponse.body, {
      status: mirrorResponse.status,
      statusText: mirrorResponse.statusText,
      headers,
    })
  })
}
