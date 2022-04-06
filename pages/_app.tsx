import { AppProps } from "next/app";
import Link from "next/link";

import "../styles/layout.less";
import "../styles/index.less";
import "./indexPage.less";
import "./catalogues.less";
import "./api-info.less";
import "../containers/CatalogueSelectItems/CatalogueSelectItems.less";
import "../components/Undo/UndoNotification.less";
import "../components/Feedback/Feedback.less";
import "../components/Modal/Modal.less";
import "../components/ToggleEdit/ToggleEdit.less";
import "../components/fields/TextreaInput/TextareaInput.less";
import "../components/fields/TextInput/TextInput.less";
import "../components/CatalogueCard/CatalogueCard.less";
import "../components/DeleteCatalogueButton/DeleteCatalogueButton.less";
// import "../components"
// import "../components"
// import "../components"
// import "../components"
// import "../components"
// import "../components"
// import "../components"
// import "../components"
// import "../components"

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
} from "@apollo/client";
import { UserProvider } from "../lib/UserProvider";
import { useEffect } from "react";
import Layout from "../components/Layout/Layout";

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
