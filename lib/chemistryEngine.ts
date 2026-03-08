import { elementMap } from '@/data/elements';
import { AVOGADRO, Unit } from './utils';

export type { Unit };
export type MoleculePart = { type: 'element'; symbol: string; count: number } | { type: 'group'; parts: MoleculePart[]; count: number };
export interface Molecule { id: string; parts: MoleculePart[] }
export interface CompositionResult { totalMass: number; composition: ElementComposition[]; steps: CalculationStep[]; }
export interface ElementComposition { symbol: string; mass: number; percentage: number; count: number; atomicMass: number; }
export interface BalanceResult { coefficients: number[]; balancedEquation: string; steps: CalculationStep[]; }
export interface CalculationStep { text: string; type: 'info' | 'calculation' | 'result'; }
export type BalanceError = { message: string; code: 'EMPTY_REACTANT' | 'EMPTY_PRODUCT' | 'EMPTY_MOLECULE' | 'INSUFFICIENT_MOLECULES' | 'UNBALANCEABLE' | 'UNKNOWN' };

export type GasLaw = 'boyle' | 'charles' | 'combined';

export interface GasLawInput {
  law: GasLaw;
  pressure?: number;
  volume?: number;
  temperature?: number;
  pressureUnit: 'atm' | 'kPa' | 'mmHg';
  volumeUnit: 'L' | 'mL';
  temperatureUnit: 'K' | 'C' | 'F';
  p2?: number;
  v2?: number;
  t2?: number;
}

export interface GasLawResult {
  unknown: string;
  value: number;
  unit: string;
  steps: CalculationStep[];
  formula: string;
  variables: { symbol: string; value: number; unit: string }[];
}

const R = 0.082057; // L·atm/(mol·K)

const formatValue = (v: number): string => {
  if (Math.abs(v) >= 1e6 || (Math.abs(v) < 1e-4 && v !== 0)) {
    return v.toExponential(4);
  }
  return v.toFixed(4);
};

