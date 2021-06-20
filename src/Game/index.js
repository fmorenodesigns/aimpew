import "./styles.scss";

import GameOptions, { DEFAULT_GAME_OPTIONS } from "./components/GameOptions";
import { GameOptionsButton, RestartButton } from "./components/KeyButton";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Countdown from "./components/Countdown";
import Gun from "./components/Gun";
import Logo from "./components/Logo";
import PointsBoard from "./components/PointsBoard";
import Target from "./components/Target";
import { useLocalStorage } from "./hooks";

const START_COUNTDOWN = 3000;
const STARTING_GUN_ROTATION = { horizontal: 10, vertical: -5 };

export default function Game() {
  const audio = useMemo(() => new Audio("./laserbeam.mp3"), []);
  const playableArea = useRef();
  const playableAreaWidth = playableArea.current?.getBoundingClientRect().width;
  const playableAreaHeight =
    playableArea.current?.getBoundingClientRect().height;

  const [started, setStarted] = useState(false);
  const [targets, setTargets] = useState([]);

  const [points, setPoints] = useState(0);
  const [firedTimes, setFiredTimes] = useState(0);
  const [maxPoints, setMaxPoints] = useState(0);

  const [coiling, setCoiling] = useState(false);
  const [rotation, setRotation] = useState(STARTING_GUN_ROTATION);

  const [showOptions, setShowOptions] = useState(false);
  const [gameOptions, setGameOptions] = useLocalStorage(
    "game-options",
    DEFAULT_GAME_OPTIONS
  );

  // Rotate gun
  const handleMovement = useCallback(
    (e) => {
      const x = e.clientX - playableAreaWidth / 2;
      const y = -(e.clientY - playableAreaHeight / 2);

      setRotation({
        horizontal: -45 * (x / (playableAreaWidth / 2)),
        vertical: -45 * (y / (playableAreaHeight / 2)),
      });
    },
    [playableAreaWidth, playableAreaHeight]
  );

  const onTargetHit = useCallback((targetIndex) => {
    setPoints((cur) => cur + 1);
    setTimeout(() => {
      setTargets((cur) => cur.filter(({ index }) => index !== targetIndex));
    }, [200]);
  }, []);

  const fireGun = useCallback(
    (e) => {
      if (gameOptions.soundEffects) {
        audio.currentTime = 0;
        audio.play();
      }
      setCoiling(true);
      setTimeout(() => setCoiling(false), 100);
      setFiredTimes((cur) => cur + 1);
    },
    [audio, gameOptions.soundEffects]
  );

  // Generate new targets
  useEffect(() => {
    if (!started) return;

    if (!playableAreaHeight || !playableAreaWidth || showOptions) return;

    const timeout = setTimeout(() => {
      setTargets((cur) => {
        if (showOptions) {
          clearTimeout(timeout);
          return;
        }

        const sizeVariation =
          Math.round((Math.random() * gameOptions.targetSizeVariation) / 2) * 2;
        const size = gameOptions.targetSize + sizeVariation;

        return [
          ...cur.filter(
            ({ index }) =>
              index > maxPoints - gameOptions.simultaneousTargetCount
          ),
          {
            size,
            index: maxPoints,
            left: Math.max(Math.random() * playableAreaWidth - size, size / 2),
            top: Math.max(Math.random() * playableAreaHeight - size, size / 2),
          },
        ];
      });
      setMaxPoints((curIdx) => curIdx + 1);
    }, gameOptions.targetInterval);

    return () => clearTimeout(timeout);
  }, [
    playableAreaHeight,
    playableAreaWidth,
    gameOptions,
    maxPoints,
    showOptions,
    started,
  ]);

  const updateGameOptionsVisibility = useCallback(() => {
    setShowOptions((cur) => !cur);
  }, []);

  const restartGame = useCallback(() => {
    setRotation(STARTING_GUN_ROTATION);
    setStarted(false);
    setTargets([]);
    setPoints(0);
    setFiredTimes(0);
    setMaxPoints(0);
  }, []);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === " ") {
        if (!started) return;
        restartGame();
      } else if (e.key === "Escape") {
        updateGameOptionsVisibility();
      }
    },
    [started, restartGame, updateGameOptionsVisibility]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress, false);
    return () => document.removeEventListener("keydown", handleKeyPress, false);
  }, [handleKeyPress]);

  return (
    <div className="game">
      {!started && !showOptions && (
        <Countdown startValue={START_COUNTDOWN} setStarted={setStarted} />
      )}
      <GameOptions
        gameOptions={gameOptions}
        setGameOptions={setGameOptions}
        updateGameOptionsVisibility={updateGameOptionsVisibility}
        showOptions={showOptions}
      />
      {!showOptions && (
        <GameOptionsButton
          description="Options"
          onClick={updateGameOptionsVisibility}
        />
      )}
      <PointsBoard
        points={points}
        firedTimes={firedTimes}
        maxPoints={maxPoints}
      />

      {started && <RestartButton onClick={restartGame} />}

      <Logo className="mini-logo" colors={{ aim: "#fcfcfc", pew: "#fcfcfc" }} />

      {coiling && gameOptions.visualEffects && <div className="flashlight" />}
      <div
        ref={playableArea}
        className={`playable-area ${showOptions ? "blur" : ""}`}
        onMouseMoveCapture={handleMovement}
        onClick={fireGun}
      >
        <Gun
          rotation={rotation}
          coiling={coiling}
          hasFlash={gameOptions.visualEffects}
        />
        <div className="target-container">
          {targets.map((target) => (
            <Target
              key={target.index}
              size={target.size}
              left={target.left}
              top={target.top}
              onHit={() => {
                onTargetHit(target.index);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
