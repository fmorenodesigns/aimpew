import { GameSettingsType, NumericGameSettingsType } from "./context";

export const DEFAULT_GAME_SETTINGS: GameSettingsType = {
  onHitSoundFx: true,
  onFireSoundFx: true,
  visualFx: true,
  targetGoal: 20, // accepts 0 === no limit
  simultaneousTargetCount: 3,
  targetInterval: 1000,
  targetSize: 30,
  targetSizeVariation: 10, // accepts 0 === no variation
  targetType: "pewion",
};

export const MIN_MAX_GAME_SETTINGS = {
  targetGoal: [0, 5000],
  simultaneousTargetCount: [1, 40],
  targetInterval: [200, 10000],
  targetSize: [1, 100],
  targetSizeVariation: [0, 100],
};

// Checks whether the object of GameSettingsType is valid
export function isValidGameSettings(settings: GameSettingsType) {
  return (
    Object.entries(settings).filter((entry) => {
      const [key, value] = entry;
      const typedKey = key as keyof NumericGameSettingsType;

      return (
        (!["boolean", "string"].includes(typeof value) &&
          isNaN(parseInt(value))) ||
        (typedKey in MIN_MAX_GAME_SETTINGS &&
          value < MIN_MAX_GAME_SETTINGS[typedKey][0])
      );
    }).length === 0
  );
}

/**
 * Returns a GameSettingsType object with the settings validated and fixed
 * according to their min, max limits.
 */
export function getFixedGameSettings(settings: Partial<GameSettingsType>) {
  const targetGoal = capGameSettingValue("targetGoal", settings.targetGoal);
  const simultaneousTargetCount = capGameSettingValue(
    "simultaneousTargetCount",
    settings.simultaneousTargetCount
  );
  const targetInterval = capGameSettingValue(
    "targetInterval",
    settings.targetInterval
  );
  const targetSize = capGameSettingValue("targetSize", settings.targetSize);
  const targetSizeVariation = capGameSettingValue(
    "targetSizeVariation",
    settings.targetSizeVariation
  );

  return {
    ...DEFAULT_GAME_SETTINGS,
    targetGoal,
    simultaneousTargetCount,
    targetInterval,
    targetSize,
    targetSizeVariation,
  };
}

/** Used to cap a given game setting number, according to their min and max values. */
export function capGameSettingValue(
  settingTag: keyof NumericGameSettingsType,
  value?: number | string
): number {
  if (
    value === undefined ||
    (typeof value === "string" && isNaN(parseInt(value)))
  ) {
    if (MIN_MAX_GAME_SETTINGS[settingTag][0] === 0) return 0;

    return DEFAULT_GAME_SETTINGS[settingTag];
  }

  return Math.max(
    Math.min(parseInt(String(value)), MIN_MAX_GAME_SETTINGS[settingTag][1]),
    MIN_MAX_GAME_SETTINGS[settingTag][0]
  );
}
