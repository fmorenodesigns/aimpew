import { GameSettingsButton, RestartButton } from "./components/KeyButton";
import { PauseDatetime, numIsBetween } from "./utils/utils";
import Weapon, {
  INITIAL_WEAPON_ROTATION,
  WeaponRotation,
} from "./components/Weapon";
import { useAudio, usePlayableArea } from "./utils/hooks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Countdown from "./components/Countdown";
import GameOver from "./components/GameOver";
import GameSettings from "./components/GameSettings";
import { GameSettingsContext } from "./components/GameSettings/context";
import Logo from "./components/Logo";
import PointsBoard from "./components/PointsBoard";
import { TargetMetadata } from "./components/Target";
import TargetsContainer from "./components/TargetsContainer";
import { useContext } from "react";

export default function PlayableGame() {
  const playableArea = useRef<HTMLDivElement>(null);
  const { gameSettings } = useContext(GameSettingsContext);
  const { playableAreaWidth, playableAreaHeight } =
    usePlayableArea(playableArea);
  const { onFireSoundFx, onHitSoundFx } = useAudio();

  const [started, setStarted] = useState<boolean>(false);
  const [ended, setEnded] = useState<boolean>(false);
  const [targets, setTargets] = useState<TargetMetadata[]>([]);

  const [points, setPoints] = useState<number>(0);
  const [firedTimes, setFiredTimes] = useState<number>(0);
  const [maxPoints, setMaxPoints] = useState<number>(0);
  const [totalTimeBeforeHit, setTotalTimeBeforeHit] = useState<number>(0);

  const [coiling, setCoiling] = useState<boolean>(false);
  const [weaponIsSeeThrough, setWeaponIsSeeThrough] = useState<boolean>(false);
  const [rotation, setRotation] = useState<WeaponRotation>(
    INITIAL_WEAPON_ROTATION
  );

  const [showSettings, setShowSettings] = useState<boolean>(false);
  // When the user goes to the settings menu during a round, that is considered pause time
  const [pauseDatetime, setPauseDatetime] = useState<PauseDatetime>({
    start: null,
    end: null,
  });

  const reachedTargetCountLimit = useMemo(
    () => gameSettings.targetGoal && maxPoints >= gameSettings.targetGoal,
    [gameSettings.targetGoal, maxPoints]
  );

  // Rotate gun
  const handleMovement = useCallback(
    (e) => {
      if (showSettings || !started || ended) return;

      const x = e.clientX - playableAreaWidth / 2;
      const y = -(e.clientY - playableAreaHeight / 2);

      setRotation({
        horizontal: -45 * (x / (playableAreaWidth / 2)),
        vertical: -45 * (y / (playableAreaHeight / 2)),
      });
    },
    [showSettings, started, ended, playableAreaWidth, playableAreaHeight]
  );

  const onTargetHit = useCallback(
    (targetIndex, lifeTime) => {
      if (gameSettings.onHitSoundFx) {
        onHitSoundFx.currentTime = 0;
        onHitSoundFx.play();
      }

      setTotalTimeBeforeHit((cur) => cur + lifeTime);
      setPoints((cur) => cur + 1);

      setTimeout(() => {
        setTargets((cur) => cur.filter(({ index }) => index !== targetIndex));
      }, 200);
    },
    [gameSettings.onHitSoundFx, onHitSoundFx]
  );

  const fireGun = useCallback(
    (e) => {
      if (gameSettings.onFireSoundFx) {
        onFireSoundFx.currentTime = 0;
        onFireSoundFx.play();
      }

      setCoiling(true);
      setTimeout(() => setCoiling(false), 100);
      setFiredTimes((cur) => cur + 1);
    },
    [onFireSoundFx, gameSettings.onFireSoundFx]
  );

  // Generate new targets
  useEffect(() => {
    if (!started || ended) return;

    if (!playableAreaHeight || !playableAreaWidth || showSettings) return;

    const timeout = setTimeout(() => {
      if (showSettings || ended) {
        clearTimeout(timeout);
        return;
      }

      setTargets((cur) => {
        const sizeVariation =
          Math.round((Math.random() * gameSettings.targetSizeVariation) / 2) *
          2;
        const size = gameSettings.targetSize + sizeVariation;

        if (reachedTargetCountLimit) {
          return cur;
        }

        const newTargets = cur.filter(
          ({ index }) =>
            index > maxPoints - gameSettings.simultaneousTargetCount
        );

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
    }, gameSettings.targetInterval);

    return () => clearTimeout(timeout);
  }, [
    ended,
    gameSettings,
    maxPoints,
    pauseDatetime,
    playableAreaHeight,
    playableAreaWidth,
    reachedTargetCountLimit,
    showSettings,
    started,
  ]);

  // Start removing targets after the targetGoal has been reached
  useEffect(() => {
    if (!started || ended) return;

    if (
      targets.filter(
        (target) =>
          numIsBetween(target.left, 0.495, 0.515) &&
          numIsBetween(target.top, 0.495, 0.515)
      ).length > 0
    ) {
      setWeaponIsSeeThrough(true);
    } else {
      setWeaponIsSeeThrough(false);
    }

    if (!reachedTargetCountLimit) return;

    const timeout = setTimeout(() => {
      setTargets((cur) => {
        const temp = [...cur].slice(1);
        return temp;
      });
    }, gameSettings.targetInterval);

    return () => clearTimeout(timeout);
  }, [
    ended,
    gameSettings.targetInterval,
    pauseDatetime,
    reachedTargetCountLimit,
    started,
    targets,
  ]);

  const updateGameSettingsVisibility = useCallback(() => {
    setShowSettings((cur) => {
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
    setRotation(INITIAL_WEAPON_ROTATION);
    setShowSettings(false);
    setEnded(false);
    setStarted(false);
    setTargets([]);
    setPoints(0);
    setFiredTimes(0);
    setMaxPoints(0);
    setTotalTimeBeforeHit(0);
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

        updateGameSettingsVisibility();
      }
    },
    [restartGame, updateGameSettingsVisibility, ended]
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
      pointsBoardProps={{ points, firedTimes, maxPoints, totalTimeBeforeHit }}
      restartGame={restartGame}
    />
  ) : (
    <>
      {!started && !showSettings && (
        <Countdown startValue={START_COUNTDOWN} setStarted={setStarted} />
      )}
      <GameSettings showSettings={showSettings} />

      <GameSettingsButton
        description={!showSettings ? "Settings" : "Save"}
        onClick={updateGameSettingsVisibility}
      />
      <PointsBoard
        points={points}
        firedTimes={firedTimes}
        maxPoints={maxPoints}
      />
      <RestartButton onClick={restartGame} />

      {coiling && gameSettings.visualFx && <div className="flashlight" />}
      <div
        ref={playableArea}
        className={`playable-area ${showSettings ? "blur" : ""}`}
        onMouseMoveCapture={handleMovement}
        onClick={fireGun}
      >
        <TargetsContainer
          targets={targets}
          onTargetHit={onTargetHit}
          pauseDatetime={pauseDatetime}
        />
        <Weapon
          rotation={rotation}
          coiling={coiling}
          hasFlash={gameSettings.visualFx}
          className={`${weaponIsSeeThrough ? "see-through" : ""}`}
        />
      </div>

      <Logo className="mini-logo" colors={{ aim: "#fcfcfc", pew: "#fcfcfc" }} />
    </>
  );
}

const START_COUNTDOWN = 3000;
