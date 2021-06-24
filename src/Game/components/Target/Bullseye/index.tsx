import "./styles.scss";

import { TargetProps } from "..";
import { useState } from "react";

export default function Bullseye({
  size,
  left,
  top,
  onHit,
  ...props
}: TargetProps) {
  const [hit, setHit] = useState(false);

  return (
    <div
      className={`target bullseye ${hit ? "hit" : ""}`}
      style={{
        left: `${left * 100}%`,
        top: `${top * 100}%`,
        transform: `scale(${(size / 40) * (hit ? 1.7 : 1)})`,
      }}
      onClick={() => {
        if (hit) return;

        setHit(true);
        onHit();
      }}
      {...props}
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
