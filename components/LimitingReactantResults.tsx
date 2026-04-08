"use client";

import React from 'react';
import { Molecule, formatMolecule, calculateMolarMass, Unit } from '@/lib/chemistryEngine';
import { AVOGADRO } from '@/lib/utils';
import { convertToMoles } from '@/lib/utils';
import { Formula } from '@/components/Formula';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useSigFigs } from '@/lib/SigFigContext';
import { parseSigFigsFromInput } from '@/lib/sigfigs';

interface ReactantInput {
    mol: Molecule;
    value: number;
    unit: Unit;
}

interface LimitingReactantResultsProps {
    reactants: ReactantInput[];
    products: Molecule[];
    targetProductIndex: number;
    targetUnit: Unit;
}

export const LimitingReactantResults: React.FC<LimitingReactantResultsProps> = ({
    reactants,
    products,
    targetProductIndex,
    targetUnit,
}) => {
    const { settings, resolveSigFigs } = useSigFigs();

    const reactantData = reactants.map((r) => {
        const mm = calculateMolarMass(r.mol).totalMass;
        const moles = convertToMoles(r.value, r.unit, mm);
        const ratio = moles / r.mol.count;
        return {
            ...r,
            molarMass: mm,
            moles,
            ratio,
            formulaHtml: formatMolecule(r.mol),
        };
    });

    reactantData.sort((a, b) => a.ratio - b.ratio);
    const limitingReactant = reactantData[0];

    const target = products[targetProductIndex];
    const targetMM = calculateMolarMass(target).totalMass;
    const targetFormulaHtml = formatMolecule(target);

    const molesOfProduct = limitingReactant.moles * (target.count / limitingReactant.mol.count);

    let displayValue: number | React.ReactNode = 0;
    let unitLabel = '';

    if (targetUnit === 'mol') {
        displayValue = molesOfProduct;
        unitLabel = 'mol';
    } else if (targetUnit === 'g') {
        displayValue = molesOfProduct * targetMM;
        unitLabel = 'g';
    } else {
        displayValue = molesOfProduct * AVOGADRO;
        unitLabel = 'molecules';
    }

    const allSigFigs = reactants.map(r => parseSigFigsFromInput(r.value.toString()).sigFigs).filter(s => s > 0);
    const calcSigFigs = resolveSigFigs(allSigFigs.length > 0 ? Math.min(...allSigFigs) : 3);

    const formatValue = (val: number) => {
        if (settings.mode === 'disabled') {
            return val.toFixed(3);
        }
        if (targetUnit === 'molecules') {
            return val.toExponential(calcSigFigs - 1);
        }
        const absVal = Math.abs(val);
        const useScientific = absVal >= 1e6 || (absVal < 1e-3 && absVal !== 0);
        if (useScientific) {
            return val.toExponential(calcSigFigs - 1);
        }
        const d = Math.ceil(Math.log10(absVal));
        const decimals = Math.max(0, calcSigFigs - d);
        return val.toFixed(decimals);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Reactant Comparison</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th className="px-4 py-3">Reactant</th>
                                <th className="px-4 py-3">Moles</th>
                                <th className="px-4 py-3">Coefficient</th>
                                <th className="px-4 py-3 font-bold">Moles / Coeff</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reactantData.map((r, i) => (
                                <tr key={i} className={`border-b ${i === 0 ? 'bg-rose-50' : 'bg-white'}`}>
                                    <td className="px-4 py-3 font-medium">
                                        <Formula html={r.formulaHtml} />
                                    </td>
                                    <td className="px-4 py-3 font-mono">{r.moles.toFixed(4)}</td>
                                    <td className="px-4 py-3">{r.mol.count}</td>
                                    <td className="px-4 py-3 font-bold text-slate-800">{r.ratio.toFixed(4)}</td>
                                    <td className="px-4 py-3">
                                        {i === 0 ? (
                                            <span className="flex items-center gap-1 text-rose-600 font-semibold">
                                                <AlertTriangle size={14} /> Limiting
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-green-600">
                                                <CheckCircle size={14} /> Excess
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    * The reactant with the smallest &quot;Moles / Coeff&quot; ratio is the limiting reactant.
                </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Theoretical Yield</h3>

                <div className="bg-slate-50 p-4 rounded-lg mb-4 font-mono text-sm border border-slate-100 space-y-2">
                    <div><strong>Limiting Reactant:</strong> <Formula html={limitingReactant.formulaHtml} /> ({limitingReactant.moles.toFixed(4)} mol)</div>
                    <div><strong>Reaction Ratio:</strong> {limitingReactant.mol.count} mol <Formula html={limitingReactant.formulaHtml} /> → {target.count} mol <Formula html={targetFormulaHtml} /></div>
                    <div><strong>Moles Produced:</strong> {molesOfProduct.toFixed(4)} mol</div>
                </div>

                <div className="p-6 bg-gradient-to-r from-rose-50 to-orange-50 rounded-lg border border-rose-200 text-center">
                    <div className="mb-3 flex justify-center">
                        <SigFigSelector compact />
                    </div>
                    <span className="text-sm text-slate-500 block mb-1">
                        Final Answer
                    </span>
                    <span className="text-3xl font-bold text-slate-800">
                        {targetUnit === 'molecules' ? formatValue(displayValue as number) : formatValue(displayValue as number)} {unitLabel}
                    </span>
                    <span className="text-xl font-bold text-slate-700 ml-1">
                        <Formula html={targetFormulaHtml} />
                    </span>
                    {settings.mode !== 'disabled' && (
                        <span className="text-xs text-slate-400 ml-2 block mt-1">({calcSigFigs} sig figs)</span>
                    )}
                </div>
            </div>
        </div>
    );
};
