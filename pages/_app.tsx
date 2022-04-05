import { AppProps } from "next/app";
import Link from "next/link";

import "../styles/layout.less";
import "../styles/index.less";

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";
import { UserProvider } from "../lib/UserProvider";
import { useEffect } from "react";
import Layout from "../components/layout";

// TODO: Create a use effect that gets the user from the cookie
// TODO: Set the state of user
// TODO: Have that change the http links dynamically
// https://youtu.be/pB4YZBJmMl8?t=3561

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}