export const calculateGasLaw = (input: GasLawInput): GasLawResult => {
  const { law, pressure, volume, temperature, pressureUnit, volumeUnit, temperatureUnit, p2, v2, t2 } = input;
  
  const toAtm = (p: number) => pressureUnit === 'atm' ? p : pressureUnit === 'kPa' ? p * 0.00986923 : p * 0.00131579;
  const fromAtm = (a: number) => pressureUnit === 'atm' ? a : pressureUnit === 'kPa' ? a / 0.00986923 : a / 0.00131579;
  const toL = (v: number) => volumeUnit === 'L' ? v : v * 0.001;
  const fromL = (L: number) => volumeUnit === 'L' ? L : L / 0.001;
  const toK = (t: number) => temperatureUnit === 'K' ? t : temperatureUnit === 'C' ? t + 273.15 : (t - 32) * 5/9 + 273.15;
  const fromK = (K: number) => temperatureUnit === 'K' ? K : temperatureUnit === 'C' ? K - 273.15 : (K - 273.15) * 9/5 + 32;

  const P1 = pressure ? toAtm(pressure) : undefined;
  const V1 = volume ? toL(volume) : undefined;
  const T1 = temperature ? toK(temperature) : undefined;
  const P2 = p2 ? toAtm(p2) : undefined;
  const V2 = v2 ? toL(v2) : undefined;
  const T2 = t2 ? toK(t2) : undefined;

  const steps: CalculationStep[] = [];
  let unknown = '';
  let value = 0;
  let formula = '';
  let unit = '';
  const variables: { symbol: string; value: number; unit: string }[] = [];

  if (pressure !== undefined) variables.push({ symbol: 'P1', value: pressure, unit: pressureUnit });
  if (volume !== undefined) variables.push({ symbol: 'V1', value: volume, unit: volumeUnit });
  if (temperature !== undefined) variables.push({ symbol: 'T1', value: temperature, unit: temperatureUnit });
  if (p2 !== undefined) variables.push({ symbol: 'P2', value: p2, unit: pressureUnit });
  if (v2 !== undefined) variables.push({ symbol: 'V2', value: v2, unit: volumeUnit });
  if (t2 !== undefined) variables.push({ symbol: 'T2', value: t2, unit: temperatureUnit });

  switch (law) {
    case 'boyle':
      steps.push({ text: "Boyle's Law (P1V1 = P2V2)", type: 'info' });
      if (P1 !== undefined && V1 !== undefined && P2 !== undefined) {
        unknown = 'Final Volume (V2)';
        unit = volumeUnit;
        formula = 'P1V1 = P2V2';
        const v2Calc = (P1 * V1) / P2;
        steps.push({ text: `V2 = (P1 * V1) / P2`, type: 'calculation' });
        steps.push({ text: `V2 = (${formatValue(P1)} * ${formatValue(V1)}) / ${formatValue(P2)}`, type: 'calculation' });
        steps.push({ text: `V2 = ${formatValue(v2Calc)} L`, type: 'result' });
        value = fromL(v2Calc);
      } else if (P1 !== undefined && V1 !== undefined && V2 !== undefined) {
        unknown = 'Final Pressure (P2)';
        unit = pressureUnit;
        formula = 'P1V1 = P2V2';
        const p2Calc = (P1 * V1) / V2;
        steps.push({ text: `P2 = (P1 * V1) / V2`, type: 'calculation' });
        steps.push({ text: `P2 = (${formatValue(P1)} * ${formatValue(V1)}) / ${formatValue(V2)}`, type: 'calculation' });
        steps.push({ text: `P2 = ${formatValue(p2Calc)} atm`, type: 'result' });
        value = fromAtm(p2Calc);
      }
      break;

    case 'charles':
      steps.push({ text: "Charles's Law (V1/T1 = V2/T2)", type: 'info' });
      if (V1 !== undefined && T1 !== undefined && T2 !== undefined) {
        unknown = 'Final Volume (V2)';
        unit = volumeUnit;
        formula = 'V1/T1 = V2/T2';
        const v2Calc = (V1 * T2) / T1;
        steps.push({ text: `V2 = (V1 * T2) / T1`, type: 'calculation' });
        steps.push({ text: `V2 = (${formatValue(V1)} * ${formatValue(T2)} K) / ${formatValue(T1)} K`, type: 'calculation' });
        steps.push({ text: `V2 = ${formatValue(v2Calc)} L`, type: 'result' });
        value = fromL(v2Calc);
      } else if (V1 !== undefined && T1 !== undefined && V2 !== undefined) {
        unknown = 'Final Temperature (T2)';
        unit = temperatureUnit;
        formula = 'V1/T1 = V2/T2';
        const t2Calc = (V2 * T1) / V1;
        steps.push({ text: `T2 = (V2 * T1) / V1`, type: 'calculation' });
        steps.push({ text: `T2 = (${formatValue(V2)} * ${formatValue(T1)} K) / ${formatValue(V1)}`, type: 'calculation' });
        steps.push({ text: `T2 = ${formatValue(t2Calc)} K`, type: 'result' });
        value = fromK(t2Calc);
      }
      break;

    case 'combined':
      steps.push({ text: "Combined Gas Law ((P1V1)/T1 = (P2V2)/T2)", type: 'info' });
      if (P1 !== undefined && V1 !== undefined && T1 !== undefined && P2 !== undefined && V2 !== undefined && T2 !== undefined) {
        unknown = 'Final Temperature (T2)';
        unit = temperatureUnit;
        formula = '(P1V1)/T1 = (P2V2)/T2';
        const t2Calc = (P2 * V2 * T1) / (P1 * V1);
        steps.push({ text: `T2 = (P2 * V2 * T1) / (P1 * V1)`, type: 'calculation' });
        steps.push({ text: `T2 = (${formatValue(P2)} * ${formatValue(V2)} * ${formatValue(T1)}) / (${formatValue(P1)} * ${formatValue(V1)})`, type: 'calculation' });
        steps.push({ text: `T2 = ${formatValue(t2Calc)} K`, type: 'result' });
        value = fromK(t2Calc);
      } else if (P1 !== undefined && V1 !== undefined && T1 !== undefined && P2 !== undefined && T2 !== undefined) {
        unknown = 'Final Volume (V2)';
        unit = volumeUnit;
        formula = '(P1V1)/T1 = (P2V2)/T2';
        const v2Calc = (P1 * V1 * T2) / (P2 * T1);
        steps.push({ text: `V2 = (P1 * V1 * T2) / (P2 * T1)`, type: 'calculation' });
        steps.push({ text: `V2 = (${formatValue(P1)} * ${formatValue(V1)} * ${formatValue(T2)} K) / (${formatValue(P2)} * ${formatValue(T1)} K)`, type: 'calculation' });
        steps.push({ text: `V2 = ${formatValue(v2Calc)} L`, type: 'result' });
        value = fromL(v2Calc);
      } else if (P1 !== undefined && V1 !== undefined && T1 !== undefined && V2 !== undefined && T2 !== undefined) {
        unknown = 'Final Pressure (P2)';
        unit = pressureUnit;
        formula = '(P1V1)/T1 = (P2V2)/T2';
        const p2Calc = (P1 * V1 * T2) / (V2 * T1);
        steps.push({ text: `P2 = (P1 * V1 * T2) / (V2 * T1)`, type: 'calculation' });
        steps.push({ text: `P2 = (${formatValue(P1)} * ${formatValue(V1)} * ${formatValue(T2)} K) / (${formatValue(V2)} * ${formatValue(T1)} K)`, type: 'calculation' });
        steps.push({ text: `P2 = ${formatValue(p2Calc)} atm`, type: 'result' });
        value = fromAtm(p2Calc);
      }
      break;
  }

  return { unknown, value, unit, steps, formula, variables };
};

