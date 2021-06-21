import "./styles.scss";

import React, { useState } from "react";

export default function Target({ size, left, top, onHit }) {
  const [hit, setHit] = useState(false);

  return (
    <div
      className={`target ${hit ? "hit" : ""}`}
      style={{
        left,
        top,
        transform: `scale(${(size / 40) * (hit ? 1.4 : 1)})`,
      }}
      onClick={() => {
        if (hit) return;

        setHit(true);
        onHit();
      }}
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
