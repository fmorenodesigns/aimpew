import "./styles.scss";

import GameOptions, { DEFAULT_GAME_OPTIONS } from "./components/GameOptions";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import GameOptionsButton from "./components/GameOptions/GameOptionsButton";
import Gun from "./components/Gun";
import PointsBoard from "./components/PointsBoard";
import Target from "./components/Target";
import { useLocalStorage } from "./hooks";

export default function Game() {
  const audio = useMemo(() => new Audio("/laserbeam.mp3"), []);
  const playableArea = useRef();
  const playableAreaWidth = playableArea.current?.getBoundingClientRect().width;
  const playableAreaHeight =
    playableArea.current?.getBoundingClientRect().height;

  const [targets, setTargets] = useState([]);

  const [points, setPoints] = useState(0);
  const [firedTimes, setFiredTimes] = useState(0);
  const [maxPoints, setMaxPoints] = useState(0);

  const [coiling, setCoiling] = useState(false);
  const [rotation, setRotation] = useState({ horizontal: 0, vertical: 0 });

  const [showOptions, setShowOptions] = useState(false);
  const [gameOptions, setGameOptions] = useLocalStorage(
    "game-options",
    DEFAULT_GAME_OPTIONS
  );

  const handleMovement = useCallback(
    (e) => {
      setRotation({
        horizontal:
          -45 * ((e.clientX - playableAreaWidth / 2) / (playableAreaWidth / 2)),
        vertical:
          45 *
          ((e.clientY - playableAreaHeight / 2) / (playableAreaHeight / 2)),
      });
    },
    [playableAreaWidth, playableAreaHeight]
  );

  const onHit = useCallback((targetIndex) => {
    setPoints((cur) => cur + 1);
    setTargets((cur) => cur.filter(({ index }) => index !== targetIndex));
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
    if (!playableAreaHeight || !playableAreaWidth || showOptions) return;

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
            left: Math.max(Math.random() * playableAreaWidth - size, 0),
            top: Math.max(Math.random() * playableAreaHeight - size, 0),
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
  ]);

  const updateGameOptionsVisibility = useCallback((e, click) => {
    if (click || e.key === "Escape") setShowOptions((cur) => !cur);
  }, []);

  // Show game options on Esc press
  useEffect(() => {
    document.addEventListener("keydown", updateGameOptionsVisibility, false);

    return () => {
      document.removeEventListener(
        "keydown",
        updateGameOptionsVisibility,
        false
      );
    };
  }, [updateGameOptionsVisibility]);

  return (
    <div className="game">
      {showOptions ? (
        <GameOptions
          gameOptions={gameOptions}
          setGameOptions={setGameOptions}
          updateGameOptionsVisibility={updateGameOptionsVisibility}
        />
      ) : (
        <GameOptionsButton
          description="Game options"
          onClick={() => updateGameOptionsVisibility(undefined, true)}
        />
      )}
      <PointsBoard
        points={points}
        firedTimes={firedTimes}
        maxPoints={maxPoints}
      />

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
