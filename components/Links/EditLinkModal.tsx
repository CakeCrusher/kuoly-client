import React from "react";
import Modal from "../Modal/Modal";
import useLinkApolloHooks from "../../graphql/hooks/link";
import { isUrl, rootUrl } from "../../utils/functions";

import TextInput from "../fields/TextInput/TextInput";

type Props = {
  link: Link | null;
  handleClose: () => void;
};

const EditLinkModal: React.FC<Props> = ({ link, handleClose }) => {
  const { editLink } = useLinkApolloHooks();

  if (!link) return null;

  const handleSubmit = (text: string, keyProp: string) => {
    const key = keyProp.split(":").pop();
    if (!key) {
      console.warn("Key error");
      return;
    }
    editLink(link.id, text, key);
  };

  return (
    <Modal show={link !== null} close={handleClose}>
      <Modal.Header close={handleClose}>
        <span className="edit-link-header">Edit link info</span>
      </Modal.Header>
      <Modal.Body>
        <div className="edit-link-body">
          <div className="title-img-container">
            <TextInput
              isEditing={true}
              handleSubmit={handleSubmit}
              value={link.title || ""}
              fieldEditingProp={{
                typename: "Link",
                key: "title",
                id: link.id,
              }}
              placeholder="title"
              className="title-input"
            />
            <div className="link-icon-container">
              <img
                src={`https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${rootUrl(
                  link.url
                )}&size=256`}
                alt="url favicon"
                className="link-icon"
              />
            </div>
          </div>
          <TextInput
            isEditing={true}
            handleSubmit={handleSubmit}
            validator={isUrl}
            value={link.url || ""}
            fieldEditingProp={{
              typename: "Link",
              key: "url",
              id: link.id,
            }}
            placeholder="url"
            className="link-url"
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditLinkModal;
