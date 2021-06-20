export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function prettyNumber(num, decimalPlaces) {
  return num.toFixed(decimalPlaces);
}
