import "./styles.scss";

import GameOptions, { DEFAULT_GAME_OPTIONS } from "./components/GameOptions";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Countdown from "./components/Countdown";
import { GameOptionsButton } from "./components/KeyButton";
import GameOver from "./components/GameOver";
import Gun from "./components/Gun";
import Logo from "./components/Logo";
import PointsBoard from "./components/PointsBoard";
import { RestartButton } from "./components/KeyButton";
import Target from "./components/Target";
import { isMobile } from "./utils";
import { useLocalStorage } from "./hooks";

const START_COUNTDOWN = 3000;
const STARTING_GUN_ROTATION = { horizontal: 10, vertical: -5 };

export default function Game() {
  return isMobile() ? (
    <div className="game is-mobile">
      <div className="error">
        <Logo className="default-logo" />
        <p>
          This application has been developed to help people practice their
          mouse aim, and is currently not compatible with mobile devices.
        </p>
      </div>
    </div>
  ) : (
    <div className="game">
      <PlayableGame />
    </div>
  );
}

function PlayableGame() {
  const onFireSoundEffect = useMemo(() => new Audio("./laserbeam.mp3"), []);
  const onHitSoundEffect = useMemo(() => new Audio("./hit.mp3"), []);
  const playableArea = useRef();
  const playableAreaWidth = playableArea.current?.getBoundingClientRect().width;
  const playableAreaHeight =
    playableArea.current?.getBoundingClientRect().height;

  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [targets, setTargets] = useState([]);

  const [points, setPoints] = useState(0);
  const [firedTimes, setFiredTimes] = useState(0);
  const [maxPoints, setMaxPoints] = useState(0);
  const [totalReactionTime, setTotalReactionTime] = useState(0);

  const [coiling, setCoiling] = useState(false);
  const [rotation, setRotation] = useState(STARTING_GUN_ROTATION);

  const [showOptions, setShowOptions] = useState(false);
  const [gameOptions, setGameOptions] = useLocalStorage(
    "game-options",
    DEFAULT_GAME_OPTIONS
  );
  const reachedTargetCountLimit = useMemo(
    () => gameOptions.targetGoal && maxPoints >= gameOptions.targetGoal,
    [gameOptions.targetGoal, maxPoints]
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

  const onTargetHit = useCallback(
    (targetIndex, lifeTime) => {
      if (gameOptions.onHitSoundEffect) {
        onHitSoundEffect.currentTime = 0;
        onHitSoundEffect.play();
      }

      setTotalReactionTime((cur) => cur + lifeTime);
      setPoints((cur) => cur + 1);

      setTimeout(() => {
        setTargets((cur) => cur.filter(({ index }) => index !== targetIndex));
      }, [200]);
    },
    [gameOptions.onHitSoundEffect, onHitSoundEffect]
  );

  const fireGun = useCallback(
    (e) => {
      if (gameOptions.onFireSoundEffect) {
        onFireSoundEffect.currentTime = 0;
        onFireSoundEffect.play();
      }

      setCoiling(true);
      setTimeout(() => setCoiling(false), 100);
      setFiredTimes((cur) => cur + 1);
    },
    [onFireSoundEffect, gameOptions.onFireSoundEffect]
  );

  // Generate new targets
  useEffect(() => {
    if (!started || ended) return;

    if (!playableAreaHeight || !playableAreaWidth || showOptions) return;

    const timeout = setTimeout(() => {
      if (showOptions || ended) {
        clearTimeout(timeout);
        return;
      }

      setTargets((cur) => {
        const sizeVariation =
          Math.round((Math.random() * gameOptions.targetSizeVariation) / 2) * 2;
        const size = gameOptions.targetSize + sizeVariation;

        if (reachedTargetCountLimit) {
          return cur;
        }

        const targetsToRemove = cur.filter(
          ({ index }) =>
            index <= maxPoints - gameOptions.simultaneousTargetCount
        );
        const newTargets = cur.filter(
          ({ index }) => index > maxPoints - gameOptions.simultaneousTargetCount
        );

        if (targetsToRemove.length > 0) {
          setTotalReactionTime((curReactionTime) => {
            const now = new Date();
            return (
              curReactionTime +
              targetsToRemove
                .map((target) => now - target.lifeStart)
                .reduce((a, b) => a + b, 0)
            );
          });
        }

        return [
          ...newTargets,
          {
            size,
            index: maxPoints,
            left:
              Math.max(Math.random() * playableAreaWidth - size, size / 2) /
              playableAreaWidth,
            top:
              Math.max(Math.random() * playableAreaHeight - size, size / 2) /
              playableAreaHeight,
            lifeStart: new Date(),
          },
        ];
      });

      if (!reachedTargetCountLimit) {
        setMaxPoints((curIdx) => curIdx + 1);
      }
    }, gameOptions.targetInterval);

    return () => clearTimeout(timeout);
  }, [
    ended,
    gameOptions,
    maxPoints,
    playableAreaHeight,
    playableAreaWidth,
    reachedTargetCountLimit,
    showOptions,
    started,
  ]);

  // Start removing targets after the targetGoal has been reached
  useEffect(() => {
    if (!started || ended) return;

    if (!reachedTargetCountLimit) return;

    const timeout = setTimeout(() => {
      const now = new Date();
      setTotalReactionTime(
        (curReactionTime) => curReactionTime + (now - targets[0].lifeStart)
      );

      setTargets((cur) => {
        const temp = [...cur].slice(1);
        return temp;
      });
    }, [gameOptions.targetInterval]);

    return () => clearTimeout(timeout);
  }, [
    ended,
    gameOptions.targetInterval,
    reachedTargetCountLimit,
    started,
    targets,
  ]);

  const updateGameOptionsVisibility = useCallback(() => {
    setShowOptions((cur) => !cur);
  }, []);

  const restartGame = useCallback(() => {
    setRotation(STARTING_GUN_ROTATION);
    setShowOptions(false);
    setEnded(false);
    setStarted(false);
    setTargets([]);
    setPoints(0);
    setFiredTimes(0);
    setMaxPoints(0);
    setTotalReactionTime(0);
  }, []);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === " ") {
        restartGame();
      } else if (e.key === "Escape" && !ended) {
        updateGameOptionsVisibility();
      }
    },
    [restartGame, updateGameOptionsVisibility, ended]
  );

  // Detect keystrokes
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress, false);
    return () => document.removeEventListener("keydown", handleKeyPress, false);
  }, [handleKeyPress]);

  // End the game upon reaching the target goal
  useEffect(() => {
    if (reachedTargetCountLimit && targets.length === 0) {
      setEnded(true);
      setStarted(false);
      return;
    }
  }, [reachedTargetCountLimit, targets.length]);

  return ended ? (
    <GameOver
      pointsBoard={
        <PointsBoard
          points={points}
          firedTimes={firedTimes}
          maxPoints={maxPoints}
          totalReactionTime={totalReactionTime}
        />
      }
      gameOptions={
        <GameOptions
          gameOptions={gameOptions}
          setGameOptions={setGameOptions}
          updateGameOptionsVisibility={updateGameOptionsVisibility}
          showOptions={true}
          overlay={false}
        />
      }
      restartGame={restartGame}
    />
  ) : (
    <>
      {!started && !showOptions && (
        <Countdown startValue={START_COUNTDOWN} setStarted={setStarted} />
      )}
      <GameOptions
        gameOptions={gameOptions}
        setGameOptions={setGameOptions}
        updateGameOptionsVisibility={updateGameOptionsVisibility}
        showOptions={showOptions}
      />
      <GameOptionsButton
        description={!showOptions ? "Options" : "Save"}
        onClick={updateGameOptionsVisibility}
      />
      <PointsBoard
        points={points}
        firedTimes={firedTimes}
        maxPoints={maxPoints}
      />
      <RestartButton onClick={restartGame} />

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
              left={`${target.left * 100}%`}
              top={`${target.top * 100}%`}
              onHit={() => {
                const now = new Date();
                const lifeTime = now - target.lifeStart;

                onTargetHit(target.index, lifeTime);
              }}
            />
          ))}
        </div>
      </div>

      <Logo className="mini-logo" colors={{ aim: "#fcfcfc", pew: "#fcfcfc" }} />
    </>
  );
}
