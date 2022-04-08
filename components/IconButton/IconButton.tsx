import React from "react";

type Props = {
  className?: string;
  label?: string;
  onClick?: (args: any) => void;
};

const IconButton: React.FC<Props> = ({
  className,
  onClick,
  label,
  children,
}) => {
  if (!onClick) {
    return (
      <div className={`icon-button ${className ? className : ""}`}>
        {children}
        <span>{label}</span>
      </div>
    );
  }
  return (
    <button
      className={`icon-button ${className ? className : ""}`}
      onClick={onClick}
    >
      {children}
      <span>{label}</span>
    </button>
  );
};

export default IconButton;
