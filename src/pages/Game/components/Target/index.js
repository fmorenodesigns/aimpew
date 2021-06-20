import "./styles.scss";

import React, { useState } from "react";

export default function Target({ size, left, top, onHit }) {
  const [hit, setHit] = useState(false);

  return (
    <div
      className={`target ${hit ? "hit" : ""}`}
      style={{ width: size, height: size, left, top }}
      onClick={() => {
        setHit(true);
        setTimeout(() => {
          onHit();
        }, [200]);
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
