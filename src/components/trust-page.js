import React from 'react'
import { Link } from 'gatsby'

import DefaultLayout from './layout'
import SEO from './seo'

const TrustPage = ({ title, children }) => (
  <DefaultLayout>
    <SEO title={title} />
    <main className="content-box clearfix">
      <article className="article-page trust-page">
        <div className="wrap-content">
          <header className="header-page">
            <h1 className="page-title">{title}</h1>
          </header>
          {children}
          <p>
            <Link to="/about">About</Link> · <Link to="/contact">Contact</Link>{' '}
            · <Link to="/privacy">Privacy</Link>
          </p>
        </div>
      </article>
    </main>
  </DefaultLayout>
)

export default TrustPage
