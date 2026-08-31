import React from 'react'

import TrustPage from '../components/trust-page'

const PrivacyPage = () => (
  <TrustPage title="Privacy">
    <p>
      This personal blog is primarily a static publication. It does not offer
      accounts, comments, or a public contact form. When you visit the site,
      the hosting platform and normal web infrastructure may process technical
      request data such as an IP address, User-Agent, timestamp, and requested
      URL to deliver the pages, protect the service, and diagnose failures.
    </p>
    <p>
      The site uses Google Analytics through Google’s gtag integration to
      understand general usage and improve the publication. Analytics may set
      cookies or process device and usage information according to Google’s
      policies and the configuration of your browser. The site also contains
      links and, in some articles, embeds from third-party services such as
      YouTube, GitHub, social networks, or presentation platforms. Those
      services may receive a request when you follow a link or load an embed.
    </p>
    <p>
      If you email Bas or contact him through a social profile, the relevant
      provider processes your message and account information so the message
      can be delivered and answered. Do not send confidential, sensitive, or
      production credentials through these channels. This page is a plain
      description of the site’s current behavior and is not legal advice; the
      services and configuration may change over time.
    </p>
  </TrustPage>
)

export default PrivacyPage
