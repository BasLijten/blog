import React from 'react'
import { Link, graphql } from 'gatsby'
import { kebabCase } from 'lodash'
import { GatsbyImage } from 'gatsby-plugin-image'

import DefaultLayout from '../components/layout'
import SEO from '../components/seo'
import { GatsbySeo } from 'gatsby-plugin-next-seo';
import 'katex/dist/katex.min.css'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const site = this.props.data.site
    return (
      <DefaultLayout>
        {/* <SEO title={post.frontmatter.title} description={post.excerpt} /> */}
        <GatsbySeo 
          title={post.frontmatter.title} 
          description={post.excerpt}
          openGraph={{
            title: post.frontmatter.title,
            description: post.excerpt,
            type: `article`,
            article: {
              publishedTime: post.frontmatter.ogdate + "Z"
            },
            images: [
              {
                url:  site.siteMetadata.siteUrl + post.frontmatter.img.childImageSharp.gatsbyImageData.images.fallback.src,            
              }
            ]
          }}           
          twitter={{
            handle: '@BasLijten',
            cardType: 'summary_large_image',
          }}/>
        <div className="clearfix post-content-box">
          <article className="article-page">
            <div className="page-content">
              {post.frontmatter.img && (
                <div className="page-cover-image">
                  <figure>
                    <GatsbyImage
                      image={
                        post.frontmatter.img.childImageSharp.gatsbyImageData
                      }
                      className="page-image"
                      key={
                        post.frontmatter.img.childImageSharp.gatsbyImageData.src
                      }
                      alt=""
                    />
                  </figure>
                </div>
              )}
              <div className="wrap-content">
                <header className="header-page">
                  <h1 className="page-title">{post.frontmatter.title}</h1>
                  <div className="page-date">
                    <span>{post.frontmatter.date}</span>
                  </div>
                </header>
                <div dangerouslySetInnerHTML={{ __html: post.html }} />
                <div className="page-footer">
                  <div className="page-tag">
                    {post.frontmatter.tags &&
                      post.frontmatter.tags.map((tag) => (
                        <span key={tag}>
                          <Link className="tag" to={`/tags/${kebabCase(tag)}/`}>
                            # {tag}
                          </Link>
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </DefaultLayout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        siteUrl
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "YYYY, MMM DD")
        ogdate: date(formatString: "YYYY-MM-DDTHH:mm:ssZ")
        tags
        img {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED, layout: FULL_WIDTH, formats: [AUTO, AVIF, WEBP])
          }
        }
      }
    }
  }
`
