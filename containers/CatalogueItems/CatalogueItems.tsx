import React from "react";
import {
  LabelContainer,
  ListingCardsContainer,
  AddListing,
  ListingsFilter,
} from "../../components";
import useListingApolloHooks from "../../graphql/hooks/listing";

import { useListingsFilter } from "../../state/store";
import { filteredListings } from "../../utils/functions";

type Props = {
  isEditing: boolean;
  catalogue: CatalogueType;
  labels: Label[];
  listings: Listing[];
  handleSelectListing: (listingId: string) => void;
};

const CatalogueItems: React.FC<Props> = ({
  labels,
  catalogue,
  listings,
  isEditing,
  handleSelectListing,
}) => {
  const { createListing } = useListingApolloHooks();
  const { listingsFilter } = useListingsFilter();

  const organizedListings = filteredListings(listings, listingsFilter);

  return (
    <div className="catalogue-items-container">
      {/* add item, sort */}
      <div className="add-listing-sort">
        <div className="add-listing-wrapper">
          <AddListing
            isEditing={isEditing}
            handleSubmit={createListing(catalogue.id)}
          />
        </div>
        <div className="sort-wrapper">
          <ListingsFilter />
        </div>
      </div>
      {/* labels */}
      <div className="labels-container-wrapper">
        <LabelContainer
          isEditing={isEditing}
          catalogue={catalogue}
          labels={labels}
        />
      </div>
      <div className="listing-cards-container-wrapper">
        <ListingCardsContainer
          isEditing={isEditing}
          catalogue={catalogue}
          listings={organizedListings}
          handleSelectListing={handleSelectListing}
        />
      </div>
    </div>
  );
};

export default CatalogueItems;
