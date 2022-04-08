import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CreateCatalogueButton } from "../../components";
import { CatalogueCard } from "../../components";
import { cache } from "../../graphql/clientConfig";
import { CREATE_CATALOGUE, MY_CATALOGUES } from "../../graphql/schemas";
import { apolloHookErrorHandler } from "../../utils/functions";

import { FiPlus } from "react-icons/fi";

type Props = {
  catalogues: CatalogueStub[];
};

const CatalogueCards: React.FC<Props> = ({ catalogues }) => {
  // TODO: Replace this with something like useUserApolloHooks
  const router = useRouter();
  //@ts-ignore
  const [createCatalogue, { loading, data, error }] =
    useMutation(CREATE_CATALOGUE);
  apolloHookErrorHandler("CreateCatalogueButton.tsx", error);

  useEffect(() => {
    if (!loading && data) {
      cache.updateQuery({ query: MY_CATALOGUES }, (prev) => {
        return {
          myCatalogues: [...prev.myCatalogues, data.createCatalogue],
        };
      });
      router.push("/ctg/" + data.createCatalogue.id);
    }
  }, [loading, data]);

  return (
    <div className="f-row catalogue-cards-container">
      {catalogues.map((catalogue: CatalogueStub) => (
        <Link href={`/ctg/${catalogue.id}`}>
          <a className="catalogue-card-wrapper">
            <CatalogueCard catalogue={catalogue} />
          </a>
        </Link>
      ))}
      <CreateCatalogueButton className="catalogue-card-wrapper">
        <div className="card f-col catalogue-card add-catalogue">
          <div className="f-col card-body">
            <div className="text">Create a List</div>
            <FiPlus className="add-icon" size="3rem" />
          </div>
        </div>
      </CreateCatalogueButton>
    </div>
  );
};

export default CatalogueCards;
