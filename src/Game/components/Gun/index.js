import "./styles.scss";

import Cube from "./Cube";
import React from "react";

export default function Gun({ rotation, coiling, hasFlash }) {
  const main = {
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

  const handle = {
    width: 27,
    depth: 40,
    height: 60,
  };

  const detail = {
    width: main.width + 3 * 2,
    depth: main.depth - 40,
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

  const rotateX = rotation.vertical - (coiling ? 5 : 0);
  const rotateY = rotation.horizontal - (coiling ? 5 : 0);

  return (
    <div
      className="gun"
      style={{
        top: -main.height - handle.height / 2,
        left: -main.width,
        width: main.width,
        height: main.height,
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: coiling ? "transform 0.05s linear" : undefined,
      }}
    >
      {hasFlash && (
        <div className="blast" style={{ opacity: coiling ? "1" : "0" }} />
      )}
      <div className="part blue-detail">
        <Cube
          width={detail.width}
          depth={detail.depth}
          height={detail.height}
          colors={detail.colors}
        />
      </div>

      <div className="part aim">
        <Cube width={2} depth={30} height={8} colors="#abb9d6" />
      </div>

      <div className="part main">
        <Cube
          width={main.width}
          depth={main.depth}
          height={main.height}
          colors={main.colors}
        />
      </div>
      <div className="part main--detail">
        <Cube
          width={15}
          depth={145}
          height={main.height}
          colors={main.colors}
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
          width={handle.width}
          depth={handle.depth}
          height={handle.height}
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
