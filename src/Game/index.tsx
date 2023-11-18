import "./styles.scss";

import { useEffect } from "react";
import { useState } from "react";

import {
  GameSettingsContext,
  GameSettingsType,
} from "./components/GameSettings/context";
import {
  DEFAULT_GAME_SETTINGS,
  getFixedGameSettings,
} from "./components/GameSettings/utils";
import Logo from "./components/Logo";
import PlayableGame from "./PlayableGame";
import { useLocalStorage, useQueryParams } from "./utils/hooks";
import { isMobile } from "./utils/utils";


export default function Game() {
  const queryParams = useQueryParams();
  const [gameSettings, setGameSettings] = useLocalStorage<GameSettingsType>(
    "aimpew-settings",
    DEFAULT_GAME_SETTINGS
  );

  const [parsedQueryParams, setParsedQueryParams] = useState(false);

  // Parse the query params in the URL on load
  useEffect(() => {
    if (parsedQueryParams || queryParams === undefined) return;

    setGameSettings(getFixedGameSettings(queryParams));
    setParsedQueryParams(true);
  }, [parsedQueryParams, queryParams, setGameSettings]);

  return isMobile() ? (
    <div className="game is-mobile">
      <div className="error">
        <Logo />
        <p>
          This application has been developed to help people practice their
          mouse aim, and is currently not compatible with mobile devices.
        </p>
      </div>
    </div>
  ) : (
    <div className="game">
      <GameSettingsContext.Provider value={{ gameSettings, setGameSettings }}>
        <PlayableGame />
      </GameSettingsContext.Provider>
    </div>
  );
}
