import { createContext } from "react";

import { TargetType } from "../Target";

import { DEFAULT_GAME_SETTINGS } from "./utils";

export interface NumericGameSettingsType {
  targetGoal: number;
  simultaneousTargetCount: number;
  targetInterval: number;
  targetSize: number;
  targetSizeVariation: number;
}
export interface GameSettingsType extends NumericGameSettingsType {
  onHitSoundFx: boolean;
  onFireSoundFx: boolean;
  visualFx: boolean;
  targetType: TargetType;
}

interface GameSettingsContextType {
  gameSettings: GameSettingsType;
  setGameSettings: (value: GameSettingsType) => void;
}

export const GameSettingsContext = createContext<GameSettingsContextType>({
  gameSettings: DEFAULT_GAME_SETTINGS,
  setGameSettings: () => null,
});
