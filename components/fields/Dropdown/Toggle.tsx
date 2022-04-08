import React from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { IconButton } from "../..";

import { DropDownContext } from "./Dropdown";

type ToggleProps = {
  disable?: boolean;
  className?: string;
};

const Toggle: React.FC<ToggleProps> = ({ className, disable }) => {
  const { activeValue, show, setShow } = React.useContext(DropDownContext);
  const handleToggle = () => {
    setShow((prev: boolean) => !prev);
  };

  return (
    <div
      onClick={disable ? undefined : handleToggle}
      className={`dropdown-toggle ${className ? className : ""}`}
    >
      <span>{activeValue.charAt(0).toUpperCase() + activeValue.slice(1)}</span>

      {!disable && (
        <IconButton onClick={() => {}}>
          {show ? <FiChevronUp /> : <FiChevronDown />}
        </IconButton>
      )}
    </div>
  );
};

export default Toggle;
