export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function prettyPercentage(decimalNumber, decimalPlaces) {
  return (decimalNumber * 100).toFixed(decimalPlaces);
}
