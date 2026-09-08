import { useEffect } from 'react'

const MAX_QUERY_LENGTH = 100
const MAX_RESULTS = 10
const REGISTRATION_RETRY_INTERVAL = 250
const MAX_REGISTRATION_RETRIES = 40

const normalize = (value) => value.toLocaleLowerCase().trim()

const registerSearchTool = (posts) => {
  if (typeof document === 'undefined') {
    return undefined
  }

  // document.modelContext is the current API. Keep the navigator fallback for
  // browser clients that still expose the earlier WebMCP preview API.
  const modelContext = document.modelContext || navigator.modelContext

  if (!modelContext) {
    return undefined
  }

  const controller = new AbortController()

  modelContext
    .registerTool(
      {
        name: 'search_blog_posts',
        title: 'Search blog posts',
        description:
          'Searches this blog for posts matching a phrase in the title, excerpt, or tags. Returns up to 10 read-only results.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'A word or phrase to search for.',
              maxLength: MAX_QUERY_LENGTH,
            },
          },
          required: ['query'],
          additionalProperties: false,
        },
        annotations: {
          readOnlyHint: true,
          untrustedContentHint: true,
        },
        execute: ({ query }) => {
          const searchTerm = normalize(
            String(query || '').slice(0, MAX_QUERY_LENGTH)
          )

          if (!searchTerm) {
            return { query: '', results: [] }
          }

          const results = posts
            .filter((post) => {
              const searchableText = normalize(
                [post.title, post.excerpt, ...(post.tags || [])].join(' ')
              )
              return searchableText.includes(searchTerm)
            })
            .slice(0, MAX_RESULTS)
            .map(({ title, slug, date, excerpt, tags }) => ({
              title,
              url: slug,
              date,
              excerpt,
              tags,
            }))

          return { query: searchTerm, results }
        },
      },
      { signal: controller.signal }
    )
    .catch(() => {
      // The tool may already be registered during Gatsby development reloads.
    })

  return () => controller.abort()
}

const WebMcp = ({ posts }) => {
  useEffect(() => {
    let cleanup
    let retries = 0
    let retryTimer

    const tryRegister = () => {
      cleanup = registerSearchTool(posts)

      if (!cleanup && retries < MAX_REGISTRATION_RETRIES) {
        retries += 1
        retryTimer = setTimeout(tryRegister, REGISTRATION_RETRY_INTERVAL)
      }
    }

    tryRegister()

    return () => {
      clearTimeout(retryTimer)
      if (cleanup) {
        cleanup()
      }
    }
  }, [posts])

  return null
}

export default WebMcp
