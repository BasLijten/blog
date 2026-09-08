import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import Helmet from 'react-helmet'

import Sidebar from '.././components/sidebar'
import WebMcp from '.././components/webmcp'
import '../styles/main.scss'
import '../styles/fonts/font-awesome/css/font-awesome.min.css'
import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader'
deckDeckGoHighlightElement()

const DefaultLayout = ({ children }) => (
  <StaticQuery
    query={graphql`
      query SiteTitleQuery {
        site {
          siteMetadata {
            author
            description
            social {
              twitter
              facebook
              linkedin
              github
              email
            }
          }
        }
        allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
          nodes {
            fields {
              slug
            }
            excerpt(pruneLength: 240)
            frontmatter {
              title
              date(formatString: "YYYY-MM-DD")
              tags
            }
          }
        }
      }
    `}
    render={(data) => (
      <div className="wrapper">
        {/* <Helmet>
          <link
            href="https://fonts.googleapis.com/css?family=Lato|PT+Serif&display=swap"
            rel="stylesheet"
          />
        </Helmet> */}
        <Sidebar siteMetadata={data.site.siteMetadata} />
        <WebMcp
          posts={data.allMarkdownRemark.nodes.map((node) => ({
            title: node.frontmatter.title,
            slug: node.fields.slug,
            date: node.frontmatter.date,
            excerpt: node.excerpt,
            tags: node.frontmatter.tags,
          }))}
        />
        {children}
      </div>
    )}
  />
)

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default DefaultLayout
