import "./styles.scss";

import { useMemo, useState } from "react";

import Cube from "../../Cube";
import { TargetProps } from "..";

export default function Pewion({ size, left, top, onHit }: TargetProps) {
  const sideSign = useMemo(() => (left < 0.5 ? 1 : -1), [left]);

  const [hit, setHit] = useState(false);
  const colors = useMemo(() => (hit ? ON_HIT_COLORS : DEFAULT_COLORS), [hit]);

  return (
    <div
      className={`monster ${hit ? "hit" : ""}`}
      style={{
        left: `${left * 100}%`,
        top: `${top * 100}%`,
        transform: `rotateX(-30deg) rotateY(${
          70 * (0.5 - left) + 10 * sideSign
        }deg) scale(${size / 40})`,
      }}
      onClick={() => {
        if (hit) return;

        setHit(true);
        onHit();
      }}
    >
      <div className="part head">
        <Cube
          width={40}
          depth={(20 * size) / 40}
          height={15}
          colors={colors.head}
        />
      </div>
      <div className="part eye eye--left">
        <Cube width={7} depth={3} height={5} colors={colors.eye} />
      </div>
      <div className="part eye eye--right">
        <Cube width={7} depth={3} height={5} colors={colors.eye} />
      </div>
      <div className="part torso">
        <Cube
          width={40}
          depth={(20 * size) / 40}
          height={22}
          colors={colors.torso}
        />
      </div>
    </div>
  );
}

const DEFAULT_COLORS = {
  head: {
    top: "#de5865",
    bottom: "#9e3e48",
    left: "#c54e5a",
    right: "#c54e5a",
    front: "#ff6978",
    back: "#ff6978",
  },
  torso: {
    top: "#9e3e48",
    bottom: "#9e3e48",
    left: "#c54e5a",
    right: "#c54e5a",
    front: "#ff6978",
    back: "#ff6978",
  },
  eye: {
    top: "white",
    bottom: "#9e3e48",
    left: "lightgray",
    right: "lightgray",
    front: "white",
    back: "white",
  },
};

const ON_HIT_COLORS = {
  ...DEFAULT_COLORS,
  head: {
    top: "#6bbeff",
    bottom: "#3b688a",
    back: "#4caefb",
    front: "#4caefb",
    left: "#3e92d4",
    right: "#3e92d4",
  },
  torso: {
    top: "#3b688a",
    bottom: "#3b688a",
    back: "#4caefb",
    front: "#4caefb",
    left: "#3e92d4",
    right: "#3e92d4",
  },
};
