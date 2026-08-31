import React from 'react'

import TrustPage from '../components/trust-page'

const AboutPage = () => (
  <TrustPage title="About Bas Lijten">
    <p>
      I am Bas Lijten, a software architect, public speaker, Sitecore MVP,
      husband, and dad. This blog is where I share practical lessons from
      building, deploying, securing, and operating software over many years.
      The writing is based on experiments, production work, conference talks,
      and problems that are worth documenting for the next person who meets
      them.
    </p>
    <p>
      The main topics are Sitecore and XM Cloud, Azure, .NET, SharePoint,
      reverse proxies, DevOps, monitoring, identity, authentication, and web
      security. Articles often include configuration examples, deployment
      notes, debugging steps, and the trade-offs behind an implementation.
      Older articles describe earlier versions of the platforms, so check the
      publication date and compare version-sensitive details with current
      vendor documentation before using them in a production system.
    </p>
    <p>
      The site is an independent personal publication. It is intended to make
      technical knowledge easier to find and reuse, while keeping the context
      and limitations of each experience visible.
    </p>
  </TrustPage>
)

export default AboutPage
