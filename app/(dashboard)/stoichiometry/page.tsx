"use client";

import React, { useState } from 'react';
import { Plus, ArrowRight, Trash2, Sigma } from 'lucide-react';
import { MoleculeBuilder } from '@/components/MoleculeBuilder';
import { StoichiometryGrid } from '@/components/StoichiometryGrid';
// Updated import to include formatMoleculePlainText
import { Molecule, formatMoleculePlainText, balanceEquation } from '@/lib/chemistryEngine';

const createEmptyMolecule = (): Molecule => ({ id: Math.random().toString(36).substr(2, 9), parts: [] });

export default function StoichiometryPage() {
    const [stoichReactants, setStoichReactants] = useState<Molecule[]>([createEmptyMolecule()]);
    const [stoichProducts, setStoichProducts] = useState<Molecule[]>([createEmptyMolecule()]);
    const [knownMolIdx, setKnownMolIdx] = useState(0);
    const [knownMass, setKnownMass] = useState(10);
    const [targetMolIdx, setTargetMolIdx] = useState(1);
    const [stoichResult, setStoichResult] = useState<any>(null);

    const handleStoich = () => {
        const res = balanceEquation(stoichReactants, stoichProducts);
        if (res instanceof Error) {
            alert(res.message);
            return;
        }
        setStoichResult({
            coefficients: res.coefficients,
            reactants: stoichReactants,
            products: stoichProducts,
        });
    };

    const updateMolList = (list: Molecule[], index: number, newMol: Molecule, setter: Function) => {
        const newList = [...list];
        newList[index] = newMol;
        setter(newList);
    };

    const addMolecule = (list: Molecule[], setter: Function) => setter([...list, createEmptyMolecule()]);

    const removeMolecule = (list: Molecule[], index: number, setter: Function) => {
        if (list.length > 1) setter(list.filter((_, i) => i !== index));
    };

    return (
        <div className="p-6 lg:p-10 space-y-6 max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold mb-4 text-slate-800">Stoichiometry Calculator</h2>

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
                    <ArrowRight className="text-slate-400" />
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
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-slate-700">Given:</span>
                            <input
                                type="number"
                                value={knownMass}
                                onChange={e => setKnownMass(parseFloat(e.target.value) || 0)}
                                className="w-24 px-3 py-2 border border-slate-200 rounded-lg shadow-sm"
                            />
                            <span className="text-sm text-slate-500">grams of</span>

                            {/* Fixed: Using formatMoleculePlainText for dropdown options */}
                            <select
                                value={knownMolIdx}
                                onChange={e => setKnownMolIdx(parseInt(e.target.value))}
                                className="px-3 py-2 border border-slate-200 rounded-lg shadow-sm bg-white"
                            >
                                {[...stoichReactants, ...stoichProducts].map((m, i) => (
                                    <option key={i} value={i}>
                                        {formatMoleculePlainText(m) || `Molecule ${i + 1}`} ({i < stoichReactants.length ? 'Reactant' : 'Product'})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-slate-700">Find:</span>

                            {/* Fixed: Using formatMoleculePlainText for dropdown options */}
                            <select
                                value={targetMolIdx}
                                onChange={e => setTargetMolIdx(parseInt(e.target.value))}
                                className="px-3 py-2 border border-slate-200 rounded-lg shadow-sm bg-white"
                            >
                                {[...stoichReactants, ...stoichProducts].map((m, i) => (
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
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
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
                    knownValue={knownMass}
                    knownIsReactant={knownMolIdx < stoichReactants.length}
                    targetMolIndex={targetMolIdx}
                    targetIsReactant={targetMolIdx < stoichReactants.length}
                />
            )}
        </div>
    );
}