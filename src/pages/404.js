import React from 'react'

import DefaultLayout from '../components/layout'
import SEO from '../components/seo'
import { Link } from 'gatsby'

class NotFoundPage extends React.Component {
  render() {
    const { data } = this.props

    return (
      <DefaultLayout>
        <SEO title="404: Not Found" />
        <h1>That page doesn&#39;t exist.</h1>
        <p>
          The requested page could not be found. Start at the{' '}
          <Link to="/">homepage</Link>, browse the <Link to="/tags">tags</Link>,
          or use the <a href="/sitemap-index.xml">sitemap</a> and{' '}
          <a href="/llms.txt">agent guide</a> to find another page.
        </p>
      </DefaultLayout>
    )
  }
}

export default NotFoundPage
