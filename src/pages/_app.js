import 'normalize.css/normalize.css'
import '../index.css'
import '../App.css'

import Head from 'next/head'

export default ({Component, pageProps}) => <>
  <Head>
    <title>GitHub Contributions Chart Generator</title>
  </Head>
  <Component {...pageProps} />
</>