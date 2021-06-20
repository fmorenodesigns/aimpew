import "./styles.scss";

import React, { useCallback, useEffect } from "react";

import { GameOptionsButton } from "../KeyButton";
import Logo from "../Logo";

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

  // Ensure that the user doesn't leave empty fields, by falling back to the defaults
  useEffect(() => {
    if (
      showOptions ||
      Object.values(gameOptions).filter((val) => {
        return typeof val !== "boolean" && isNaN(parseInt(val));
      }).length === 0
    )
      return;

    setGameOptions((cur) => ({
      ...cur,
      simultaneousTargetCount:
        cur.simultaneousTargetCount ||
        DEFAULT_GAME_OPTIONS.simultaneousTargetCount,
      targetInterval: cur.targetInterval || DEFAULT_GAME_OPTIONS.targetInterval,
      targetSize: cur.targetSize || DEFAULT_GAME_OPTIONS.targetSize,
      targetSizeVariation: cur.targetSizeVariation || 0, // can be empty
    }));
  }, [showOptions, setGameOptions, gameOptions]);

  return (
    <div className={`overlay game-options ${showOptions ? "visible" : ""}`}>
      <GameOptionsButton
        description="Save"
        onClick={updateGameOptionsVisibility}
      />

      <Logo className="game-options-logo" />
      <div className="option-group">
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
      </div>

      <div className="option-group">
        <Option
          value={gameOptions.simultaneousTargetCount || ""}
          updateValue={updateOption}
          optionTag="simultaneousTargetCount"
          label="Max. number of simultaneous targets"
          type="input"
          min={0}
          max={40}
        />
        <Option
          value={gameOptions.targetInterval || ""}
          updateValue={updateOption}
          optionTag="targetInterval"
          label="Interval between new targets (ms)"
          type="input"
          min={0}
          max={10000}
          helpText={`Each target will last ${
            gameOptions.targetInterval * gameOptions.simultaneousTargetCount
          } ms`}
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

      <div className="game-options-credits">
        A project developed by{" "}
        <a
          href="https://github.com/fmorenodesigns"
          target="_blank"
          rel="noreferrer"
        >
          @fmorenodesigns
        </a>
      </div>
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
  helpText = "",
}) {
  return (
    <div className="option">
      <label htmlFor={`#gameoption-${optionTag}`}>
        {label}
        {helpText && <div className="help-text">{helpText}</div>}
      </label>
      {type === "input" ? (
        <input
          type="number"
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
