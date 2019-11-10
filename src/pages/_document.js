import React from "react";
import Document, { Head, Main, NextScript } from "next/document";

const GA_TRACKING_ID = "UA-118649449-1";

export default class extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `
            }}
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono:300,400&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script defer src="https://buttons.github.io/buttons.js"></script>
        </body>
      </html>
    );
  }
}
