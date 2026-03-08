"use client";

import React from 'react';
import { Molecule, formatMolecule, calculateMolarMass, Unit } from '@/lib/chemistryEngine';
import { AVOGADRO } from '@/lib/utils';
import { convertToMoles, formatScientific } from '@/lib/utils';
import { Formula } from '@/components/Formula';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface ReactantInput {
    mol: Molecule;
    coeff: number;
    value: number;
    unit: Unit;
}

interface LimitingReactantResultsProps {
    reactants: ReactantInput[];
    products: { mol: Molecule; coeff: number }[];
    targetProductIndex: number;
    targetUnit: Unit;
}

export const LimitingReactantResults: React.FC<LimitingReactantResultsProps> = ({
    reactants,
    products,
    targetProductIndex,
    targetUnit,
}) => {
    const reactantData = reactants.map((r) => {
        const mm = calculateMolarMass(r.mol).totalMass;
        const moles = convertToMoles(r.value, r.unit, mm);
        const ratio = moles / r.coeff;
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
    const targetMM = calculateMolarMass(target.mol).totalMass;
    const targetFormulaHtml = formatMolecule(target.mol);

    const molesOfProduct = limitingReactant.moles * (target.coeff / limitingReactant.coeff);

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

    return (
        <div className="space-y-6">
            {/* Comparison Table */}
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
                                    <td className="px-4 py-3">{r.coeff}</td>
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

            {/* Theoretical Yield Result */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Theoretical Yield</h3>

                <div className="bg-slate-50 p-4 rounded-lg mb-4 font-mono text-sm border border-slate-100 space-y-2">
                    <div><strong>Limiting Reactant:</strong> <Formula html={limitingReactant.formulaHtml} /> ({limitingReactant.moles.toFixed(4)} mol)</div>
                    <div><strong>Reaction Ratio:</strong> {limitingReactant.coeff} mol <Formula html={limitingReactant.formulaHtml} /> → {target.coeff} mol <Formula html={targetFormulaHtml} /></div>
                    <div><strong>Moles Produced:</strong> {molesOfProduct.toFixed(4)} mol</div>
                </div>

                {/* Single Result Box based on selected unit */}
                <div className="p-6 bg-gradient-to-r from-rose-50 to-orange-50 rounded-lg border border-rose-200 text-center">
                    <span className="text-sm text-slate-500 block mb-1">
                        Final Answer
                    </span>
                    <span className="text-3xl font-bold text-slate-800">
                        {targetUnit === 'molecules' ? formatScientific(displayValue as number) : (displayValue as number).toFixed(3)} {unitLabel}
                    </span>
                    <span className="text-xl font-bold text-slate-700 ml-1">
                        <Formula html={targetFormulaHtml} />
                    </span>
                </div>
            </div>
        </div>
    );
};
