import "./styles.scss";

import {
  DEFAULT_GAME_SETTINGS,
  GameSettingsContext,
  GameSettingsType,
} from "./components/GameSettings/context";

import Logo from "./components/Logo";
import PlayableGame from "./PlayableGame";
import { isMobile } from "./utils/utils";
import { useLocalStorage } from "./utils/hooks";

export default function Game() {
  const [gameSettings, setGameSettings] = useLocalStorage<GameSettingsType>(
    "aimpew-settings",
    DEFAULT_GAME_SETTINGS
  );

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
