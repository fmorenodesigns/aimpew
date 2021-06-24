import { NumericGameSettingsType } from "../components/GameSettings/context";

export function isMobile(): boolean {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 0) // iPad Pro
  );
}

export function prettyNumber(num: number, decimalPlaces: number): string {
  return num.toFixed(decimalPlaces);
}

export interface PauseDatetime {
  end: Date | null;
  start: Date | null;
}

export function getPauseDuration(
  pauseDatetime: PauseDatetime,
  referenceTime: Date
): number {
  if (pauseDatetime.start === null || pauseDatetime.end === null) return 0;

  return pauseDatetime.start > referenceTime
    ? pauseDatetime.end.valueOf() - pauseDatetime.start.valueOf()
    : 0;
}

export function numIsBetween(num: number, min: number, max: number): boolean {
  return num >= min && num <= max;
}

export function generateSettingsLink(
  settings: NumericGameSettingsType
): string {
  const settingsCopy = {
    targetGoal: settings.targetGoal ? `${settings.targetGoal}` : "",
    simultaneousTargetCount: `${settings.simultaneousTargetCount}`,
    targetInterval: `${settings.targetInterval}`,
    targetSize: `${settings.targetSize}`,
    targetSizeVariation: `${settings.targetSizeVariation}`,
  };

  const queryParams = new URLSearchParams(settingsCopy).toString();

  return window.location.origin + "/?" + queryParams;
}
