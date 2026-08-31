import React from 'react'

import TrustPage from '../components/trust-page'

const ContactPage = () => (
  <TrustPage title="Contact">
    <p>
      The best way to contact Bas Lijten about this blog, an article, a
      technical correction, or a speaking opportunity is by email at{' '}
      <a href="mailto:baslijten@gmail.com">baslijten@gmail.com</a>. Please
      include the article URL or enough context to make the request easy to
      understand. Technical questions are welcome, although a response cannot
      be guaranteed and blog posts should not be treated as a support contract.
    </p>
    <p>
      You can also find Bas through his public professional profiles on{' '}
      <a href="https://github.com/baslijten">GitHub</a>,{' '}
      <a href="https://linkedin.com/in/baslijten">LinkedIn</a>, and{' '}
      <a href="https://twitter.com/baslijten">Twitter</a>. Those profiles
      provide additional context about projects, presentations, and current
      professional interests. Use the profile that best matches the subject
      of your message.
    </p>
    <p>
      This site does not provide a public contact form. Sending an email or
      contacting a social profile means the relevant service may process the
      information needed to deliver and respond to the message.
    </p>
  </TrustPage>
)

export default ContactPage
