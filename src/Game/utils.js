export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function prettyNumber(num, decimalPlaces) {
  return num.toFixed(decimalPlaces);
}

export function getPauseDuration(pauseDatetime, referenceTime) {
  return pauseDatetime.start > referenceTime
    ? pauseDatetime.end - pauseDatetime.start
    : 0;
}
