import "./styles.scss";

import { DEFAULT_GAME_SETTINGS, GameSettingsContext } from "./context";
import { useCallback, useEffect } from "react";

import Checkbox from "./Checkbox";
import DonateButton from "../DonateButton";
import Input from "./Input";
import Logo from "../Logo";
import { Select } from "./Select";
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
    if (
      showSettings ||
      Object.values(gameSettings).filter((val) => {
        return (
          !["boolean", "string"].includes(typeof val) && isNaN(parseInt(val))
        );
      }).length === 0
    )
      return;

    setGameSettings({
      ...gameSettings,
      targetGoal: gameSettings.targetGoal || 0, // can be empty
      simultaneousTargetCount:
        gameSettings.simultaneousTargetCount ||
        DEFAULT_GAME_SETTINGS.simultaneousTargetCount,
      targetInterval:
        gameSettings.targetInterval || DEFAULT_GAME_SETTINGS.targetInterval,
      targetSize: gameSettings.targetSize || DEFAULT_GAME_SETTINGS.targetSize,
      targetSizeVariation: gameSettings.targetSizeVariation || 0, // can be empty
    });
  }, [showSettings, setGameSettings, gameSettings]);

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
            value={gameSettings.visualEffects}
            updateValue={updateSetting}
            settingTag="visualEffects"
            label="Enable special visual effects"
          />
        </div>

        <div className="game-setting-group">
          <Input
            value={gameSettings.targetGoal}
            updateValue={updateSetting}
            settingTag="targetGoal"
            label="Total target goal"
            helpText="Leave it empty for no goal"
            min={0}
            max={5000}
          />
          <Input
            value={gameSettings.simultaneousTargetCount}
            updateValue={updateSetting}
            settingTag="simultaneousTargetCount"
            label="Max. number of simultaneous targets"
            min={0}
            max={40}
          />
          <Input
            value={gameSettings.targetInterval}
            updateValue={updateSetting}
            settingTag="targetInterval"
            label="Interval between new targets (ms)"
            min={0}
            max={10000}
            helpText={`Each target will last approximately ${
              gameSettings.targetInterval * gameSettings.simultaneousTargetCount
            } ms`}
          />
          <Input
            value={gameSettings.targetSize}
            updateValue={updateSetting}
            settingTag="targetSize"
            label="Target size"
            min={0}
            max={100}
          />
          <Input
            value={gameSettings.targetSizeVariation}
            updateValue={updateSetting}
            settingTag="targetSizeVariation"
            label="Target size variation"
            helpText="Leave it empty for no variation"
            min={0}
            max={100}
          />
        </div>

        <DonateButton />
      </div>
    </div>
  );
}
