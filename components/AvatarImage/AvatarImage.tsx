import React, {
  ChangeEvent,
  createRef,
  useEffect,
  useRef,
  useState,
} from "react";

import { IconButton, ImageCrop, Modal } from "..";
import { acceptedImageFiles } from "../../utils/references";
// import { Camera } from "../../assets";

import { FiCamera, FiTrash2, FiUpload } from "react-icons/fi";

type Props = {
  isEditing: boolean;
  handleSubmit: CatalogueHook.editCatalogueFile;
  handleDelete: CatalogueHook.editCatalogue;
  value: string;
  keyProp: string;
  className?: string;
};

const AvatarImage: React.FC<Props> = ({
  isEditing,
  handleSubmit,
  handleDelete,
  keyProp,
  value,
  className,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleModal = () =>
    setShowModal((prev) => {
      (fileRef as any).current.value = "";
      return !prev;
    });

  const handleFileChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files[0]) {
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
        className="avatar-image-container"
        style={value || isEditing ? {} : { display: "none" }}
      >
        {/* open modal, display image */}
        {/* TODO: Replace Icon */}
        <div className="toggle-wrapper">
          <div className={`toggle-input icons-container f-center`}>
            {isEditing && (
              <IconButton onClick={handleModal}>
                <FiCamera color="white" size="2rem" />
              </IconButton>
            )}
          </div>
          <div className={`toggle-input image-wrapper`}>
            <img id="avatar-image-display" src={value} alt="" />
          </div>
          <div
            style={value ? {} : { borderWidth: "2px" }}
            className={`toggle-display image-wrapper`}
          >
            <img id="avatar-image-input" src={value} alt="" />
          </div>
        </div>
      </div>
      {/* file selection, image cropping, submit */}
      <Modal show={showModal} close={handleModal}>
        <Modal.Header close={handleModal}>Edit Avatar Image</Modal.Header>
        <Modal.Body>
          {/* ImageCrop: pass ref to component */}
          {/* if fileRef exists show it */}
          <div className="m-bot" />
          {image ? (
            <div className="m-bot prof-image-wrapper">
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
                accept=".png,.jpeg,.jpg,.gif"
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

export default AvatarImage;
