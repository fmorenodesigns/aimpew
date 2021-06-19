import "./styles.scss";

import React, { useCallback } from "react";

export const DEFAULT_GAME_OPTIONS = {
  flash: true,
  simultaneousTargetCount: 3,
  targetInterval: 1000,
};

export default function GameOptions({ gameOptions, setGameOptions }) {
  const updateOption = useCallback(
    (optionName, newValue) => {
      setGameOptions({ ...gameOptions, [optionName]: newValue });
    },
    [gameOptions, setGameOptions]
  );

  return (
    <div className="game-options">
      <div className="option">
        <input
          type="checkbox"
          className="checkbox"
          id="gameoption-flash"
          checked={gameOptions.flash}
          onChange={(e) => updateOption("flash", e.target.checked)}
        />
        <label htmlFor="#gameoption-flash">Flash animation on gun fire</label>
      </div>

      <div className="option">
        <input
          type="number"
          id="gameoption-simultaneousTargetCount"
          value={gameOptions.simultaneousTargetCount}
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
          value={gameOptions.targetInterval}
          onChange={(e) => updateOption("targetInterval", e.target.value)}
        />
        <label htmlFor="#gameoption-targetInterval">
          Interval between targets (ms)
        </label>
      </div>
    </div>
  );
}
