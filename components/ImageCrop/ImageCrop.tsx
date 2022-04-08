import React from "react";

// const ImageCrop = () => {
//   return <div>ImageCrop</div>;
// };

// export default ImageCrop;

import RefManager from "./RefManager";

import { FiZoomIn, FiZoomOut } from "react-icons/fi";

type Props = {};

const ImageCrop = React.forwardRef<ImageCrop.RefManager, Props>(
  (_props, ref) => {
    const handleRefs = (parent: HTMLDivElement | null) => {
      if (parent) {
        const canvas = parent.querySelector("canvas");
        const range = parent.querySelector("input");

        if (ref && canvas && range) {
          (ref as any).current.canvas = canvas;
          (ref as any).current.range = range;
        }
      }
    };

    return (
      <div
        className="d-flex flex-column image-crop"
        ref={(elm) => handleRefs(elm)}
      >
        <canvas></canvas>
        <div className="zoom-container">
          <FiZoomOut size="1.2rem" className="zoom-icon" />
          <input type="range" defaultValue={0} max={1} step={0.005} />
          <FiZoomIn size="1.2rem" className="zoom-icon" />
        </div>
      </div>
    );
  }
);

export default Object.assign(ImageCrop, { RefManager });
