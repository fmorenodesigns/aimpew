import GameOptions, { DEFAULT_GAME_OPTIONS } from "./components/GameOptions";
import { GameOptionsButton, RestartButton } from "./components/KeyButton";
import Gun, { GunRotation, STARTING_GUN_ROTATION } from "./components/Gun";
import { PauseDatetime, getPauseDuration } from "./utils/utils";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Countdown from "./components/Countdown";
import GameOver from "./components/GameOver";
import Logo from "./components/Logo";
import PointsBoard from "./components/PointsBoard";
import { TargetMetadata } from "./components/Target";
import TargetsContainer from "./components/TargetsContainer";
import { useLocalStorage } from "./utils/hooks";

export default function PlayableGame() {
  const onFireSoundEffect = useMemo(() => new Audio("./laserbeam.mp3"), []);
  const onHitSoundEffect = useMemo(() => {
    const audio = new Audio("./hit.mp3");
    audio.volume = 0.5;
    return audio;
  }, []);
  const playableArea = useRef<HTMLDivElement>(null);
  const playableAreaWidth = playableArea.current
    ? playableArea.current.getBoundingClientRect().width
    : 0;
  const playableAreaHeight = playableArea.current
    ? playableArea.current.getBoundingClientRect().height
    : 0;

  const [started, setStarted] = useState<boolean>(false);
  const [ended, setEnded] = useState<boolean>(false);
  const [targets, setTargets] = useState<TargetMetadata[]>([]);

  const [points, setPoints] = useState<number>(0);
  const [firedTimes, setFiredTimes] = useState<number>(0);
  const [maxPoints, setMaxPoints] = useState<number>(0);
  const [totalReactionTime, setTotalReactionTime] = useState<number>(0);

  const [coiling, setCoiling] = useState<boolean>(false);
  const [rotation, setRotation] = useState<GunRotation>(STARTING_GUN_ROTATION);

  const [showOptions, setShowOptions] = useState<boolean>(false);
  // When the user goes to the options menu during a round, that is considered pause time
  const [pauseDatetime, setPauseDatetime] = useState<PauseDatetime>({
    start: null,
    end: null,
  });

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
      if (showOptions || !started || ended) return;

      const x = e.clientX - playableAreaWidth / 2;
      const y = -(e.clientY - playableAreaHeight / 2);

      setRotation({
        horizontal: -45 * (x / (playableAreaWidth / 2)),
        vertical: -45 * (y / (playableAreaHeight / 2)),
      });
    },
    [showOptions, started, ended, playableAreaWidth, playableAreaHeight]
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
      }, 200);
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
                .map((target) => {
                  const pauseDuration = getPauseDuration(
                    pauseDatetime,
                    target.lifeStart
                  );

                  return (
                    now.valueOf() - pauseDuration - target.lifeStart.valueOf()
                  );
                })
                .reduce((a, b) => a + b, 0)
            );
          });
        }

        return [
          ...newTargets,
          {
            index: maxPoints,
            size,
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
    pauseDatetime,
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

      setTotalReactionTime((curReactionTime) => {
        const pauseDuration = getPauseDuration(
          pauseDatetime,
          targets[0].lifeStart
        );

        return (
          curReactionTime +
          (now.valueOf() - pauseDuration - targets[0].lifeStart.valueOf())
        );
      });

      setTargets((cur) => {
        const temp = [...cur].slice(1);
        return temp;
      });
    }, gameOptions.targetInterval);

    return () => clearTimeout(timeout);
  }, [
    ended,
    gameOptions.targetInterval,
    pauseDatetime,
    reachedTargetCountLimit,
    started,
    targets,
  ]);

  const updateGameOptionsVisibility = useCallback(() => {
    setShowOptions((cur) => {
      if (cur === false) {
        setPauseDatetime((curPausetime) => ({
          ...curPausetime,
          start: new Date(),
        }));
      } else {
        setPauseDatetime((curPausetime) => ({
          ...curPausetime,
          end: new Date(),
        }));
      }

      return !cur;
    });
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
      } else if (e.key === "Escape") {
        if (ended) {
          restartGame();
          return;
        }

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
      pointsBoardProps={{ points, firedTimes, maxPoints, totalReactionTime }}
      gameOptionsProps={{
        gameOptions,
        setGameOptions,
      }}
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
        <TargetsContainer
          targets={targets}
          onTargetHit={onTargetHit}
          pauseDatetime={pauseDatetime}
          gameOptions={gameOptions}
        />
      </div>

      <Logo className="mini-logo" colors={{ aim: "#fcfcfc", pew: "#fcfcfc" }} />
    </>
  );
}

const START_COUNTDOWN = 3000;
