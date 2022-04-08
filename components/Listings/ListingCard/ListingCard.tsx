import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
import { useRouter } from "next/router";
import { Label } from "../..";
import { cleanedPath, rootUrl, textClipper } from "../../../utils/functions";

import { useSortable } from "@dnd-kit/sortable";
import { FiX } from "react-icons/fi";
import { MdOutlineDragIndicator } from "react-icons/md";
import { useListingsFilter } from "../../../state/store";
import Link from "next/link";

type Props = {
  isEditing: boolean;
  listing: Listing;
  selectListing: (listingId: string) => void;
  deleteListing: (id: string) => void;
  hide?: boolean;
  dragOverlay?: boolean;
};

const ListingCard: React.FC<Props> = ({
  isEditing,
  listing,
  selectListing,
  deleteListing,
  hide,
  dragOverlay,
}) => {
  const { listingsFilter } = useListingsFilter();
  const router = useRouter();
  // const navigate = useNavigate();
  // const location = useLocation();
  const handleDelete = () => {
    deleteListing(listing.id);
  };
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: listing.id,
      transition: {
        duration: 150,
        easing: "ease-in-out",
      },
      disabled: !isEditing,
    });

  const handleSelect = () => {
    let urlToNavigate: string = `/ctg/${router.query.ids[0]}`;
    // listing
    urlToNavigate += `/${listing.id}`;
    // add location.search if it exists
    if (router.query.edit) {
      urlToNavigate += `?edit=${router.query.edit}`;
    }
    router.replace(urlToNavigate, "", { shallow: true });
    selectListing(listing.id);
    return urlToNavigate;
  };

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : "",
    transition,
  };

  return (
    <div
      onClick={handleSelect}
      className={`card ${isEditing ? "editing" : ""} listing-card ${
        hide && "hide"
      } ${dragOverlay && "drag-overlay"}`}
      ref={setNodeRef}
      style={style}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card-header text-center"
        {...listeners}
        {...attributes}
      >
        {isEditing && (
          <>
            {listingsFilter.type === "custom" && (
              <MdOutlineDragIndicator className="drag-handle-icon" />
            )}
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onClick={handleDelete}
              className="btn-circle neg delete-btn icon-button"
            >
              <FiX size="1rem" />
            </button>
          </>
        )}
      </div>
      <div className="card-body listing-card-body">
        <div>
          {listing.image_url && (
            <div
              className={`listing-image-wrapper ${
                listing.image_url ? "m-bot" : ""
              }`}
            >
              <img src={listing.image_url} draggable={false} />
            </div>
          )}

          <div className="listing-title-description">
            <h5 className={`listing-title ${listing.name ? "m-bot" : ""}`}>
              {textClipper(listing.name, 50)}
            </h5>
            <p
              className={`listing-description ${
                listing.description ? "m-bot" : ""
              }`}
            >
              {textClipper(listing.description, 100)}
            </p>
          </div>

          <div
            className={`listing-labels ${
              listing.labels && listing.labels.length ? "m-bot" : ""
            }`}
          >
            {/* <LabelContainer> */}
            {listing.labels &&
              listing.labels.map((e: ListingLabel) => {
                return <Label key={e.id} label={e.label} />;
              })}
            {/* </LabelContainer> */}
          </div>

          {listing.show_price && listing.price && (
            <div className={`listing-price m-bot`}>
              <span className="price">~${listing.price}</span>
            </div>
          )}
        </div>

        <div
          className={`listing-links-container ${
            listing.links && listing.links.length ? "m-bot" : ""
          }`}
        >
          {listing.links &&
            listing.links.slice(0, 2).map((link: Link) => (
              <a
                href={link.url}
                key={link.id}
                className="listing-link-container"
                target="_blank"
              >
                <div className="link-content">
                  <img
                    className="link-icon"
                    src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${rootUrl(
                      link.url
                    )}&size=256`}
                    alt="url favicon"
                  />
                  <span>{textClipper(link.title, 20)}</span>
                </div>
              </a>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
