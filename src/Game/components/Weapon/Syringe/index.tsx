import "./styles.scss";

import Cube from "../../Cube";
import { WeaponProps } from "..";

export default function Syringe({ rotation, coiling, hasFlash }: WeaponProps) {
  const rotateX = rotation.vertical - (coiling ? 5 : 0);
  const rotateY = rotation.horizontal - (coiling ? 5 : 0);

  return (
    <div
      className="syringe"
      style={{
        top: -MAIN.height,
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

      <div className="part main">
        <Cube
          width={MAIN.width}
          depth={MAIN.depth}
          height={MAIN.height}
          colors={MAIN.colors}
        />
      </div>

      <div className="part needle">
        <Cube width={2} depth={80} height={2} colors={MAIN.colors} />
      </div>
      <div className="part liquid">
        <Cube
          width={LIQUID.width}
          depth={coiling ? 0 : LIQUID.depth}
          height={LIQUID.height}
          colors={coiling ? {} : LIQUID.colors}
        />
      </div>

      <div className={`pump-container ${coiling ? "coiling" : ""}`}>
        <div className="part pump pump--liquid-pusher">
          <Cube
            width={MAIN.width - 4}
            depth={3}
            height={MAIN.height - 4}
            colors={PUMP.colors}
          />
        </div>
        <div className="part pump pump--long">
          <Cube
            width={10}
            depth={MAIN.depth}
            height={10}
            colors={PUMP.colors}
          />
        </div>
        <div className="part pump pump--finger-lay">
          <Cube
            width={MAIN.width + 6}
            depth={3}
            height={MAIN.height + 6}
            colors={PUMP.colors}
          />
        </div>
      </div>
    </div>
  );
}

const PUMP = {
  colors: {
    top: "#eaf3fd",
    right: "#bfd1e6",
    bottom: "#808d9c",
    left: "#bfd1e6",
    front: "#99a9bd",
  },
};

const MAIN = {
  width: 32,
  depth: 100,
  height: 40,
  colors: {
    top: "#eaf3fd40",
    right: "#bfd1e650",
    bottom: "#808d9c50",
    left: "#bfd1e650",
    back: "#99a9bd50",
  },
};

const LIQUID = {
  width: 28,
  depth: 60,
  height: 36,
  colors: {
    top: "#4ec57b",
    right: "#40a566",
    bottom: "#40a566",
    left: "#40a566",
    front: "#41bf70",
  },
};

export const STARTING_GUN_ROTATION = { horizontal: 10, vertical: -5 };
