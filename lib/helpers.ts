export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function formatNumber(num: number, decimals: number = 3): string {
  if (Number.isInteger(num)) return num.toString();
  return num.toFixed(decimals);
}

export function formatScientific(num: number): string {
  if (Math.abs(num) >= 1e6 || (Math.abs(num) < 1e-4 && num !== 0)) {
    return num.toExponential(3);
  }
  return formatNumber(num);
}