const getLawName = (law: GasLaw): string => {
  const names: Record<GasLaw, string> = {
    boyle: "Boyle's",
    charles: "Charles's",
    combined: 'Combined Gas',
  };
  return names[law];
};

const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;

const getCounts = (parts: MoleculePart[], mult = 1, counts = new Map<string, number>()): Map<string, number> => {
    parts.forEach(p => p.type === 'element' 
        ? counts.set(p.symbol, (counts.get(p.symbol) || 0) + p.count * mult)
        : getCounts(p.parts, p.count * mult, counts));
    return counts;
};

const simplifyCoeffs = (c: number[]) => { const g = c.reduce(gcd); return c.map(x => x / g); };

export const calculateMolarMass = (mol: Molecule): CompositionResult => {
    const counts = getCounts(mol.parts);
    const composition: ElementComposition[] = [];
    const steps: CalculationStep[] = [{ text: '1. Identify elements and their counts.', type: 'info' }];
    let totalMass = 0;

    counts.forEach((count, sym) => {
        const el = elementMap.get(sym);
        if (!el) return;
        const mass = el.mass * count;
        totalMass += mass;
        composition.push({ symbol: sym, mass, count, atomicMass: el.mass, percentage: 0 });
        steps.push({ text: `   - ${sym}: ${count} × ${el.mass} = ${mass.toFixed(3)} g/mol`, type: 'calculation' });
    });

    steps.push({ text: '2. Sum subtotals to get Total Molar Mass.', type: 'info' });
    steps.push({ text: `   Total = ${totalMass.toFixed(3)} g/mol`, type: 'result' });
    steps.push({ text: '3. Calculate percent composition.', type: 'info' });
    composition.forEach(c => { c.percentage = (c.mass / totalMass) * 100; steps.push({ text: `   - ${c.symbol}: (${c.mass.toFixed(3)} / ${totalMass.toFixed(3)}) × 100 = ${c.percentage.toFixed(2)}%`, type: 'calculation' }); });
    return { totalMass, composition, steps };
};

