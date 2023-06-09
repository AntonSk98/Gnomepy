import "../styles/globals.css";
import "antd/dist/antd.css";

import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouter } from "next/router";
import { SessionProvider, useSession } from "next-auth/react";
import ScaleLoader from "react-spinners/ScaleLoader";
import Head from 'next/head'


import SideLayout from "../components/Layout/SideLayout";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";

const queryClient = new QueryClient();

function Auth({ children }) {
  const { data: session, status } = useSession({ required: true });
  const isUser = !!session?.user;
  React.useEffect(() => {
    if (status) return; // Do nothing while loading
  }, [isUser, status]);

  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return (
    <div className="flex h-screen justify-center items-center text-green-600">
      <ScaleLoader color="green" loading={status} size={100} />
    </div>
  );
}

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  if (router.asPath.slice(0, 5) === "/auth") {
    return (
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    );
  }

  return (
    <>
     <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Gnomepy" />
        <meta name="keywords" content="Gnomepy" />
        <title>Gnomepy</title>

        <link
          href="/favicon/favicon.ico"
          rel="icon"
        />
      </Head>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <Auth>
            <SideLayout>
                <Component {...pageProps} />
                <ToastContainer />
            </SideLayout>
          </Auth>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
