import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import React, { KeyboardEvent, useState, useRef, useEffect } from "react";
import { FiCheck, FiPlus, FiX } from "react-icons/fi";
import ReactTooltip from "react-tooltip";
import useLabelApolloHooks from "../../graphql/hooks/label";
import { useListingsFilter } from "../../state/store";
import { newOrdering } from "../../utils/functions";
import Label from "./Label";

type Props = {
  isEditing?: boolean;
  catalogue: CatalogueType;
  labels: Label[];
};

const LabelContainer: React.FC<Props> = ({ isEditing, catalogue, labels }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [labelIds, setLabelIds] = useState<string[]>(
    labels.map((label) => label.id)
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const labelDragging: Label = labels.find((label) => label.id === draggingId)!;

  const { createLabel, deleteLabel, reorderLabel } = useLabelApolloHooks({
    catalogue_id: catalogue.id,
  });
  const { listingsFilter, setListingsFilter } = useListingsFilter();

  useEffect(() => {
    setLabelIds(labels.map((label) => label.id));
  }, [labels]);

  const handleAddLabel = () => {
    if (!inputRef.current) {
      throw new Error("Could not get labels input");
    }
    if (!containerRef.current) {
      throw new Error("Could not get labels container");
    }
    if (createLabel && isAdding) {
      if (inputRef.current.value !== "") {
        createLabel(inputRef.current.value);
        inputRef.current.value = "";
        inputRef.current.focus();
      } else {
        // TODO: There should be some feedback for the user
        // console.log("No empty input");
      }
    } else {
      setIsAdding(true);
      inputRef.current.focus();
    }
  };

  const inputKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === "Enter" && inputRef.current && createLabel) {
      handleAddLabel();
    }
  };

  const toggleListingFilter = (listingId: string) => {
    // if (!isEditing) {
    // if listingsFilter.labelIds includes listingId, remove it
    if (listingsFilter.labelIds.includes(listingId)) {
      setListingsFilter({
        ...listingsFilter,
        labelIds: listingsFilter.labelIds.filter(
          (labelId) => labelId !== listingId
        ),
      });
    }
    // if not, add it
    else {
      setListingsFilter({
        ...listingsFilter,
        labelIds: [...listingsFilter.labelIds, listingId],
      });
    }
    // }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 100,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setDraggingId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.over && event.active.id !== event.over.id) {
      // reorder the dnd state
      setLabelIds((items) => {
        const oldIndex = items.indexOf(event.active.id);
        const newIndex = items.indexOf(event.over!.id);

        return arrayMove(items, oldIndex, newIndex);
      });
      // update db
      reorderLabel(
        event.active.id,
        newOrdering(labels, event.active.id, event.over.id)
      );
    }
    setDraggingId(null);
  };

  const labelsFromIds = labelIds
    .map((labelId) => labels.find((label) => label.id === labelId)!)
    .filter((label) => label !== undefined);

  const LabelPlaceholder = () => {
    if (!labels.length && isEditing) {
      return <div className="label-placeholder">No labels</div>;
    }
    return null;
  };

  return (
    <div className="labels-container" ref={containerRef}>
      <LabelPlaceholder />
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <SortableContext items={labelIds} strategy={rectSortingStrategy}>
          {labelsFromIds.map((label: Label) => (
            <Label
              key={label.id}
              className={`${isEditing ? "can-delete" : ""}`}
              label={label}
              isEditing={isEditing}
              onClick={() => toggleListingFilter(label.id)}
              faint={!listingsFilter.labelIds.includes(label.id)}
              deleteLabel={(id) => deleteLabel(id, catalogue)}
              hide={label.id === draggingId}
            />
          ))}
        </SortableContext>
        <DragOverlay>
          {draggingId && (
            <Label
              key={labelDragging.id}
              className={`label ${isEditing ? "can-delete" : ""}`}
              label={labelDragging}
              isEditing={isEditing}
              onClick={() => toggleListingFilter(labelDragging.id)}
              faint={!listingsFilter.labelIds.includes(labelDragging.id)}
              deleteLabel={(id) => deleteLabel(id, catalogue)}
            />
          )}
        </DragOverlay>
      </DndContext>
      {isEditing && (
        <div className="f-row f-center add-label-container">
          <div className={`adding-group ${!isAdding ? "invisible" : ""}`}>
            <input
              ref={inputRef}
              onKeyDown={inputKeyDown}
              className="add-input"
              type="text"
              // onBlur={() => setIsAdding(false)}
            />
            <button
              onClick={handleAddLabel}
              className="f-row f-center btn-circle pos select-btn"
            >
              <FiCheck size="2rem" />
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="f-row f-center btn-circle neg select-btn"
            >
              <FiX size="2rem" />
            </button>
          </div>
          <button
            data-tip
            data-for="add-label"
            className={`f-row f-center ${isAdding ? "invisible" : ""}`}
            onClick={handleAddLabel}
          >
            <FiPlus size="1.2rem" />
          </button>
          <ReactTooltip id="add-label" place="top" effect="solid">
            {"Add label"}
          </ReactTooltip>
        </div>
      )}
    </div>
  );
};

export default LabelContainer;
