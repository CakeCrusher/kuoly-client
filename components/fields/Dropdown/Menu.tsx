import React from "react";

import { DropDownContext } from "./Dropdown";

type MenuProps = {
  className?: string;
};

const Menu: React.FC<MenuProps> = ({ children, className }) => {
  const { show } = React.useContext(DropDownContext);
  if (!show) return null;
  return (
    <div
      className={`dropdown-menu ${
        className ? className : ""
      }`}
    >
      {children}
    </div>
  );
};

export default Menu;
