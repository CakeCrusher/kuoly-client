import React from "react";
import { useQuery } from "@apollo/client";
import { MY_CATALOGUES } from "../graphql/schemas";
import { apolloHookErrorHandler } from "../utils/functions";

import { CatalogueSelectItems } from "../containers";

const CatalogueSelect = () => {
  const results = useQuery(MY_CATALOGUES);
  apolloHookErrorHandler("CatalogueSelect.tsx", results.error);

  if (results.loading) {
    return <div className="message">Loading...</div>;
  }

  return (
    <div className="page-container catalogue-select-container">
      <div className="title-row">
        <h3 className="my-lists-title">My Lists</h3>
        <p>All lists saved on this device</p>
      </div>
      <CatalogueSelectItems catalogues={results.data.myCatalogues} />
    </div>
  );
};

export default CatalogueSelect;
