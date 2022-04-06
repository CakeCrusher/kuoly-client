import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { Modal } from "..";
import { DELTETE_CATALOGUE } from "../../graphql/schemas";
import {
  apolloHookErrorHandler,
  handleCacheDeletion,
} from "../../utils/functions";

const DeleteCatalogueButton: React.FC<{
  id: string;
}> = ({ id }) => {
  const [showModal, setShowModal] = useState(false);
  const [deleteCatalogue, { error }] = useMutation(DELTETE_CATALOGUE, {
    variables: { id },
    fetchPolicy: "no-cache",
  });

  apolloHookErrorHandler("CatalogueSelect.tsx", error);

  const handleDelete = () => {
    setShowModal(false);
    handleCacheDeletion(`Catalogue:${id}`);
    deleteCatalogue();
  };

  const handleClose = () => setShowModal(false);

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <button className="btn f-row option" onClick={() => setShowModal(true)}>
        <div>
          <FiTrash2 />
        </div>
        <div className="fs-1"> Delete</div>
      </button>
      <Modal show={showModal} close={handleClose}>
        <Modal.Header close={handleClose}> </Modal.Header>
        <Modal.Body>Are you sure you want to delete this list?</Modal.Body>
        <Modal.Footer>
          <div className="g-row options-container">
            <button className="btn btn-secondary-outline" onClick={handleClose}>
              Cancel
            </button>
            <button
              className="f-row btn btn-delete delete-container"
              onClick={handleDelete}
            >
              <FiTrash2 className="icon" />
              <div>Delete</div>
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteCatalogueButton;
