import "./styles.scss";

import React, { useCallback } from "react";

import GameOptionsButton from "./GameOptionsButton";

export const DEFAULT_GAME_OPTIONS = {
  soundEffects: true,
  visualEffects: true,
  simultaneousTargetCount: 3,
  targetInterval: 1000,
};

export default function GameOptions({
  gameOptions,
  setGameOptions,
  updateGameOptionsVisibility,
}) {
  const updateOption = useCallback(
    (optionName, newValue) => {
      setGameOptions({ ...gameOptions, [optionName]: newValue });
    },
    [gameOptions, setGameOptions]
  );

  return (
    <div className="game-options">
      <GameOptionsButton
        description="Resume game"
        onClick={() => updateGameOptionsVisibility(undefined, true)}
      />
      <div className="header">GAME OPTIONS</div>

      <div className="option">
        <label htmlFor="#gameoption-soundEffects">Enable sound effects</label>
        <input
          type="checkbox"
          className="checkbox"
          id="gameoption-soundEffects"
          checked={gameOptions.soundEffects}
          onChange={(e) => updateOption("soundEffects", e.target.checked)}
        />
      </div>

      <div className="option">
        <label htmlFor="#gameoption-visualEffects">
          Enable special visual effects
        </label>
        <input
          type="checkbox"
          className="checkbox"
          id="gameoption-visualEffects"
          checked={gameOptions.visualEffects}
          onChange={(e) => updateOption("visualEffects", e.target.checked)}
        />
      </div>

      <div className="option">
        <label htmlFor="#gameoption-simultaneousTargetCount">
          Max. number of simultaneous targets
        </label>
        <input
          type="text"
          className="input"
          id="gameoption-simultaneousTargetCount"
          value={gameOptions.simultaneousTargetCount || ""}
          onChange={(e) =>
            updateOption(
              "simultaneousTargetCount",
              Math.max(Math.min(e.target.value, 30), 0)
            )
          }
        />
      </div>

      <div className="option">
        <label htmlFor="#gameoption-targetInterval">
          Interval between targets (ms)
        </label>
        <input
          type="text"
          className="input"
          id="gameoption-targetInterval"
          value={gameOptions.targetInterval || ""}
          onChange={(e) =>
            updateOption(
              "targetInterval",
              Math.max(Math.min(e.target.value, 6000), 0)
            )
          }
        />
      </div>
    </div>
  );
}
