import Head from "next/head";

import Layout from "../components/layout/Layout";
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { AuthContextProvider } from "../store/auth-context";

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Layout>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Component {...pageProps} />
      </Layout>
    </AuthContextProvider>
  );
}

export default MyApp;
