import React, { useRef } from "react";
import { IconButton } from "../..";
// import { Palette } from "../../../assets";
import { MdOutlineColorLens } from "react-icons/md";

type Props = {
  color: string;
  handleChange: (color: string) => void;
  handleSubmit: (color: string) => void;
};
const Color = ({ color, handleChange, handleSubmit }: Props) => {
  const colorInput = useRef<HTMLInputElement>();

  const handleToggle = () => {
    // on toggle click on colorInput
    colorInput.current?.click();
    colorInput.current?.focus();
  };

  return (
    <div>
      <IconButton onClick={handleToggle}>
        <MdOutlineColorLens color="white" size="2rem" />
      </IconButton>
      <div className="color-picker-container">
        <input
          className="color-picker-input"
          // @ts-ignore
          ref={colorInput}
          type="color"
          value={color}
          onBlur={(e) => {
            handleSubmit(e.target.value || "#ff0000");
          }}
          onChange={(e) => {
            handleChange(e.target.value || "#ff0000");
          }}
        />
      </div>
    </div>
  );
};

export default Color;
