const acceptsMarkdown = (accept) => {
  const types = accept
    .split(',')
    .map((part, index) => {
      const [mediaType, ...parameters] = part.trim().toLowerCase().split(';')
      const qualityParameter = parameters.find((parameter) =>
        parameter.trim().startsWith('q=')
      )
      const quality = qualityParameter
        ? Number.parseFloat(qualityParameter.trim().slice(2))
        : 1

      return {
        mediaType,
        quality: Number.isNaN(quality) ? 0 : quality,
        index,
      }
    })
    .filter(({ quality }) => quality > 0)
    .sort((left, right) => right.quality - left.quality || left.index - right.index)

  const markdown = types.find(({ mediaType }) => mediaType === 'text/markdown')
  const html = types.find(({ mediaType }) => mediaType === 'text/html')

  return Boolean(markdown && (!html || markdown.quality >= html.quality))
}

const withVaryAccept = (response) => {
  const headers = new Headers(response.headers)
  const vary = new Map([
    ['accept', 'Accept'],
    ['accept-encoding', 'Accept-Encoding'],
  ])
  ;(headers.get('Vary') || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .forEach((value) => {
      if (!vary.has(value.toLowerCase())) {
        vary.set(value.toLowerCase(), value)
      }
    })
  headers.set('Vary', [...vary.values()].join(', '))

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

const markdownMirrorPath = (pathname) => {
  const normalizedPath = pathname.replace(/^\/+|\/+$/g, '')
  return normalizedPath ? `/${normalizedPath}/index.md` : '/index.md'
}

export { acceptsMarkdown, markdownMirrorPath, withVaryAccept }
