import React, { useEffect, useState } from "react";
import ListingCard from "../ListingCard/ListingCard";
import useListingApolloHooks from "../../../graphql/hooks/listing";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { newOrdering } from "../../../utils/functions";
import { useListingsFilter } from "../../../state/store";
import { useUser } from "../../../lib/UserProvider";

type Props = {
  isEditing: boolean;
  catalogue: CatalogueType;
  listings: Listing[];
  handleSelectListing: (listingId: string) => void;
};

const ListingCardsContainer: React.FC<Props> = ({
  isEditing,
  catalogue,
  listings,
  handleSelectListing,
}) => {
  const { listingsFilter } = useListingsFilter();
  const { userId } = useUser();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [listingIds, setListingIds] = useState<string[]>(
    listings.map((listing) => listing.id)
  );
  const { deleteListing, reorderListing } = useListingApolloHooks();

  const listingDragging: Listing = listings.find(
    (listing) => listing.id === draggingId
  )!;

  useEffect(() => {
    setListingIds(listings.map((listing) => listing.id));
  }, [listings]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 100,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setDraggingId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over && event.active.id !== event.over.id) {
      // reorder the dnd state
      setListingIds((items) => {
        const oldIndex = items.indexOf(event.active.id);
        const newIndex = items.indexOf(event.over!.id);

        return arrayMove(items, oldIndex, newIndex);
      });
      // update db
      reorderListing(catalogue.id)(
        event.active.id,
        newOrdering(listings, event.active.id, event.over.id)
      );
    }
    setDraggingId(null);
  };

  const listingsFromIds = listingIds
    .map((listingId) => listings.find((listing) => listing.id === listingId)!)
    .filter((listing) => listing !== undefined);

  if (!listings.length) {
    return (
      <div className="listing-cards-container-wrapper">
        <div className="listing-cards-container">
          <div className="f-col f-center placeholder">
            {!catalogue.listings
              ? "No items in this list yet.\nTap “Edit” (pen button) to start adding items."
              : "No listings found."}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="listing-cards-container-wrapper">
      <div className="listing-cards-container">
        {listingsFilter.type === "custom" ? (
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            collisionDetection={closestCenter}
          >
            <SortableContext items={listingIds} strategy={rectSortingStrategy}>
              {listingsFromIds.map((listing: Listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  isEditing={isEditing}
                  isCreator={catalogue.user_id === userId}
                  selectListing={handleSelectListing}
                  deleteListing={deleteListing}
                  hide={listing.id === draggingId}
                />
              ))}
            </SortableContext>
            <DragOverlay>
              {draggingId && (
                <ListingCard
                  listing={listingDragging}
                  isCreator={catalogue.user_id === userId}
                  isEditing={isEditing}
                  selectListing={handleSelectListing}
                  deleteListing={deleteListing}
                  dragOverlay={true}
                />
              )}
            </DragOverlay>
          </DndContext>
        ) : (
          listings.map((listing: Listing) => (
            <ListingCard
              key={listing.id}
              isCreator={catalogue.user_id === userId}
              listing={listing}
              isEditing={isEditing}
              selectListing={handleSelectListing}
              deleteListing={deleteListing}
              hide={listing.id === draggingId}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ListingCardsContainer;
