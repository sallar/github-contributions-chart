import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import "normalize.css/normalize.css";
import "../styles/index.css";
import "../styles/App.css";

import Head from "next/head";

const App = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>GitHub Contributions Chart Generator</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="description"
        content="See all of your GitHub contributions in one image!"
      />
    </Head>
    <Component {...pageProps} />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--header-bg)",
          color: "var(--text)",
          border: "0.1rem solid var(--border)"
        }
      }}
    />
    <Analytics />
  </>
);

export default App;
