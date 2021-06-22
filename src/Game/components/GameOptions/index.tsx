import "./styles.scss";

import React, { useCallback, useEffect } from "react";

import Checkbox from "./Checkbox";
import Input from "./Input";
import Logo from "../Logo";
import { Select } from "./Select";
import { TargetType } from "../Target";

export interface GameOptionsType {
  onHitSoundEffect: boolean;
  onFireSoundEffect: boolean;
  visualEffects: boolean;
  targetGoal: number;
  simultaneousTargetCount: number;
  targetInterval: number;
  targetSize: number;
  targetSizeVariation: number;
  targetType: TargetType;
}

export const DEFAULT_GAME_OPTIONS: GameOptionsType = {
  onHitSoundEffect: true,
  onFireSoundEffect: true,
  visualEffects: true,
  targetGoal: 20, // 0 === no limit
  simultaneousTargetCount: 3,
  targetInterval: 1000,
  targetSize: 30,
  targetSizeVariation: 10,
  targetType: "pewion",
};

export interface Props {
  gameOptions: GameOptionsType;
  setGameOptions: React.Dispatch<React.SetStateAction<GameOptionsType>>;
  showOptions?: boolean;
  overlay?: boolean;
  hideLogo?: boolean;
}

export default function GameOptions({
  gameOptions,
  setGameOptions,
  showOptions = true,
  overlay = true,
  hideLogo = false,
}: Props) {
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
        return (
          !["boolean", "string"].includes(typeof val) && isNaN(parseInt(val))
        );
      }).length === 0
    )
      return;

    setGameOptions((cur) => ({
      ...cur,
      targetGoal: cur.targetGoal || 0, // can be empty
      simultaneousTargetCount:
        cur.simultaneousTargetCount ||
        DEFAULT_GAME_OPTIONS.simultaneousTargetCount,
      targetInterval: cur.targetInterval || DEFAULT_GAME_OPTIONS.targetInterval,
      targetSize: cur.targetSize || DEFAULT_GAME_OPTIONS.targetSize,
      targetSizeVariation: cur.targetSizeVariation || 0, // can be empty
    }));
  }, [showOptions, setGameOptions, gameOptions]);

  return (
    <div
      className={`${overlay ? "overlay" : ""} game-options ${
        showOptions ? "visible" : ""
      }`}
    >
      <div className="game-options-container">
        {!hideLogo && <Logo />}
        <div className="game-option-group">
          <Select
            value={gameOptions.targetType}
            updateValue={updateOption}
            optionTag="targetType"
            label="Target type"
            selectOptions={[
              { value: "pewion", label: "Pewion" },
              { value: "bullseye", label: "Bullseye" },
            ]}
          />
          <Checkbox
            value={gameOptions.onFireSoundEffect}
            updateValue={updateOption}
            optionTag="onFireSoundEffect"
            label={
              <>
                Enable sound effect <i>on fire</i>
              </>
            }
          />
          <Checkbox
            value={gameOptions.onHitSoundEffect}
            updateValue={updateOption}
            optionTag="onHitSoundEffect"
            label={
              <>
                Enable sound effect <i>on hit</i>
              </>
            }
          />
          <Checkbox
            value={gameOptions.visualEffects}
            updateValue={updateOption}
            optionTag="visualEffects"
            label="Enable special visual effects"
          />
        </div>

        <div className="game-option-group">
          <Input
            value={gameOptions.targetGoal}
            updateValue={updateOption}
            optionTag="targetGoal"
            label="Total target goal"
            helpText="Leave it empty for no goal"
            min={0}
            max={5000}
          />
          <Input
            value={gameOptions.simultaneousTargetCount}
            updateValue={updateOption}
            optionTag="simultaneousTargetCount"
            label="Max. number of simultaneous targets"
            min={0}
            max={40}
          />
          <Input
            value={gameOptions.targetInterval}
            updateValue={updateOption}
            optionTag="targetInterval"
            label="Interval between new targets (ms)"
            min={0}
            max={10000}
            helpText={`Each target will last approximately ${
              gameOptions.targetInterval * gameOptions.simultaneousTargetCount
            } ms`}
          />
          <Input
            value={gameOptions.targetSize}
            updateValue={updateOption}
            optionTag="targetSize"
            label="Target size"
            min={0}
            max={100}
          />
          <Input
            value={gameOptions.targetSizeVariation}
            updateValue={updateOption}
            optionTag="targetSizeVariation"
            label="Target size variation"
            helpText="Leave it empty for no variation"
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
    </div>
  );
}

export interface OptionCoreProps {
  label: React.ReactNode;
  optionTag: string;
  helpText?: string;
}
