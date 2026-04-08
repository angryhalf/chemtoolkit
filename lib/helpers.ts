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

export function formatWithSigFigs(num: number, sigFigs: number, mode: 'auto' | 'fixed' | 'disabled' = 'auto'): string {
  if (mode === 'disabled') {
    if (Math.abs(num) >= 1e6 || (Math.abs(num) < 1e-4 && num !== 0)) {
      return num.toExponential(4);
    }
    return num.toFixed(4);
  }

  if (num === 0) return '0';
  if (!isFinite(num)) return num.toString();
  if (sigFigs <= 0) sigFigs = 3;

  const absVal = Math.abs(num);
  const useScientific = absVal >= 1e6 || (absVal < 1e-3 && absVal !== 0);

  if (useScientific) {
    return num.toExponential(sigFigs - 1);
  }

  const d = Math.ceil(Math.log10(absVal));
  const decimals = Math.max(0, sigFigs - d);
  return num.toFixed(decimals);
}
