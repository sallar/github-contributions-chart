import "normalize.css/normalize.css";
import "../styles/index.css";
import "../styles/App.css";

import Head from "next/head";
import { AppContext } from "next/app";
import { ReactPropTypes } from "react";

export default ({ Component, pageProps }: AppContext & { pageProps: any }) => (
  <>
    <Head>
      <title>GitHub Contributions Chart Generator</title>
    </Head>
    <Component {...pageProps} />
  </>
);
