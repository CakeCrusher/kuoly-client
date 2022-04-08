import React, { useState } from "react";
import { Camera } from "../../../assets";
import IconButton from "../../IconButton/IconButton";

import "./FileInput.less";

type Props = {
  isEditing: boolean;
  handleSubmit: GenericFileEdit;
  value: string | null;
  keyProp: string;
  className?: string;
};

const FileInput: React.FC<Props> = ({
  isEditing,
  handleSubmit,
  keyProp,
  value,
  className,
}) => {
  const [file, setFile] = useState<File | undefined>(undefined);

  const handleFileInput = (evt: React.SyntheticEvent<HTMLInputElement>) => {
    const { files } = evt.currentTarget;
    if (files && files[0]) {
      setFile(files[0]);
      handleSubmit(files[0], keyProp);
    } else {
      // console.error("No file selected");
    }
  };

  return (
    <div>
      {isEditing && (
        <div className="file-input">
          <label
            className={value ? "with-image" : "no-image"}
            htmlFor={keyProp}
          >
            <IconButton src={Camera} />
          </label>
          <input
            className={`toggle-input standard-text-input ${className || ""}`}
            type="file"
            onChange={handleFileInput}
            name={keyProp}
            id={keyProp}
            accept="*.png,*.jpeg,*.jpg,*.txt ,*.gif"
          />
        </div>
      )}
      {value && <img className="file-image" src={value} alt="" />}
    </div>
  );
};

export default FileInput;
