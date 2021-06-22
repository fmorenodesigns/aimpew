export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
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
