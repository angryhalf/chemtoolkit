import { Molecule, MoleculePart } from './chemistryEngine';

export const AVOGADRO = 6.02214076e23;
export type Unit = 'g' | 'mol' | 'molecules';
export const UNITS: { value: Unit; label: string }[] = [
    { value: 'g', label: 'grams (g)' },
    { value: 'mol', label: 'moles (mol)' },
    { value: 'molecules', label: 'molecules' },
];

export const generateId = (): string => crypto.randomUUID();
export const createEmptyMolecule = (): Molecule => ({ id: crypto.randomUUID(), parts: [] });
export const createMoleculeFromParts = (parts: MoleculePart[]): Molecule => ({ id: crypto.randomUUID(), parts });

const unitToMoles = { g: (v: number, m: number) => v / m, mol: (v: number) => v, molecules: (v: number) => v / AVOGADRO };
const unitFromMoles = { g: (v: number, m: number) => v * m, mol: (v: number) => v, molecules: (v: number) => v * AVOGADRO };

export const convertToMoles = (value: number, unit: Unit, molarMass: number): number => unitToMoles[unit](value, molarMass);
export const convertFromMoles = (moles: number, unit: Unit, molarMass: number): number => unitFromMoles[unit](moles, molarMass);

export const formatScientific = (num: number): string => {
    if (num === 0) return "0";
    const [c, e] = num.toExponential(3).split('e');
    return `${c} × 10^${parseInt(e, 10)}`;
};

export const isValidElementSymbol = (symbol: string): boolean => /^[A-Z][a-z]?$/.test(symbol);
export const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

export const validateMolecule = (molecule: Molecule): { valid: boolean; error?: string } => {
    const parts = molecule.parts;
    if (!parts?.length) return { valid: false, error: 'Molecule must contain at least one element' };
    const invalid = parts.some(p => p.type === 'element' ? !p.symbol || p.count < 1 : !p.parts?.length || p.parts.some(c => c.type === 'element' && (!c.symbol || c.count < 1)));
    return invalid ? { valid: false, error: 'Invalid element in molecule' } : { valid: true };
};
