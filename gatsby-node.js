const path = require(`path`)
const fs = require(`fs`)
const _ = require('lodash');
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const tagTemplate = path.resolve(`./src/templates/tags.js`)

  return graphql(
    `{
  allMarkdownRemark(sort: {frontmatter: {date: DESC}}, limit: 1000) {
    edges {
      node {
        fields {
          slug
        }
        frontmatter {
          title
          tags
          img {
            childImageSharp {
              gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH)
            }
          }
        }
      }
    }
  }
}`
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.edges

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })

    // Create blog post list pages
    const postsPerPage = 10
    const numPages = Math.ceil(posts.length / postsPerPage)

    Array.from({ length: numPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/` : `/${i + 1}`,
        component: path.resolve("./src/templates/blog-list.js"),
        context: {
          limit: postsPerPage,
          skip: i * postsPerPage,
          numPages,
          currentPage: i + 1,
        },
      })
    })

    // create Tags pages
    // pulled directly from https://www.gatsbyjs.org/docs/adding-tags-and-categories-to-blog-posts/#add-tags-to-your-markdown-files
    let tags = [];
    // Iterate through each post, putting all found tags into `tags`
    _.each(posts, edge => {
      if (_.get(edge, 'node.frontmatter.tags')) {
        tags = tags.concat(edge.node.frontmatter.tags);
      }
    });
    // Eliminate duplicate tags
    tags = _.uniq(tags);
    // Make tag pages
    tags.forEach(tag => {
      createPage({
        path: `/tags/${_.kebabCase(tag)}/`,
        component: tagTemplate,
        context: {
          tag,
        },
      })
    })
  });
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

const markdownPathForSlug = (slug) => {
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, '')
  return normalizedSlug ? path.join(normalizedSlug, 'index.md') : 'index.md'
}

const markdownForPost = (post) => {
  const frontmatter = [
    `title: ${JSON.stringify(post.frontmatter.title)}`,
    `date: ${post.frontmatter.date}`,
  ]

  if (post.frontmatter.tags && post.frontmatter.tags.length > 0) {
    frontmatter.push(`tags: ${JSON.stringify(post.frontmatter.tags)}`)
  }

  return `---\n${frontmatter.join('\n')}\n---\n\n# ${post.frontmatter.title}\n\n${post.rawMarkdownBody.trim()}\n`
}

exports.onPostBuild = ({ graphql }) => {
  return graphql(`
    {
      site {
        siteMetadata {
          title
          description
          siteUrl
        }
      }
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
        nodes {
          rawMarkdownBody
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "YYYY-MM-DD")
            tags
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      throw result.errors
    }

    const { site, allMarkdownRemark } = result.data
    const publicDirectory = path.join(process.cwd(), 'public')
    const homepageMarkdown = [
      `# ${site.siteMetadata.title}`,
      '',
      `> ${site.siteMetadata.description}`,
      '',
      '## Articles',
      '',
      ...allMarkdownRemark.nodes.map(
        (post) =>
          `- [${post.frontmatter.title}](${site.siteMetadata.siteUrl}${post.fields.slug}): ${post.excerpt}`
      ),
      '',
    ].join('\n')

    fs.writeFileSync(path.join(publicDirectory, 'index.md'), homepageMarkdown)

    allMarkdownRemark.nodes.forEach((post) => {
      const outputPath = path.join(
        publicDirectory,
        markdownPathForSlug(post.fields.slug)
      )
      fs.mkdirSync(path.dirname(outputPath), { recursive: true })
      fs.writeFileSync(outputPath, markdownForPost(post))
    })

    const postsByTag = new Map()
    allMarkdownRemark.nodes.forEach((post) => {
      ;(post.frontmatter.tags || []).forEach((tag) => {
        const posts = postsByTag.get(tag) || []
        posts.push(post)
        postsByTag.set(tag, posts)
      })
    })

    postsByTag.forEach((posts, tag) => {
      const outputPath = path.join(
        publicDirectory,
        'tags',
        _.kebabCase(tag),
        'index.md'
      )
      const tagMarkdown = [
        `# Articles tagged ${tag}`,
        '',
        ...posts.map(
          (post) =>
            `- [${post.frontmatter.title}](${site.siteMetadata.siteUrl}${post.fields.slug}): ${post.excerpt}`
        ),
        '',
      ].join('\n')
      fs.mkdirSync(path.dirname(outputPath), { recursive: true })
      fs.writeFileSync(outputPath, tagMarkdown)
    })
  })
}
