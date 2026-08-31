/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { useStaticQuery, graphql } from 'gatsby'

function SEO({ description, lang, meta, title }) {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          author
          siteUrl
          social {
            twitter
            github
            linkedin
          }
        }
      }
    }
  `)

  const metaDescription = description || site.siteMetadata.description
  const { siteMetadata } = site
  const sameAs = [
    siteMetadata.social.twitter &&
      `https://twitter.com/${siteMetadata.social.twitter}`,
    siteMetadata.social.github &&
      `https://github.com/${siteMetadata.social.github}`,
    siteMetadata.social.linkedin &&
      `https://linkedin.com/in/${siteMetadata.social.linkedin}`,
  ].filter(Boolean)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: siteMetadata.title,
    description: metaDescription,
    url: siteMetadata.siteUrl,
    author: {
      '@type': 'Person',
      name: siteMetadata.author,
      sameAs,
    },
  }

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      //titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(meta)}
    >
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <link rel="describedby" href={`${siteMetadata.siteUrl}/llms.txt`} />
    </Helmet>
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default SEO
