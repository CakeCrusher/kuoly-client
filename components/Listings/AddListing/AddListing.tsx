import React, { KeyboardEvent, useRef } from "react";
import { FiChevronRight } from "react-icons/fi";

type Props = {
  handleSubmit: (name: string) => void;
  isEditing: boolean;
};

const AddListing: React.FC<Props> = ({ handleSubmit, isEditing }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isEditing) return null;

  const handleClick = () => {
    if (inputRef.current) {
      const target = inputRef.current;

      if (target.value !== "") {
        handleSubmit(target.value);
        target.value = "";
      } else {
        // TODO: There should be some feedback for the user
        // console.log("No empty input");
      }
    }
  };

  const handleKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === "Enter" && inputRef.current) {
      handleClick();
    }
  };

  return (
    <div className="add-listing-container">
      <label>Add Item:</label>
      <div className="inputs-container">
        <input
          placeholder="Type an item or paste a link..."
          ref={inputRef}
          onKeyDown={handleKeyDown}
          type="text"
        />
        <div className="btn-wrapper">
          <button className="btn-secondary" onClick={handleClick}>
            <FiChevronRight size="1.5rem" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddListing;
