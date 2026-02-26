"use client";

import React, { useState } from 'react';
import { Plus, ArrowDown, Trash2, Sigma } from 'lucide-react';
import { MoleculeBuilder } from '@/components/MoleculeBuilder';
import { StoichiometryGrid } from '@/components/StoichiometryGrid';
import { Molecule, formatMoleculePlainText } from '@/lib/chemistryEngine';

const createEmptyMolecule = (): Molecule => ({ id: Math.random().toString(36).substr(2, 9), parts: [] });

export default function StoichiometryPage() {
    const [stoichReactants, setStoichReactants] = useState<Molecule[]>([createEmptyMolecule()]);
    const [stoichProducts, setStoichProducts] = useState<Molecule[]>([createEmptyMolecule()]);

    // State for Coefficients
    const [reactantCoeffs, setReactantCoeffs] = useState<number[]>([1]);
    const [productCoeffs, setProductCoeffs] = useState<number[]>([1]);

    // State for Inputs
    const [knownMolIdx, setKnownMolIdx] = useState(0);
    const [knownValue, setKnownValue] = useState(10);
    const [knownUnit, setKnownUnit] = useState<'g' | 'mol' | 'molecules'>('g');

    const [targetMolIdx, setTargetMolIdx] = useState(1);
    const [targetUnit, setTargetUnit] = useState<'g' | 'mol' | 'molecules'>('g');

    const [stoichResult, setStoichResult] = useState<any>(null);

    // --- Updated Handlers ---

    const handleStoich = () => {
        // Simply use the user-provided coefficients
        const allCoeffs = [...reactantCoeffs, ...productCoeffs];

        setStoichResult({
            coefficients: allCoeffs,
            reactants: stoichReactants,
            products: stoichProducts,
        });
    };

    const updateMolList = (list: Molecule[], index: number, newMol: Molecule, setter: Function) => {
        const newList = [...list];
        newList[index] = newMol;
        setter(newList);
    };

    const updateCoeffList = (list: number[], index: number, value: string, setter: Function) => {
        const newList = [...list];
        const parsed = parseInt(value);
        newList[index] = isNaN(parsed) || parsed < 1 ? 1 : parsed; // Default to 1 if invalid
        setter(newList);
    };

    const addMolecule = (list: Molecule[], setter: Function, coeffList: number[], coeffSetter: Function) => {
        setter([...list, createEmptyMolecule()]);
        coeffSetter([...coeffList, 1]); // Add default coeff 1
    };

    const removeMolecule = (list: Molecule[], index: number, setter: Function, coeffList: number[], coeffSetter: Function) => {
        if (list.length > 1) {
            setter(list.filter((_, i) => i !== index));
            coeffSetter(coeffList.filter((_, i) => i !== index));
        }
    };

    // Recalculate dropdown options
    const allMolecules = [...stoichReactants, ...stoichProducts];

    return (
        <div className="p-6 lg:p-10 space-y-6 max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold mb-4 text-slate-800">Stoichiometry Calculator</h2>

                {/* Reactants */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-500 mb-2">Reactants</label>
                    <div className="space-y-4">
                        {stoichReactants.map((mol, idx) => (
                            <div key={mol.id} className="relative flex items-center gap-2">
                                {/* Coefficient Input */}
                                <input
                                    type="number"
                                    min="1"
                                    value={reactantCoeffs[idx]}
                                    onChange={(e) => updateCoeffList(reactantCoeffs, idx, e.target.value, setReactantCoeffs)}
                                    className="w-12 text-center px-2 py-2 border border-slate-200 rounded-lg shadow-sm text-sm font-bold text-slate-600 bg-slate-50 focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                                />

                                <div className="flex-1 relative">
                                    {stoichReactants.length > 1 && (
                                        <button
                                            onClick={() => removeMolecule(stoichReactants, idx, setStoichReactants, reactantCoeffs, setReactantCoeffs)}
                                            className="absolute -left-8 top-3 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors shadow-sm"
                                            title="Remove Reactant"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                        <MoleculeBuilder molecule={mol} onChange={(m) => updateMolList(stoichReactants, idx, m, setStoichReactants)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => addMolecule(stoichReactants, setStoichReactants, reactantCoeffs, setReactantCoeffs)}
                        className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                        <Plus size={14} /> Add Reactant
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 my-4">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <ArrowDown className="text-slate-400" />
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Products */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-500 mb-2">Products</label>
                    <div className="space-y-4">
                        {stoichProducts.map((mol, idx) => (
                            <div key={mol.id} className="relative flex items-center gap-2">
                                {/* Coefficient Input */}
                                <input
                                    type="number"
                                    min="1"
                                    value={productCoeffs[idx]}
                                    onChange={(e) => updateCoeffList(productCoeffs, idx, e.target.value, setProductCoeffs)}
                                    className="w-12 text-center px-2 py-2 border border-slate-200 rounded-lg shadow-sm text-sm font-bold text-slate-600 bg-slate-50 focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                                />

                                <div className="flex-1 relative">
                                    {stoichProducts.length > 1 && (
                                        <button
                                            onClick={() => removeMolecule(stoichProducts, idx, setStoichProducts, productCoeffs, setProductCoeffs)}
                                            className="absolute -left-8 top-3 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors shadow-sm"
                                            title="Remove Product"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                        <MoleculeBuilder molecule={mol} onChange={(m) => updateMolList(stoichProducts, idx, m, setStoichProducts)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => addMolecule(stoichProducts, setStoichProducts, productCoeffs, setProductCoeffs)}
                        className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                        <Plus size={14} /> Add Product
                    </button>
                </div>

                {/* Controls */}
                <div className="border-t border-slate-100 pt-6 space-y-4">
                    <div className="flex flex-col gap-6">

                        {/* Given Row */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-slate-700 w-16">Given:</span>
                            <input
                                type="number"
                                value={knownValue}
                                onChange={e => setKnownValue(parseFloat(e.target.value) || 0)}
                                className="w-28 px-3 py-2 border border-slate-200 rounded-lg shadow-sm"
                            />
                            <select
                                value={knownUnit}
                                onChange={e => setKnownUnit(e.target.value as any)}
                                className="px-3 py-2 border border-slate-200 rounded-lg shadow-sm bg-white"
                            >
                                <option value="g">grams (g)</option>
                                <option value="mol">moles (mol)</option>
                                <option value="molecules">molecules</option>
                            </select>

                            <span className="text-sm text-slate-500">of</span>

                            <select
                                value={knownMolIdx}
                                onChange={e => setKnownMolIdx(parseInt(e.target.value))}
                                className="px-3 py-2 border border-slate-200 rounded-lg shadow-sm bg-white flex-grow min-w-[150px]"
                            >
                                {allMolecules.map((m, i) => (
                                    <option key={i} value={i}>
                                        {formatMoleculePlainText(m) || `Molecule ${i + 1}`} ({i < stoichReactants.length ? 'Reactant' : 'Product'})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Find Row */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-slate-700 w-16">Find:</span>

                            <select
                                value={targetUnit}
                                onChange={e => setTargetUnit(e.target.value as any)}
                                className="px-3 py-2 border border-slate-200 rounded-lg shadow-sm bg-white"
                            >
                                <option value="g">grams (g)</option>
                                <option value="mol">moles (mol)</option>
                                <option value="molecules">molecules</option>
                            </select>

                            <span className="text-sm text-slate-500">of</span>

                            <select
                                value={targetMolIdx}
                                onChange={e => setTargetMolIdx(parseInt(e.target.value))}
                                className="px-3 py-2 border border-slate-200 rounded-lg shadow-sm bg-white flex-grow min-w-[150px]"
                            >
                                {allMolecules.map((m, i) => (
                                    <option key={i} value={i}>
                                        {formatMoleculePlainText(m) || `Molecule ${i + 1}`} ({i < stoichReactants.length ? 'Reactant' : 'Product'})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleStoich}
                            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition shadow-sm flex items-center gap-2"
                        >
                            <Sigma size={18} /> Calculate Stoichiometry
                        </button>
                    </div>
                </div>
            </div>

            {stoichResult && (
                <StoichiometryGrid
                    reactants={stoichResult.reactants}
                    products={stoichResult.products}
                    coefficients={stoichResult.coefficients}
                    knownMolIndex={knownMolIdx}
                    knownValue={knownValue}
                    knownUnit={knownUnit}
                    knownIsReactant={knownMolIdx < stoichReactants.length}
                    targetMolIndex={targetMolIdx}
                    targetUnit={targetUnit}
                    targetIsReactant={targetMolIdx < stoichReactants.length}
                />
            )}
        </div>
    );
}