import React, { KeyboardEvent, useRef, useState } from "react";
import { FiCheck, FiEdit2, FiPlus, FiX } from "react-icons/fi";
import useLinkApolloHooks from "../../graphql/hooks/link";
import { isUrl, rootUrl, textClipper } from "../../utils/functions";
import EditLinkModal from "./EditLinkModal";

type Props = {
  listing: Listing;
  isEditing: boolean;
};

const LinksContainer: React.FC<Props> = ({ listing, isEditing }) => {
  const linkInputRef = useRef<HTMLInputElement>(null);
  const [linkEditingId, setLinkEditingId] = useState<string | null>(null);
  const [_isValid, setIsValid] = useState(true);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const { addLink, removeLink } = useLinkApolloHooks();

  const handleSubmit = () => {
    if (!linkInputRef.current) {
      return null;
    }
    if (isUrl(linkInputRef.current.value)) {
      setIsValid(true);
      addLink(listing.id, linkInputRef.current.value);
      linkInputRef.current!.value = "";
    } else {
      setIsValid(false);
    }
    linkInputRef.current.focus();
  };
  const inputKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === "Enter" && linkInputRef.current) {
      handleSubmit();
    }
  };

  const handleEditLinkClose = () => {
    setLinkEditingId(null);
  };

  const stopAddingLink = () => {
    if (linkInputRef.current) {
      linkInputRef.current.value = "";
      setIsAddingLink(false);
    }
  };

  const linkEditing =
    linkEditingId && listing.links
      ? listing.links.find((lk: Link) => lk.id === linkEditingId)!
      : null;
  const orderedLinks: Link[] | null =
    listing.links &&
    [...listing.links].sort((a: Link, b: Link) => {
      // transform date to number
      return new Date(a.created).getTime() - new Date(b.created).getTime();
    });

  const onAddLinkClick = () => {
    setIsAddingLink(true);
    if (linkInputRef.current) {
      linkInputRef.current.focus();
    }
  };

  return (
    <div className="listing-links-container-modified">
      {orderedLinks &&
        orderedLinks.map((link: Link) => (
          <>
            {isEditing ? (
              <div key={link.id} className="listing-link-container editing">
                <button
                  className="btn-icon btn-secondary edit-btn edit-link-btn"
                  onClick={() => setLinkEditingId(link.id)}
                >
                  <FiEdit2 />
                </button>

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
                <button
                  onClick={() => removeLink(link.id)}
                  className="f-row f-center btn-circle neg select-btn"
                >
                  <FiX size="2rem" />
                </button>
              </div>
            ) : (
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
            )}
          </>
        ))}
      {isEditing && (
        <div className="listing-link-container editing add-link-container">
          <div className={`adding-group ${isAddingLink ? "" : "invisible"}`}>
            <input
              ref={linkInputRef}
              onKeyDown={inputKeyDown}
              className={`add-input ${_isValid ? "" : "invalid"}`}
              type="text"
              placeholder="Add a link..."
              // onBlur={() => setIsAdding(false)}
            />
            <button
              onClick={handleSubmit}
              className="f-row f-center btn-circle pos select-btn"
            >
              <FiCheck size="2rem" />
            </button>
            <button
              onClick={stopAddingLink}
              className="f-row f-center btn-circle neg select-btn"
            >
              <FiX size="2rem" />
            </button>
          </div>
          <button
            onClick={onAddLinkClick}
            className={`f-row f-center add-link-container-button ${
              isAddingLink ? "invisible" : ""
            }`}
          >
            <FiPlus className="link-add-icon" />
            <span>Add a link...</span>
          </button>
        </div>
      )}
      <EditLinkModal link={linkEditing} handleClose={handleEditLinkClose} />
    </div>
  );
};

export default LinksContainer;
