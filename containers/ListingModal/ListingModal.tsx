import React from "react";
import { FiEdit2, FiEye, FiShare2, FiTrash2 } from "react-icons/fi";
import ReactTooltip from "react-tooltip";

import {
  FileInput,
  Modal,
  TextInput,
  Checkbox,
  TextareaInput,
  ListingLabelContainer,
  LinksContainer,
  CopyToolTip,
} from "../../components";
import useListingApolloHooks from "../../graphql/hooks/listing";
import { useIsEditing } from "../../state/store";
import { handleCopy } from "../../utils/functions";

import "./ListingModal.less";

type Props = {
  catalogueId: string;
  listingId: string | null;
  listing: Listing | null;
  labels: Label[] | null;
  handleClose: () => void;
  editable: boolean;
};

const ListingModal: React.FC<Props> = ({
  catalogueId,
  listingId,
  listing,
  labels,
  handleClose,
  editable,
}) => {
  const { editListing, editBoolean, editListingFile, deleteListing } =
    useListingApolloHooks();
  const { isEditing, setIsEditing } = useIsEditing();
  if (!listingId) return null;
  if (!listing) {
    return (
      <Modal show={listing !== null} close={handleClose}>
        <div className="modal-header">Listing no longer exists</div>
      </Modal>
    );
  }
  const handleShareClick = (evt: React.SyntheticEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    handleCopy(`/ctg/${catalogueId}/${listingId}`);
  };

  return (
    <Modal
      className="listing-modal-container"
      show={listing !== null}
      close={handleClose}
    >
      <Modal.Header close={handleClose}></Modal.Header>
      <Modal.Body>
        {/* left side - name, image*/}
        <div className="listing-container">
          <div className="header-buttons">
            <div className="btn-wrapper">
              {editable && (
                <>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn-icon btn-secondary edit-btn"
                  >
                    {isEditing ? (
                      <>
                        <FiEye />
                        <div>Preview</div>
                      </>
                    ) : (
                      <>
                        <FiEdit2 />
                        <div>Edit</div>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
            {isEditing && (
              <button
                className="btn f-row option"
                onClick={() => deleteListing(listing.id)}
              >
                <FiTrash2 />
                <div className="fs-1 m-lef-sm"> Delete</div>
              </button>
            )}

            <CopyToolTip text="Copy listing link">
            <button
              className="btn f-row option"
              onClick={handleShareClick}
            >
              <FiShare2 />
              <div className="fs-1 m-lef-sm">Share</div>
            </button>
            </CopyToolTip>
          </div>
          <div className="listing-body-container">
            <div className="left-side side">
              <TextInput
                isEditing={isEditing}
                handleSubmit={editListing(listing.id)}
                value={listing.name || ""}
                fieldEditingProp={{
                  typename: "Listing",
                  key: "name",
                  id: listing.id,
                }}
                className="listing-title m-bot"
                placeholder="Title"
              />
              <div className="image-wrapper m-bot">
                <FileInput
                  className="image-input"
                  isEditing={isEditing}
                  handleSubmit={editListingFile(listing.id)}
                  keyProp="image_url"
                  value={listing.image_url}
                />
              </div>
            </div>
            <div className="listing-separator"></div>
            {/* right side - description, labels, links, price*/}
            <div className="right-side side">
              <TextareaInput
                isEditing={isEditing}
                handleSubmit={editListing(listing.id)}
                value={listing.description || ""}
                fieldEditingProp={{
                  typename: "Listing",
                  key: "description",
                  id: listing.id,
                }}
                placeholder="Description"
                className="listing-description m-bot"
              />
              {labels && labels.length > 0 && (
                <div className="m-bot">
                  {isEditing && <h3 className="field-title">Select labels</h3>}
                  <div>
                    <ListingLabelContainer
                      labels={labels}
                      listing={listing}
                      isEditing={isEditing}
                    />
                  </div>
                </div>
              )}

              {isEditing || (listing.price && listing.show_price) ? (
                <div className="f-row price m-bot">
                  <div className="f-row">
                    $
                    <TextInput
                      isEditing={isEditing}
                      handleSubmit={editListing(listing.id)}
                      value={listing.price?.toString() || ""}
                      fieldEditingProp={{
                        typename: "Listing",
                        key: "price",
                        id: listing.id,
                      }}
                      validator={(value) => {
                        // the value may only contain numbers and a decimal point
                        if (value.match(/^[0-9]+(\.[0-9]{1,2})?$/)) return true;
                        return false;
                      }}
                      placeholder="Est. price"
                      className="price-input "
                    />
                  </div>
                  <div className="m-lef">
                    <Checkbox
                      isEditing={isEditing}
                      value={listing.show_price}
                      label="Show price"
                      keyProp="show_price"
                      onChange={editBoolean(listing.id)}
                    />
                  </div>
                </div>
              ) : null}
              {((listing.links && listing.links.length > 0) || isEditing) && (
                <div className="m-bot">
                  <h3 className="field-title m-bot-sm">Buy it from:</h3>
                  <LinksContainer listing={listing} isEditing={isEditing} />
                </div>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ListingModal;