const checkBalanced = (r: Molecule[], p: Molecule[], c: number[]): boolean => {
    const bal = new Map<string, number>();
    r.forEach((m, i) => getCounts(m.parts).forEach((v, el) => bal.set(el, (bal.get(el) || 0) + v * c[i])));
    p.forEach((m, i) => getCounts(m.parts).forEach((v, el) => bal.set(el, (bal.get(el) || 0) - v * c[r.length + i])));
    return ![...bal.values()].some(v => v !== 0);
};

const findSolution = (r: Molecule[], p: Molecule[], max: number, curr: number[] = [], depth = 0): number[] | null => {
    const total = r.length + p.length;
    if (curr.length === total) return checkBalanced(r, p, curr) ? simplifyCoeffs(curr) : null;
    if (depth > 0 && checkBalanced(r, p, [...curr, ...Array(total - curr.length).fill(1)])) return null;
    for (let i = 1; i <= max; i++) { const res = findSolution(r, p, max, [...curr, i], depth + 1); if (res) return res; }
    return null;
};

export const balanceEquation = (reactants: Molecule[], products: Molecule[]): { success: true; data: BalanceResult } | { success: false; error: BalanceError } => {
    const validators = [
        [!reactants.length, "Must have at least one reactant.", 'EMPTY_REACTANT'],
        [!products.length, "Must have at least one product.", 'EMPTY_PRODUCT'],
        [[...reactants, ...products].some(m => !m.parts.length), "All molecules must contain at least one element.", 'EMPTY_MOLECULE'],
        [reactants.length + products.length < 2, "Need at least two molecules.", 'INSUFFICIENT_MOLECULES']
    ];
    const fail = validators.find(v => v[0]);
    if (fail) return { success: false, error: { message: fail[1] as string, code: fail[2] as BalanceError['code'] } };

    const solution = findSolution(reactants, products, 12);
    if (!solution) return { success: false, error: { message: "Could not balance equation. Try a simpler equation.", code: 'UNBALANCEABLE' } };

    const fmt = (m: Molecule, i: number, o = 0) => `${solution[i + o] > 1 ? solution[i + o] : ''}${formatMolecule(m)}`;
    return { success: true, data: { coefficients: solution, balancedEquation: `${reactants.map((r, i) => fmt(r, i)).join(' + ')} → ${products.map((p, i) => fmt(p, i, reactants.length)).join(' + ')}`, steps: [{ text: "1. Set up system of equations:", type: 'info' }, { text: "2. Solved via integer search.", type: 'result' }] } };
};

const formatPart = (p: MoleculePart, sub = true): string => {
    const s = p.count > 1 ? (sub ? `<sub>${p.count}</sub>` : `${p.count}`) : '';
    return p.type === 'element' ? p.symbol + s : (p.parts.map(c => formatPart(c, sub)).join('') + (p.count > 1 ? `(${s})` : ''));
};

export const formatMolecule = (m: Molecule): string => m.parts.map(p => formatPart(p, true)).join('');
export const formatMoleculePlainText = (m: Molecule): string => m.parts.map(p => formatPart(p, false)).join('');
export const getMoleculeFormula = formatMoleculePlainText;
export const getMoleculeMass = (m: Molecule): number => calculateMolarMass(m).totalMass;

const yieldMult = { g: (m: number, mm: number) => m * mm, mol: (m: number) => m, molecules: (m: number) => m * AVOGADRO };
export const calculateYield = (limMoles: number, tCoeff: number, lCoeff: number, tMM: number, tUnit: Unit): number => 
    yieldMult[tUnit](limMoles * (tCoeff / lCoeff), tMM);
