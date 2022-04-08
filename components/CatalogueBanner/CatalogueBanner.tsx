import React, { useState, useRef, ChangeEvent, useEffect } from "react";

import { Modal, ColorInput, IconButton } from "..";

import useCatalogueApolloHooks from "../../graphql/hooks/catalogue";
import { updateCatalogueCache } from "../../utils/functions";
import { FiCamera, FiTrash2, FiUpload } from "react-icons/fi";

type Props = {
  isEditing: boolean;
  handleSubmit: CatalogueHook.editCatalogueFile;
  handleDelete: CatalogueHook.editCatalogue;
  value: string;
  keyProp: string;
  catalogue: CatalogueType;
  className?: string;
};

const CatalogueBanner: React.FC<Props> = ({
  isEditing,
  handleSubmit,
  handleDelete,
  keyProp,
  value,
  catalogue,
  className,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { editCatalogue } = useCatalogueApolloHooks({ id: catalogue.id });

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const handleFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files[0]) {
      setImage(null);
      return;
    }

    const file = evt.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  const handleClickSubmit = () => {
    if (!fileRef.current)
      throw new Error("Could not find fileRef for AvatarImage");

    const { files } = fileRef.current;
    if (!files || !files[0]) throw new Error("No file selected");

    handleSubmit(new File([files[0]], files[0].name), keyProp);
  };

  const handleFileDelete = () => {
    handleDelete("", keyProp);
  };

  return (
    <>
      <div
        className="catalogue-banner-container"
        style={value || isEditing ? {} : { display: "none" }}
      >
        {/* open modal, display image */}
        <div className="toggle-wrapper">
          <div className={`toggle-input icons-container f-center`}>
            {/* change image */}
            {isEditing && (
              <>
                <IconButton onClick={handleModal}>
                  <FiCamera color="white" size="2rem" />
                </IconButton>
                <ColorInput
                  color={catalogue.header_color}
                  handleChange={(color: string) =>
                    updateCatalogueCache(
                      `Catalogue:${catalogue.id}`,
                      "header_color",
                      color
                    )
                  }
                  handleSubmit={(color: string) => {
                    editCatalogue(color, "header_color");
                  }}
                />
              </>
            )}
          </div>
          {/* background images */}
          <div
            style={value ? {} : { borderWidth: "2px", height: "3.5rem" }}
            className={`toggle-input image-wrapper`}
          >
            <img id="header-image-display" src={value} alt="" />
          </div>
          <div className={`toggle-display image-wrapper`}>
            <img id="header-image-input" src={value} alt="" />
          </div>
        </div>
      </div>
      {/* file selection, image cropping, submit */}
      <Modal show={showModal} close={handleModal}>
        <Modal.Header close={handleModal}>Edit Header Image</Modal.Header>
        <Modal.Body>
          <div className="m-bot" />
          {image ? (
            <div className="m-bot banner-image-container">
              <img src={image} alt="" />
            </div>
          ) : null}
          <div className="file-delete-row">
            <div className="file-input">
              <label
                className="btn btn-secondary-outline file-label"
                htmlFor={keyProp}
              >
                <FiUpload className="icon" />
                <div>Upload</div>
              </label>
              <input
                ref={fileRef}
                onChange={handleFileChange}
                className={`toggle-input file-input ${className || ""}`}
                type="file"
                name={keyProp}
                id={keyProp}
              />
            </div>
            <button
              onClick={handleFileDelete}
              className="btn btn-delete delete"
            >
              <FiTrash2 color="white" />
            </button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {image && (
            <button
              className="btn btn-primary submit"
              onClick={handleClickSubmit}
            >
              Submit
            </button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CatalogueBanner;
