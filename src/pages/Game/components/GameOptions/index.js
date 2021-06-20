import "./styles.scss";

import React, { useCallback } from "react";

import { GameOptionsButton } from "../KeyButton";

export const DEFAULT_GAME_OPTIONS = {
  soundEffects: true,
  visualEffects: true,
  simultaneousTargetCount: 3,
  targetInterval: 1000,
  targetSize: 30,
  targetSizeVariation: 10,
};

export default function GameOptions({
  gameOptions,
  setGameOptions,
  updateGameOptionsVisibility,
  showOptions,
}) {
  const updateOption = useCallback(
    (optionName, newValue) => {
      setGameOptions({ ...gameOptions, [optionName]: newValue });
    },
    [gameOptions, setGameOptions]
  );

  return (
    <div className={`overlay game-options ${showOptions ? "visible" : ""}`}>
      <GameOptionsButton
        description="Resume"
        onClick={updateGameOptionsVisibility}
      />

      <Option
        value={gameOptions.soundEffects || ""}
        updateValue={updateOption}
        optionTag="soundEffects"
        label="Enable sound effects"
        type="checkbox"
      />

      <Option
        value={gameOptions.visualEffects || ""}
        updateValue={updateOption}
        optionTag="visualEffects"
        label="Enable special visual effects"
        type="checkbox"
      />

      <Option
        value={gameOptions.simultaneousTargetCount || ""}
        updateValue={updateOption}
        optionTag="simultaneousTargetCount"
        label="Max. number of simultaneous targets"
        type="input"
        min={0}
        max={100}
      />

      <Option
        value={gameOptions.targetInterval || ""}
        updateValue={updateOption}
        optionTag="targetInterval"
        label="Interval between targets (ms)"
        type="input"
        min={0}
        max={100}
      />

      <Option
        value={gameOptions.targetSize || ""}
        updateValue={updateOption}
        optionTag="targetSize"
        label="Target size"
        type="input"
        min={0}
        max={100}
      />

      <Option
        value={gameOptions.targetSizeVariation || ""}
        updateValue={updateOption}
        optionTag="targetSizeVariation"
        label="Target size variation"
        type="input"
        min={0}
        max={100}
      />
    </div>
  );
}

export function Option({
  value,
  updateValue,
  label,
  optionTag,
  type,
  min = undefined,
  max = undefined,
}) {
  return (
    <div className="option">
      <label htmlFor={`#gameoption-${optionTag}`}>{label}</label>
      {type === "input" ? (
        <input
          type="text"
          className="input"
          id={`gameoption-${optionTag}`}
          value={value}
          onChange={(e) =>
            updateValue(
              optionTag,
              Math.max(Math.min(parseInt(e.target.value), max), min)
            )
          }
        />
      ) : (
        <input
          type="checkbox"
          className="checkbox"
          id={`gameoption-${optionTag}`}
          checked={value}
          onChange={(e) => updateValue(optionTag, e.target.checked)}
        />
      )}
    </div>
  );
}
