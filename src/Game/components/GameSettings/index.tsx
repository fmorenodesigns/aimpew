import "./styles.scss";

import {
  MIN_MAX_GAME_SETTINGS,
  getFixedGameSettings,
  isValidGameSettings,
} from "./utils";
import { useCallback, useEffect } from "react";

import Checkbox from "./Checkbox";
import DonateButton from "../DonateButton";
import { GameSettingsContext } from "./context";
import Input from "./Input";
import Logo from "../Logo";
import { Select } from "./Select";
import ShareButton from "../ShareButton";
import { useContext } from "react";

export interface Props {
  showSettings?: boolean;
  overlay?: boolean;
  hideLogo?: boolean;
}

export default function GameSettings({
  showSettings = true,
  overlay = true,
  hideLogo = false,
}: Props) {
  const { gameSettings, setGameSettings } = useContext(GameSettingsContext);
  const updateSetting = useCallback(
    (settingName, newValue) => {
      setGameSettings({ ...gameSettings, [settingName]: newValue });
    },
    [gameSettings, setGameSettings]
  );

  // Ensure that the user doesn't leave empty fields, by falling back to the defaults
  useEffect(() => {
    if (showSettings || isValidGameSettings(gameSettings)) return;

    setGameSettings(getFixedGameSettings(gameSettings));
  }, [gameSettings, setGameSettings, showSettings]);

  return (
    <div
      className={`${overlay ? "overlay" : ""} game-settings ${
        showSettings ? "visible" : ""
      }`}
    >
      <div className="game-settings-container">
        {!hideLogo && <Logo />}
        <div className="game-setting-group">
          <Select
            value={gameSettings.targetType}
            updateValue={updateSetting}
            settingTag="targetType"
            label="Target type"
            selectOptions={[
              { value: "pewion", label: "Pewion" },
              { value: "bullseye", label: "Bullseye" },
              { value: "covid", label: "COVID-19" },
            ]}
          />
          <Checkbox
            value={gameSettings.onFireSoundFx}
            updateValue={updateSetting}
            settingTag="onFireSoundFx"
            label={
              <>
                Enable sound effect <i>on fire</i>
              </>
            }
          />
          <Checkbox
            value={gameSettings.onHitSoundFx}
            updateValue={updateSetting}
            settingTag="onHitSoundFx"
            label={
              <>
                Enable sound effect <i>on hit</i>
              </>
            }
          />
          <Checkbox
            value={gameSettings.visualFx}
            updateValue={updateSetting}
            settingTag="visualFx"
            label="Enable special visual effects"
          />
        </div>

        <div className="game-setting-group">
          <ShareButton />
          <Input
            value={gameSettings.targetGoal}
            updateValue={updateSetting}
            settingTag="targetGoal"
            label="Total target goal"
            helpText="Leave it empty for no goal"
            min={MIN_MAX_GAME_SETTINGS["targetGoal"][0]}
            max={MIN_MAX_GAME_SETTINGS["targetGoal"][1]}
          />
          <Input
            value={gameSettings.simultaneousTargetCount}
            updateValue={updateSetting}
            settingTag="simultaneousTargetCount"
            label="Max. number of simultaneous targets"
            min={MIN_MAX_GAME_SETTINGS["simultaneousTargetCount"][0]}
            max={MIN_MAX_GAME_SETTINGS["simultaneousTargetCount"][1]}
          />
          <Input
            value={gameSettings.targetInterval}
            updateValue={updateSetting}
            settingTag="targetInterval"
            label="Interval between new targets (ms)"
            helpText={`Each target will last approximately ${
              gameSettings.targetInterval * gameSettings.simultaneousTargetCount
            } ms`}
            min={MIN_MAX_GAME_SETTINGS["targetInterval"][0]}
            max={MIN_MAX_GAME_SETTINGS["targetInterval"][1]}
          />
          <Input
            value={gameSettings.targetSize}
            updateValue={updateSetting}
            settingTag="targetSize"
            label="Target size"
            min={MIN_MAX_GAME_SETTINGS["targetSize"][0]}
            max={MIN_MAX_GAME_SETTINGS["targetSize"][1]}
          />
          <Input
            value={gameSettings.targetSizeVariation}
            updateValue={updateSetting}
            settingTag="targetSizeVariation"
            label="Target size variation"
            helpText="Leave it empty for no variation"
            min={MIN_MAX_GAME_SETTINGS["targetSizeVariation"][0]}
            max={MIN_MAX_GAME_SETTINGS["targetSizeVariation"][1]}
          />
        </div>

        <DonateButton />
      </div>
    </div>
  );
}
