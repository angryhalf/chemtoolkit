"use client";

import React, { useState, useCallback } from 'react';
import { Plus, ArrowDown, Trash2 } from 'lucide-react';
import { MoleculeBuilder } from '@/components/MoleculeBuilder';
import { StoichiometryGrid } from '@/components/StoichiometryGrid';
import { Molecule, formatMoleculePlainText, Unit } from '@/lib/chemistryEngine';
import { createEmptyMolecule } from '@/lib/utils';
import { usePageConfig, usePageTheme } from '@/lib/usePageConfig';

const createEmptyMoleculeLocal = (): Molecule => createEmptyMolecule();

interface StoichResult {
    reactants: Molecule[];
    products: Molecule[];
}

export default function StoichiometryPage() {
    const pageConfig = usePageConfig();
    const theme = usePageTheme(pageConfig);
    const [stoichReactants, setStoichReactants] = useState<Molecule[]>([createEmptyMoleculeLocal()]);
    const [stoichProducts, setStoichProducts] = useState<Molecule[]>([createEmptyMoleculeLocal()]);

    const [knownMolIdx, setKnownMolIdx] = useState(0);
    const [knownValue, setKnownValue] = useState(10);
    const [knownUnit, setKnownUnit] = useState<Unit>('g');

    const [targetMolIdx, setTargetMolIdx] = useState(1);
    const [targetUnit, setTargetUnit] = useState<Unit>('g');

    const [stoichResult, setStoichResult] = useState<StoichResult | null>(null);

    const handleStoich = useCallback(() => {
        setStoichResult({
            reactants: stoichReactants,
            products: stoichProducts,
        });
    }, [stoichReactants, stoichProducts]);

    const updateMolList = useCallback((list: Molecule[], index: number, newMol: Molecule, setter: React.Dispatch<React.SetStateAction<Molecule[]>>) => {
        const newList = [...list];
        newList[index] = newMol;
        setter(newList);
    }, []);

    const addMolecule = useCallback((list: Molecule[], setter: React.Dispatch<React.SetStateAction<Molecule[]>>) => {
        setter([...list, createEmptyMoleculeLocal()]);
    }, []);

    const removeMolecule = useCallback((list: Molecule[], index: number, setter: React.Dispatch<React.SetStateAction<Molecule[]>>) => {
        if (list.length > 1) {
            setter(list.filter((_, i) => i !== index));
        }
    }, []);

    const allMolecules = [...stoichReactants, ...stoichProducts];

    const getCoefficients = useCallback(() => {
        const reactantCoeffs = stoichReactants.map(m => m.count);
        const productCoeffs = stoichProducts.map(m => m.count);
        return [...reactantCoeffs, ...productCoeffs];
    }, [stoichReactants, stoichProducts]);

    return (
        <div className="p-6 lg:p-10 space-y-6 max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                    {pageConfig && (
                        <div className={`p-2 ${theme.iconBg} ${theme.iconColor} rounded-lg`}>
                            <pageConfig.icon size={24} />
                        </div>
                    )}
                    <h2 className="text-xl font-semibold text-slate-800">
                        {pageConfig?.title || 'Stoichiometry Calculator'}
                    </h2>
                </div>

                {/* Reactants */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-500 mb-2">Reactants</label>
                    <div className="space-y-4">
                        {stoichReactants.map((mol, idx) => (
                            <div key={mol.id} className="relative">
                                {stoichReactants.length > 1 && (
                                    <button
                                        onClick={() => removeMolecule(stoichReactants, idx, setStoichReactants)}
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
                        ))}
                    </div>
                    <button
                        onClick={() => addMolecule(stoichReactants, setStoichReactants)}
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
                            <div key={mol.id} className="relative">
                                {stoichProducts.length > 1 && (
                                    <button
                                        onClick={() => removeMolecule(stoichProducts, idx, setStoichProducts)}
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
                        ))}
                    </div>
                    <button
                        onClick={() => addMolecule(stoichProducts, setStoichProducts)}
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
                                onChange={e => setKnownUnit(e.target.value as Unit)}
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
                                onChange={e => setTargetUnit(e.target.value as Unit)}
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
                            className={`px-6 py-2 text-white rounded-lg transition shadow-sm flex items-center gap-2 ${theme.buttonBg} ${theme.buttonHover}`}
                        >
                            {pageConfig && <pageConfig.icon size={18} />} Calculate Stoichiometry
                        </button>
                    </div>
                </div>
            </div>

            {stoichResult && (
                <StoichiometryGrid
                    reactants={stoichResult.reactants}
                    products={stoichResult.products}
                    coefficients={getCoefficients()}
                    knownMolIndex={knownMolIdx}
                    knownValue={knownValue}
                    knownUnit={knownUnit}
                    targetMolIndex={targetMolIdx}
                    targetUnit={targetUnit}
                />
            )}
        </div>
    );
}
