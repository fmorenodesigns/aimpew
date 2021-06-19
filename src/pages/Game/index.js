import "./styles.scss";

import GameOptions, { DEFAULT_GAME_OPTIONS } from "./components/GameOptions";
import React, { useCallback, useEffect, useRef, useState } from "react";

import Gun from "./components/Gun";
import PointsBoard from "./components/PointsBoard";
import Target from "./components/Target";
import { useLocalStorage } from "./hooks";

export default function Game() {
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
  const [gameOptions, setGameOptions] = useLocalStorage(
    "game-options",
    DEFAULT_GAME_OPTIONS
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
              index > maxPoints - gameOptions.simultaneousTargetCount
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
    }, gameOptions.targetInterval);

    return () => clearTimeout(timeout);
  }, [
    targets,
    containerHeight,
    containerWidth,
    maxPoints,
    showOptions,
    gameOptions,
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
      {showOptions && (
        <GameOptions
          gameOptions={gameOptions}
          setGameOptions={setGameOptions}
        />
      )}
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
