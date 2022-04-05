import React from "react";
import { useMarkedForDeletion, useRemoveMFD } from "../../state/store";
import { textClipper } from "../../utils/functions";

const UndoNotification = () => {
  const { markedForDeletion } = useMarkedForDeletion();
  const { setRemoveMFD } = useRemoveMFD();
  return (
    <div className="f-col f-center notification-container">
      {markedForDeletion.map((mfd) => (
        <div key={mfd.id} className="undo-container">
          {textClipper(mfd.text, 30)}{" "}
          <button
            onClick={() => {
              clearTimeout(mfd.timeout);
              setRemoveMFD({ id: mfd.id, isUndo: true });
            }}
            className="undo-button"
          >
            Undo
          </button>
        </div>
      ))}
    </div>
  );
};

export default UndoNotification;
