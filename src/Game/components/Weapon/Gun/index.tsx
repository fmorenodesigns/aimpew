import "./styles.scss";

import { WeaponProps } from "..";
import Cube from "../../Cube";

export default function Gun({
  rotation,
  coiling,
  hasFlash,
  className,
}: WeaponProps) {
  const rotateX = rotation.vertical - (coiling ? 5 : 0);
  const rotateY = rotation.horizontal - (coiling ? 5 : 0);

  return (
    <div
      className={`gun ${className}`}
      style={{
        top: -MAIN.height - HANDLE.height / 2,
        left: -MAIN.width,
        width: MAIN.width,
        height: MAIN.height,
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: coiling ? "transform 0.05s linear" : undefined,
      }}
    >
      {hasFlash && (
        <div className="blast" style={{ opacity: coiling ? "1" : "0" }} />
      )}
      <div className="part blue-detail">
        <Cube
          width={DETAIL.width}
          depth={DETAIL.depth}
          height={DETAIL.height}
          colors={DETAIL.colors}
        />
      </div>

      <div className="part aim">
        <Cube width={2} depth={30} height={8} colors="#abb9d6" />
      </div>

      <div className="part main">
        <Cube
          width={MAIN.width}
          depth={MAIN.depth}
          height={MAIN.height}
          colors={MAIN.colors}
        />
      </div>
      <div className="part main--detail">
        <Cube
          width={15}
          depth={145}
          height={MAIN.height}
          colors={MAIN.colors}
        />
      </div>

      <div className="part trigger">
        <Cube
          width={10}
          depth={coiling ? 25 : 40}
          height={22}
          colors="#272f35"
        />
      </div>

      <div className="part handle">
        <Cube
          width={HANDLE.width}
          depth={HANDLE.depth}
          height={HANDLE.height}
          colors={{
            top: "#2f343c",
            bottom: "#272f35",
            left: "#2f343c",
            right: "#2f343c",
            front: "#272f35",
            back: "#272f35",
          }}
        />
      </div>
    </div>
  );
}

const MAIN = {
  width: 32,
  depth: 140,
  height: 40,
  colors: {
    top: "#eaf3fd",
    right: "#bfd1e6",
    bottom: "#808d9c",
    left: "#bfd1e6",
    front: "#99a9bd",
    back: "#99a9bd",
  },
};

const HANDLE = {
  width: 27,
  depth: 40,
  height: 60,
};

const DETAIL = {
  width: MAIN.width + 3 * 2,
  depth: MAIN.depth - 40,
  height: 18,
  colors: {
    top: "#4677f5",
    right: "#4876ea",
    bottom: "#3056b1",
    left: "#4876ea",
    front: "#3056b1",
    back: "#3056b1",
  },
};
