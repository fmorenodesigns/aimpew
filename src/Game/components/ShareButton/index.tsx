import "./styles.scss";

import { GameSettingsContext } from "../GameSettings/context";
import { generateSettingsLink } from "../../utils/utils";
import { useCallback } from "react";
import { useContext } from "react";

export default function ShareButton() {
  const { gameSettings } = useContext(GameSettingsContext);

  const copySettings = useCallback(() => {
    const settingsUrl = generateSettingsLink(gameSettings);

    navigator.clipboard.writeText(settingsUrl);
  }, [gameSettings]);

  return (
    <button className="share-button" onClick={copySettings}>
      <span
        data-tooltip="Clicking this button will copy a link with your settings to your clipboard, so that you and your friends can compete on the same level."
        className="tooltip--left"
      >
        <i className="far fa-copy"></i>
      </span>
    </button>
  );
}
