import React from "react";
import { useQuery } from "@apollo/client";
import { MY_CATALOGUES } from "../graphql/schemas";
import { apolloHookErrorHandler } from "../utils/functions";

import { CatalogueSelectItems } from "../containers";
import Head from "next/head";

const CatalogueSelect = () => {
  const results = useQuery(MY_CATALOGUES);
  apolloHookErrorHandler("CatalogueSelect.tsx", results.error);

  if (results.loading) {
    return <div className="message">Loading...</div>;
  }

  return (
    <div className="page-container catalogue-select-container">
      <Head>
        <title>Your lists</title>
        <link
          rel="icon"
          type="text/png"
          href="https://storage.googleapis.com/givespace-pictures/Logo.svg"
        />
        <meta
          name="description"
          content="Your ultimate tool for creating sharable product lists and catalogues. Get started in seconds, no sign-up required."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:title" content="Your lists" />
        <meta property="og:locale" content="en_US" />
        <meta
          property="og:description"
          content="Your ultimate tool for creating sharable product lists and catalogues. Get started in seconds, no sign-up required."
        />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/givespace-pictures/Kuoly.png"
        />
        <meta property="og:image:alt" content="Kuoly" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:url" content="https://www.kuoly.com/catalogues" />
        <meta property="og:site_name" content="Kuoly" />
        <meta name="theme-color" content="#c9042c" />

        <meta
          name="twitter:card"
          content="https://storage.googleapis.com/givespace-pictures/Kuoly.png"
        />
        <meta name="twitter:title" content="Your lists" />
        <meta
          name="twitter:description"
          content="Your ultimate tool for creating sharable product lists and catalogues. Get started in seconds, no sign-up required."
        />
        <meta
          name="twitter:image"
          content="https://storage.googleapis.com/givespace-pictures/Kuoly.png"
        />
      </Head>
      <div className="title-row">
        <h3 className="my-lists-title">My Lists</h3>
        <p>All lists saved on this device</p>
      </div>
      <CatalogueSelectItems catalogues={results.data.myCatalogues} />
    </div>
  );
};

export default CatalogueSelect;
