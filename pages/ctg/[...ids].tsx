import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";

import useCatalogueApolloHooks from "../../graphql/hooks/catalogue";
import {
  getCatalogueFromCache,
  removeFromCacheIfMFD,
} from "../../utils/functions";
import { useIsEditing, useMarkedForDeletion } from "../../state/store";
import { createApolloClient, useUser } from "../../lib/UserProvider";
import { GET_ALL_CATALOGUE_IDS, GET_CATALOGUE } from "../../graphql/schemas";
import {
  CatalogueHeader,
  CatalogueItems,
  ListingModal,
} from "../../containers";
import { CatalogueHead } from "../../components";

type CatalogueProps = {
  catalogue_prop: CatalogueType;
  params: {
    ids: string[];
    edit?: string;
  };
};
const Catalogue: React.FC<CatalogueProps> = ({ catalogue_prop, params }) => {
  // get navigation params
  const router = useRouter();
  const { userId } = useUser();
  const isEditId = Boolean(router.query.edit);
  const { markedForDeletion } = useMarkedForDeletion();

  const initialListing =
    params && params.ids && params.ids.length === 2 ? params.ids[1] : null;
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    initialListing
  );

  const current_user_id = userId;
  const corresponding_id: string =
    (params && params.ids && params.ids[0]) ||
    (router.query.ids && router.query.ids[0]) ||
    "";
  const idVariable = { [isEditId ? "edit_id" : "id"]: corresponding_id };

  // All ApolloHooks are moved to custom hook for organization
  const {
    incrementCatalogueViewsMuation,
    handleCatalogueSubscription,
    handleCatalogueQuery,
  } = useCatalogueApolloHooks({
    id: corresponding_id,
  });
  // query below scouts the catalogue and populates the cache
  // (that cache is how the catalogue is rendered)
  const catalogueQuery = handleCatalogueQuery(idVariable);
  handleCatalogueSubscription(idVariable);
  // Inputs need to toggle from Editing to Display state
  const { isEditing, setIsEditing } = useIsEditing();
  useEffect(() => {
    incrementCatalogueViewsMuation({
      variables: { ...idVariable },
    });
  }, []);

  if (!router.query.ids) {
    return (
      <div className="message">
        <CatalogueHead
          catalogue={catalogue_prop}
          ids_param={params && params.ids}
        />
        Loading...
      </div>
    );
  }

  let catalogue: CatalogueType | null = null;
  if (catalogueQuery.error) {
    return (
      <div className="message">
        <CatalogueHead
          catalogue={catalogue_prop}
          ids_param={params && params.ids}
        />
        List not found
      </div>
    );
  }

  if (catalogueQuery.data && catalogueQuery.data.catalogues[0]) {
    // The catalogue being used in the catalogue state
    // will always be the cached catalogue as fetched
    // by CATALOGUE_FRAGMENT
    catalogue = getCatalogueFromCache(catalogueQuery.data.catalogues[0].id);
    if (catalogue) {
      removeFromCacheIfMFD(catalogue, markedForDeletion);
    }
  }

  if (!catalogue) {
    return (
      <div className="message">
        <CatalogueHead
          catalogue={catalogue_prop}
          ids_param={params && params.ids}
        />
        Loading...
      </div>
    );
  }

  // status conditions
  let editable = current_user_id === catalogue.user_id;
  switch (catalogue.status) {
    case "private":
      if (current_user_id !== catalogue.user_id) {
        if (isEditing) setIsEditing(false);
        return (
          <div className="message">
            Private catalogue, only visible to owner.
          </div>
        );
      }
      break;
    case "public":
      if (current_user_id !== catalogue.user_id && isEditing)
        setIsEditing(false);
      break;
    case "collaborative":
      if (isEditId) editable = true;
      break;
    default:
      break;
  }

  // TODO: should sort this in the backend
  const sortedLabels =
    catalogue.labels && catalogue.labels[0]
      ? [...catalogue.labels].sort((a, b) => a.ordering - b.ordering)
      : [];

  // TODO: Should sort this in the backend
  const sortedListings =
    catalogue.listings && catalogue.listings[0]
      ? [...catalogue.listings].sort((a, b) => a.ordering - b.ordering)
      : [];

  const handleListingModalClose = () => {
    // if (navigationType === "PUSH") {
    //   navigate(-1);
    // } else {
    //   navigate(`/ctg/${corresponding_id}${location.search}`);
    // }
    router.replace(
      `/ctg/${corresponding_id}${router.query.edit ? "?edit=true" : ""}`,
      "",
      { shallow: true }
    );
    setSelectedListingId(null);
  };

  const handleSelectListing = (listingId: string) => {
    setSelectedListingId(listingId);
  };

  const selectedListing =
    selectedListingId && catalogue.listings
      ? catalogue.listings.find((li: Listing) => li.id === selectedListingId)!
      : null;

  return (
    <div className="catalogue-container">
      <CatalogueHead
        catalogue={catalogue || catalogue_prop}
        ids_param={
          (router.query && (router.query.ids as string[])) ||
          (params && params.ids)
        }
      />
      <div
        style={{
          flex: "1 0 auto",
          backgroundColor: `${catalogue.header_color}22`,
        }}
      >
        <div className="page-wrapper">
          <CatalogueHeader
            isEditing={isEditing}
            editable={editable}
            catalogue={catalogue}
            toggleEdit={() => setIsEditing(!isEditing)}
          />

          <CatalogueItems
            catalogue={catalogue}
            isEditing={isEditing}
            labels={sortedLabels}
            listings={sortedListings}
            handleSelectListing={handleSelectListing}
          />
          <ListingModal
            catalogueId={catalogue.id}
            labels={sortedLabels}
            listingId={selectedListingId}
            listing={selectedListing}
            handleClose={handleListingModalClose}
            editable={editable}
          />
        </div>
      </div>
    </div>
  );
  // return null;
};

export default Catalogue;

export const getStaticPaths: GetStaticPaths = async () => {
  const client = createApolloClient();
  const query = await client.query({
    query: GET_ALL_CATALOGUE_IDS,
    variables: {
      id: "",
    },
  });
  const catalogues: CatalogueType[] = query.data.catalogues;
  let paths = [];
  catalogues.forEach((catalogue) => {
    paths.push({
      params: {
        ids: [catalogue.id],
      },
    });
    paths.push({
      params: {
        ids: [catalogue.edit_id],
      },
    });
    if (catalogue.listings) {
      catalogue.listings.forEach((listing) => {
        paths.push({
          params: {
            ids: [catalogue.id, listing.id],
          },
        });
      });
    }
  });
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { ids } = params;
  const client = createApolloClient();
  let catalogue: CatalogueType | null = null;
  try {
    const query = await client.query({
      query: GET_CATALOGUE,
      variables: {
        id: ids[0],
      },
    });
    if (query.data) {
      catalogue = query.data.catalogues[0];
    }
  } catch {
    try {
      const query = await client.query({
        query: GET_CATALOGUE,
        variables: {
          edit_id: ids[0],
        },
      });
      if (query.data) {
        catalogue = query.data.catalogues[0];
      }
    } catch (error) {
      // console.log("error", error);
    }
  }

  // const catalogue = await getCatalogue(id);
  return {
    props: {
      catalogue_prop: catalogue,
      params,
    },
  };
};
