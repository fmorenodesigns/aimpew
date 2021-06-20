import "./styles.scss";

import React from "react";

export default function Cube({
  width,
  depth,
  height,
  colors,
  borderColor = null,
}) {
  const boxShadow = borderColor ? `inset 0 0 0 1px ${borderColor}` : undefined;

  return (
    <div className="cube-container">
      <div
        className="cube"
        style={{
          width,
          height,
          transformOrigin: `center center -${depth / 2}px`,
        }}
      >
        <div
          className="face front"
          style={{
            width,
            height,
            backgroundColor: typeof colors === "string" ? colors : colors.front,
            boxShadow,
          }}
        />
        <div
          className="face back"
          style={{
            width,
            height,
            backgroundColor: typeof colors === "string" ? colors : colors.back,
            transform: `translateZ(-${depth}px)`,
            boxShadow,
          }}
        />
        <div
          className="face left"
          style={{
            width: depth,
            height,
            backgroundColor: typeof colors === "string" ? colors : colors.left,
            boxShadow,
          }}
        />
        <div
          className="face right"
          style={{
            width: depth,
            height,
            backgroundColor: typeof colors === "string" ? colors : colors.right,
            boxShadow,
          }}
        />
        <div
          className="face top"
          style={{
            width,
            height: depth,
            backgroundColor: typeof colors === "string" ? colors : colors.top,
            boxShadow,
          }}
        />
        <div
          className="face bottom"
          style={{
            width,
            height: depth,
            backgroundColor:
              typeof colors === "string" ? colors : colors.bottom,
            boxShadow,
          }}
        />
      </div>
    </div>
  );
}
