module.exports = {
  siteMetadata: {
    title: `A blog by Bas Lijten on Sitecore, Azure, .Net and Security`,
    description: `I am a software architect, public speaker, Sitecore MVP, husband and dad. Not in that particular order. Always learning. Always Sharing`,
    author: `Bas Lijten`,
    siteUrl: `https://blog.baslijten.com`,
    social: {
      twitter: `baslijten`,
      facebook: ``,
      github: `baslijten`,
      linkedin: `baslijten`,
      email: `baslijten@gmail.com`,
    },
  },
  plugins: [    
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: "gatsby-remark-embed-video",
      options: {
        width: 800,
        ratio: 1.77, // Optional: Defaults to 16/9 = 1.77
        height: 400, // Optional: Overrides optional.ratio
        related: false, //Optional: Will remove related videos from the end of an embedded YouTube video.
        noIframeBorder: true, //Optional: Disable insertion of <style> border: 0
        loadingStrategy: 'lazy', //Optional: Enable support for lazy-load offscreen iframes. Default is disabled.
        urlOverrides: [
          {
            id: "youtube",
            embedURL: videoId =>
              `https://www.youtube-nocookie.com/embed/${videoId}`,
          },
        ], //Optional: Override URL of a service provider, e.g to enable youtube-nocookie support
        containerClass: "embedVideo-container", //Optional: Custom CSS class for iframe container, for multiple classes separate them by space
        iframeId: false, //Optional: if true, iframe's id will be set to what is provided after 'video:' (YouTube IFrame player API requires iframe id)
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 970,
	      withWebp: true,
	      withAvif: true,
            },
          },
          {
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `warn`,
            },
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              destinationDir: `files`,
              ignoreFileExtensions: [`png`, `jpg`, `jpeg`, `bmp`, `tiff`],
            },
          },
          {
            resolve: "gatsby-remark-embed-video",
            options: {
              width: 800,
              ratio: 1.77, // Optional: Defaults to 16/9 = 1.77
              height: 400, // Optional: Overrides optional.ratio
              related: false, //Optional: Will remove related videos from the end of an embedded YouTube video.
              noIframeBorder: true, //Optional: Disable insertion of <style> border: 0
              loadingStrategy: 'lazy', //Optional: Enable support for lazy-load offscreen iframes. Default is disabled.
              urlOverrides: [
                {
                  id: "youtube",
                  embedURL: videoId =>
                    `https://www.youtube-nocookie.com/embed/${videoId}`,
                },
              ], //Optional: Override URL of a service provider, e.g to enable youtube-nocookie support
              containerClass: "embedVideo-container", //Optional: Custom CSS class for iframe container, for multiple classes separate them by space
              iframeId: false, //Optional: if true, iframe's id will be set to what is provided after 'video:' (YouTube IFrame player API requires iframe id)
            }
          },
          { 
            resolve: `gatsby-remark-prismjs`,
            options: {
              showLineNumbers: true,
            }
          },          
        ],
      },
    },
    {
      resolve: "gatsby-plugin-webfonts",
      options: {
        fonts: {
          google: [
            {
              family: "Lato",
              variants: ["300", "400", "500"],
              //subsets: ['latin']
              //text: 'Hello'
              //fontDisplay: 'swap',
              //strategy: 'selfHosted' // 'base64' || 'cdn'
            },
            {
              family: "PT Serif",
              variants: ["300", "400", "500"],
              //subsets: ['latin']
              //text: 'Hello'
              //fontDisplay: 'swap',
              //strategy: 'selfHosted' // 'base64' || 'cdn'
            },
          ],
        },
        // formatAgents: {
        //   eot: `Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET4.0C; .NET4.0E)`,
        //   ttf: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.59.8 (KHTML, like Gecko) Version/5.1.9 Safari/534.59.8`,
        //   woff: `Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; rv:11.0) like Gecko`,
        //   woff2: `Mozilla/5.0 (Windows NT 10.0; Win64; x64; ServiceUI 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393`,
        // },
        //formats: ['woff2', 'woff'],
        //useMinify: true,
        //usePreload: true,
        //usePreconnect: false,
      },
    },
    // {
    //   resolve: 'gatsby-plugin-web-font-loader',
    //   options: {
    //     google: {
    //       families: ['Droid Sans', 'Droid Serif']
    //     }
    //   }
    // },
    // {
    //   resolve: "gatsby-omni-font-loader",
    //   options: {
    //     /* Enable font loading listener to handle FOUC */
    //     enableListener: true,
    //     /* Preconnect URL-s. This example is for Google Fonts */
    //     preconnect: ["https://fonts.gstatic.com"],
    //     /* Self-hosted fonts config. Add font files and font CSS files to "static" folder */
    //     custom: [
    //       {

    //         /* Exact name of the font as defied in @font-face CSS rule */
    //         name: ["Font Awesome 5 Brands", "Font Awesome 5 Free"],
    //         /* Path to the font CSS file inside the "static" folder with @font-face definition */
    //         file: "/fonts/font-awesome.min.css",
    //       },
    //     ],
    //     /* Web fonts. File link should point to font CSS file. */
    //     web: [{
    //         /* Exact name of the font as defied in @font-face CSS rule */
    //         name: "Lato",
    //         /* URL to the font CSS file with @font-face definition */
    //         file: "https://fonts.googleapis.com/css?family=Lato|PT+Serif",
    //       },
    //     ],
    //   },
    // },
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sitemap`,
    //uncomment this and input the trackingId to enable google analytics
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-43156304-1`,
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  title: edge.node.title + " - Bas Lijten",
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "A blog by Bas Lijten on Sitecore, Azure, .Net and Security",
          },
        ],
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `flexible-gatsby-starter`,
        short_name: `flexible-gatsby`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `./static/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
    resolve: `gatsby-plugin-sass`,
    options: {
      implementation: require('sass')
     }
    },
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     // The property ID; the tracking code won't be generated without it
    //     trackingId: "GTM-MFCP42K",
    //     // Defines where to place the tracking script - `true` in the head and `false` in the body
    //     head: false,
    //     // Setting this parameter is optional
    //     anonymize: true,
    //     // Setting this parameter is also optional
    //     respectDNT: true,
    //     // Avoids sending pageview hits from custom paths
    //     exclude: ["/preview/**", "/do-not-track/me/too/"],
    //     // Delays sending pageview hits on route update (in milliseconds)
    //     pageTransitionDelay: 0,
    //     // Enables Google Optimize using your container Id
    //     //optimizeId: "YOUR_GOOGLE_OPTIMIZE_TRACKING_ID",
    //     // Enables Google Optimize Experiment ID
    //     //experimentId: "YOUR_GOOGLE_EXPERIMENT_ID",
    //     // Set Variation ID. 0 for original 1,2,3....
    //     //variationId: "YOUR_GOOGLE_OPTIMIZE_VARIATION_ID",
    //     // Defers execution of google analytics script after page load
    //     defer: false,
    //     // Any additional optional fields
    //     sampleRate: 5,
    //     siteSpeedSampleRate: 10,
    //     cookieDomain: "baslijten.com",
    //   },
    // },
  ],
}
