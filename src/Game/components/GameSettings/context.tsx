import { TargetType } from "../Target";
import { createContext } from "react";

export interface GameSettingsType {
  onHitSoundFx: boolean;
  onFireSoundFx: boolean;
  visualEffects: boolean;
  targetGoal: number;
  simultaneousTargetCount: number;
  targetInterval: number;
  targetSize: number;
  targetSizeVariation: number;
  targetType: TargetType;
}

export const DEFAULT_GAME_SETTINGS: GameSettingsType = {
  onHitSoundFx: true,
  onFireSoundFx: true,
  visualEffects: true,
  targetGoal: 20, // 0 === no limit
  simultaneousTargetCount: 3,
  targetInterval: 1000,
  targetSize: 30,
  targetSizeVariation: 10,
  targetType: "pewion",
};

interface GameSettingsContextType {
  gameSettings: GameSettingsType;
  setGameSettings: (value: GameSettingsType) => void;
}

export const GameSettingsContext = createContext<GameSettingsContextType>({
  gameSettings: DEFAULT_GAME_SETTINGS,
  setGameSettings: () => null,
});
