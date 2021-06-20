import "./styles.scss";

import React, { useMemo, useState } from "react";

import { useLocalStorage } from "../../hooks";

export default function Target({ size, left, top, onHit }) {
  const gameOptions = useLocalStorage("game-options")[0];
  const audio = useMemo(() => new Audio("./hit.mp3"), []);
  const [hit, setHit] = useState(false);

  return (
    <div
      className={`target ${hit ? "hit" : ""}`}
      style={{
        left,
        top,
        transform: `scale(${(size / 40) * (hit ? 1.3 : 1)})`,
      }}
      onClick={() => {
        if (gameOptions.onHitSoundEffect) {
          audio.currentTime = 0;
          audio.play();
        }
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
