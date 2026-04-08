/**
 * Count the number of significant figures in a number.
 * Rules:
 *   - All non-zero digits are significant
 *   - Zeros between non-zero digits are significant
 *   - Leading zeros are NOT significant
 *   - Trailing zeros are significant ONLY if there is a decimal point
 */
export function countSigFigs(value: number): number {
  if (value === 0) return 0;

  const str = Math.abs(value).toString().replace(/^-/, '');

  if (str.includes('e') || str.includes('E')) {
    const [mantissa] = str.split(/[eE]/);
    return countSigFigsInString(mantissa);
  }

  return countSigFigsInString(str);
}

function countSigFigsInString(s: string): number {
  if (!s || s === '0') return 0;
  if (s === '0.') return 1;

  const hasDecimal = s.includes('.');
  const stripped = s.replace('.', '');

  let firstNonZero = -1;
  for (let i = 0; i < stripped.length; i++) {
    if (stripped[i] !== '0') {
      firstNonZero = i;
      break;
    }
  }

  if (firstNonZero === -1) return 0;

  let lastSignificant: number;
  if (hasDecimal) {
    lastSignificant = stripped.length - 1;
  } else {
    lastSignificant = stripped.length - 1;
    while (lastSignificant > firstNonZero && stripped[lastSignificant] === '0') {
      lastSignificant--;
    }
  }

  return lastSignificant - firstNonZero + 1;
}

/**
 * Parse a string input and return both the numeric value and its significant figure count.
 * Handles trailing zeros, decimal points, and scientific notation properly.
 */
export function parseSigFigsFromInput(input: string): { value: number; sigFigs: number } {
  const trimmed = input.trim();
  if (!trimmed) return { value: 0, sigFigs: 0 };

  const value = parseFloat(trimmed);
  if (isNaN(value)) return { value: 0, sigFigs: 0 };
  if (value === 0) return { value: 0, sigFigs: 0 };

  const hasDecimal = trimmed.includes('.');
  const absStr = trimmed.replace(/^-/, '');

  if (absStr.includes('e') || absStr.includes('E')) {
    const [mantissa] = absStr.split(/[eE]/);
    const sigFigs = countSigFigsInString(mantissa);
    return { value, sigFigs };
  }

  const digitsOnly = absStr.replace('.', '').replace(/^-/, '');
  let firstNonZero = -1;
  for (let i = 0; i < digitsOnly.length; i++) {
    if (digitsOnly[i] !== '0') {
      firstNonZero = i;
      break;
    }
  }

  if (firstNonZero === -1) return { value: 0, sigFigs: 0 };

  let lastSignificant: number;
  if (hasDecimal) {
    lastSignificant = digitsOnly.length - 1;
  } else {
    lastSignificant = digitsOnly.length - 1;
    while (lastSignificant > firstNonZero && digitsOnly[lastSignificant] === '0') {
      lastSignificant--;
    }
  }

  const sigFigs = lastSignificant - firstNonZero + 1;
  return { value, sigFigs };
}

/**
 * Round a number to the specified number of significant figures.
 */
export function roundToSigFigs(value: number, sigFigs: number): number {
  if (value === 0 || sigFigs <= 0) return 0;
  if (!isFinite(value)) return value;

  const d = Math.ceil(Math.log10(Math.abs(value)));
  const power = sigFigs - d;
  const magnitude = Math.pow(10, power);
  const shifted = Math.round(value * magnitude);
  return shifted / magnitude;
}

/**
 * Format a number with proper significant figure display.
 * Uses scientific notation for very large/small numbers.
 */
export function formatSigFigs(value: number, sigFigs: number): string {
  if (value === 0) return '0';
  if (!isFinite(value)) return value.toString();
  if (sigFigs <= 0) return '0';

  const absVal = Math.abs(value);
  const useScientific = absVal >= 1e6 || (absVal < 1e-3 && absVal !== 0);

  if (useScientific) {
    return value.toExponential(sigFigs - 1);
  }

  const d = Math.ceil(Math.log10(absVal));
  const decimals = Math.max(0, sigFigs - d);
  return value.toFixed(decimals);
}

/**
 * Format a number with sig figs, returning both the formatted string and the rounded value.
 */
export function formatSigFigsWithRounded(value: number, sigFigs: number): { formatted: string; rounded: number } {
  const rounded = roundToSigFigs(value, sigFigs);
  const formatted = formatSigFigs(rounded, sigFigs);
  return { formatted, rounded };
}

/**
 * Determine the correct number of significant figures for a result
 * based on the operation type and input values.
 *
 * For multiplication/division: least number of sig figs among inputs
 * For addition/subtraction: least precise decimal place
 */
export function determineResultSigFigs(
  inputs: { value: number; sigFigs: number }[],
  operation: 'multiply' | 'divide' | 'add' | 'subtract'
): number {
  if (inputs.length === 0) return 3;

  if (operation === 'multiply' || operation === 'divide') {
    const minSigFigs = Math.min(...inputs.map(i => i.sigFigs).filter(s => s > 0));
    return minSigFigs > 0 ? minSigFigs : 3;
  }

  let minDecimalPlace = Infinity;
  for (const input of inputs) {
    if (input.value === 0) continue;
    const absVal = Math.abs(input.value);
    const d = Math.ceil(Math.log10(absVal));
    const decimals = input.sigFigs - d;
    if (decimals < minDecimalPlace) {
      minDecimalPlace = decimals;
    }
  }

  if (!isFinite(minDecimalPlace)) return 3;

  const resultValue = operation === 'add'
    ? inputs.reduce((sum, i) => sum + i.value, 0)
    : inputs.reduce((diff, i, idx) => idx === 0 ? i.value : diff - i.value, 0);

  if (resultValue === 0) return 3;
  const resultD = Math.ceil(Math.log10(Math.abs(resultValue)));
  return Math.max(1, resultD + minDecimalPlace);
}

/**
 * Determine sig figs from multiple inputs for a chain of multiply/divide operations.
 * Returns the minimum sig fig count among all inputs.
 */
export function minSigFigsFromInputs(inputs: { value: number; sigFigs: number }[]): number {
  const valid = inputs.map(i => i.sigFigs).filter(s => s > 0);
  return valid.length > 0 ? Math.min(...valid) : 3;
}

/**
 * Get the number of decimal places for a value given its sig figs.
 */
export function getDecimalPlaces(value: number, sigFigs: number): number {
  if (value === 0) return 0;
  const d = Math.ceil(Math.log10(Math.abs(value)));
  return Math.max(0, sigFigs - d);
}
