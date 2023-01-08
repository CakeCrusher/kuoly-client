import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import { FiX } from "react-icons/fi";
import { MdOutlineDragIndicator } from "react-icons/md";
import { useListingsFilter } from "../../state/store";
import { textClipper } from "../../utils/functions";

type LabelProps = {
  isEditing?: boolean;
  label: Label;
  faint?: boolean;
  deleteLabel?: (id: string) => void;
  onClick?: () => void;
  className?: string;
  hide?: boolean;
  isCreator?: boolean;
  exclude?: boolean;
};

const Label: React.FC<LabelProps> = ({
  isEditing,
  faint,
  deleteLabel,
  label,
  onClick,
  hide,
  isCreator,
  exclude,
}) => {
  const { listingsFilter, setListingsFilter } = useListingsFilter();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: label.id,
      transition: {
        duration: 150,
        easing: "ease-in-out",
      },
      disabled: !isEditing,
    });
  const handleDeleteClick = (e: any) => {
    e.stopPropagation();
    if (deleteLabel) {
      setListingsFilter({
        ...listingsFilter,
        labelIds: listingsFilter.labelIds.filter(
          (labelId) => labelId !== label.id
        ),
        excludeLabelIds: listingsFilter.excludeLabelIds.filter(
          (labelId) => labelId !== label.id
        ),
      });
      deleteLabel(label.id);
    }
  };
  const handleClick = () => {
    if (onClick) onClick();
  };
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : "",
    transition,
  };

  return (
    <div
      onClick={handleClick}
      className={`label f-center ${
        isEditing && deleteLabel ? "show-delete" : ""
      } ${onClick ? "clickable" : ""} ${hide ? "hide" : faint && "faint"} ${exclude ? "exclude" : ""}`}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
    >
      <span>{textClipper(label.name, 20)}</span>
      {isEditing && deleteLabel ? (
        <div className="drag-indicator">
          <MdOutlineDragIndicator />
        </div>
      ) : null}
      {isCreator && (
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={handleDeleteClick}
          className="f-row f-center btn-circle neg delete-label"
        >
          <FiX size="1rem" />
        </button>
      )}
    </div>
  );
};

export default Label;
