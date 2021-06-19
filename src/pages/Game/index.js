import "./styles.scss";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Cube from "../Cube";
import useLocalStorage from "react-use-localstorage";

export function Game() {
  const container = useRef();
  const containerWidth = container.current?.getBoundingClientRect().width;
  const containerHeight = container.current?.getBoundingClientRect().height;

  const [targets, setTargets] = useState([]);

  const [points, setPoints] = useState(0);
  const [firedTimes, setFiredTimes] = useState(0);
  const [maxPoints, setMaxPoints] = useState(0);

  const [coiling, setCoiling] = useState(false);
  const [rotation, setRotation] = useState({ horizontal: 0, vertical: 0 });

  const [showOptions, setShowOptions] = useState(true);
  const gameOptions = useLocalStorage("game-options")[0];
  const parsedGameOptions = useMemo(
    () => JSON.parse(gameOptions),
    [gameOptions]
  );

  const handleMovement = useCallback(
    (e) => {
      setRotation({
        horizontal:
          -45 * ((e.clientX - containerWidth / 2) / (containerWidth / 2)),
        vertical:
          45 * ((e.clientY - containerHeight / 2) / (containerHeight / 2)),
      });
    },
    [containerWidth, containerHeight]
  );

  const onHit = useCallback((targetIndex) => {
    setPoints((cur) => cur + 1);
    setTargets((cur) => cur.filter(({ index }) => index !== targetIndex));
  }, []);

  const fireGun = useCallback((e) => {
    setCoiling(true);
    setTimeout(() => setCoiling(false), 100);
    setFiredTimes((cur) => cur + 1);
  }, []);

  // Generate new targets
  useEffect(() => {
    if (!containerHeight || !containerWidth || showOptions) return;

    const timeout = setTimeout(() => {
      setTargets((cur) => {
        if (showOptions) {
          clearTimeout(timeout);
          return;
        }

        const sizeVariation = Math.round(Math.random() * 5) * 2;
        const size = 30 + sizeVariation;

        return [
          ...cur.filter(
            ({ index }) =>
              index > maxPoints - parsedGameOptions.simultaneousTargetCount
          ),
          {
            size,
            index: maxPoints,
            left: Math.max(Math.random() * containerWidth - size, 0),
            top: Math.max(Math.random() * containerHeight - size, 0),
          },
        ];
      });
      setMaxPoints((curIdx) => curIdx + 1);
    }, parsedGameOptions.targetInterval);

    return () => clearTimeout(timeout);
  }, [
    targets,
    containerHeight,
    containerWidth,
    maxPoints,
    showOptions,
    parsedGameOptions,
  ]);

  // Show game options on Esc press
  useEffect(() => {
    const handleEscPress = (e) => {
      if (e.key === "Escape") setShowOptions((cur) => !cur);
    };

    document.addEventListener("keydown", handleEscPress, false);

    return () => {
      document.removeEventListener("keydown", handleEscPress, false);
    };
  }, []);

  return (
    <div className="game">
      {showOptions && <GameOptions />}
      <PointsBoard
        points={points}
        firedTimes={firedTimes}
        maxPoints={maxPoints}
      />
      {coiling && gameOptions.flash && <div className="flashlight" />}

      <div
        ref={container}
        className={`playable-area ${showOptions ? "blur" : ""}`}
        onMouseMoveCapture={handleMovement}
        onClick={fireGun}
      >
        <Gun
          rotation={rotation}
          coiling={coiling}
          hasFlash={gameOptions.flash}
        />
        {targets.map((target) => (
          <Target
            key={target.index}
            size={target.size}
            left={target.left}
            top={target.top}
            onHit={() => {
              onHit(target.index);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function PointsBoard({ points, maxPoints, firedTimes }) {
  const hitAccuracy = points / firedTimes || 0;

  return (
    <div className="points-board">
      <div className="counter-group">
        <div className={`counter ${points / maxPoints > 0.5 ? "good" : "bad"}`}>
          {points}
        </div>
        <div className="counter-name">Targets hit</div>
      </div>
      <div className="counter-group">
        <div className="counter">{maxPoints}</div>
        <div className="counter-name">Total targets</div>
      </div>
      <div className="counter-group">
        <div className={`counter ${hitAccuracy > 0.5 ? "good" : "bad"}`}>
          {(hitAccuracy * 100).toFixed(1)}%
        </div>
        <div className="counter-name">Hit accuracy</div>
      </div>
    </div>
  );
}

export function GameOptions() {
  const [gameOptions, setGameOptions] = useLocalStorage("game-options", "{}");
  const parsedOptions = JSON.parse(gameOptions);

  const updateOption = useCallback(
    (optionName, newValue) => {
      setGameOptions(
        JSON.stringify({ ...parsedOptions, [optionName]: newValue })
      );
    },
    [parsedOptions, setGameOptions]
  );

  return (
    <div className="game-options">
      <div className="option">
        <input
          type="checkbox"
          className="checkbox"
          id="gameoption-flash"
          checked={parsedOptions.flash}
          onChange={(e) => updateOption("flash", e.target.checked)}
        />
        <label htmlFor="#gameoption-flash">Flash animation on gun fire</label>
      </div>

      <div className="option">
        <input
          type="number"
          id="gameoption-simultaneousTargetCount"
          value={parsedOptions.simultaneousTargetCount}
          onChange={(e) =>
            updateOption("simultaneousTargetCount", e.target.value)
          }
        />
        <label htmlFor="#gameoption-simultaneousTargetCount">
          Max. number of simultaneous targets
        </label>
      </div>

      <div className="option">
        <input
          type="number"
          id="gameoption-targetInterval"
          value={parsedOptions.targetInterval}
          onChange={(e) => updateOption("targetInterval", e.target.value)}
        />
        <label htmlFor="#gameoption-targetInterval">
          Interval between targets (ms)
        </label>
      </div>
    </div>
  );
}

export function Target({ size, left, top, onHit }) {
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

export function Gun({ rotation, coiling, hasFlash }) {
  const main = {
    width: 32,
    depth: 140,
    height: 40,
  };

  const detail = {
    width: 3,
    depth: main.depth - 40,
    height: 15,
    color: "#4677f5",
    outlineColor: "#284792",
  };

  const rotateX = rotation.vertical - (coiling ? 5 : 0);
  const rotateY = rotation.horizontal - (coiling ? 5 : 0);

  return (
    <div
      className="gun"
      style={{
        width: main.width,
        height: main.height,
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
    >
      {hasFlash && (
        <div className="blast" style={{ opacity: coiling ? "1" : "0" }} />
      )}
      <div className="part detail left">
        <Cube
          width={detail.width}
          depth={detail.depth}
          height={detail.height}
          colors={detail.color}
          borderColor={detail.outlineColor}
        />
      </div>
      <div className="part detail right">
        <Cube
          width={detail.width}
          depth={detail.depth}
          height={detail.height}
          colors={detail.color}
          borderColor={detail.outlineColor}
        />
      </div>
      <div className="part detail bottom">
        <Cube
          width={main.width + detail.width * 2}
          depth={detail.depth}
          height={detail.width + 2}
          colors="#3056b1"
          borderColor={detail.outlineColor}
        />
      </div>

      <div className="part aim">
        <Cube
          width={15}
          depth={30}
          height={5}
          colors="#2f343c"
          borderColor="#3c3c42"
        />
      </div>

      <div className="part main">
        <Cube
          width={main.width}
          depth={main.depth}
          height={main.height}
          colors={{
            top: "#eaf3fd",
            right: "#bfd1e6",
            bottom: "#808d9c",
            left: "#bfd1e6",
            front: "#99a9bd",
            back: "#99a9bd",
          }}
          borderColor="#a8a8ab"
        />
      </div>

      <div className="part trigger">
        <Cube
          width={10}
          depth={coiling ? 25 : 40}
          height={22}
          colors="#272f35"
          borderColor="#3c3c42"
        />
      </div>

      <div className="part handler">
        <Cube
          width={27}
          depth={40}
          height={60}
          colors={{
            top: "#2f343c",
            bottom: "#272f35",
            left: "#2f343c",
            right: "#2f343c",
            front: "#272f35",
            back: "#272f35",
          }}
          borderColor="#3c3c42"
        />
      </div>
    </div>
  );
}
