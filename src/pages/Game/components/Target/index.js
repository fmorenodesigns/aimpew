import "./styles.scss";

import React from "react";

export default function Target({ size, left, top, onHit }) {
  return (
    <div
      className="target"
      style={{ width: size, height: size, left, top }}
      onClick={onHit}
    >
      <div className="white">
        <div className="red">
          <div className="white">
            <div className="red"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
