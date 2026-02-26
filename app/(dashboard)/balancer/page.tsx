"use client";

import React, { useState } from 'react';
import { Plus, ArrowDown, Trash2, Scale } from 'lucide-react';
import { MoleculeBuilder } from '@/components/MoleculeBuilder';
import { Molecule, formatMolecule, balanceEquation } from '@/lib/chemistryEngine';

const createEmptyMolecule = (): Molecule => ({ id: Math.random().toString(36).substr(2, 9), parts: [] });

export default function BalancerPage() {
    const [reactants, setReactants] = useState<Molecule[]>([createEmptyMolecule()]);
    const [products, setProducts] = useState<Molecule[]>([createEmptyMolecule()]);
    const [balanceResult, setBalanceResult] = useState<{ equation: string; steps: string[] } | null>(null);
    const [balanceError, setBalanceError] = useState<string | null>(null);

    const handleBalance = () => {
        setBalanceError(null);
        setBalanceResult(null);
        const res = balanceEquation(reactants, products);
        if (res instanceof Error) {
            setBalanceError(res.message);
        } else {
            setBalanceResult({ equation: res.balancedEquation, steps: res.steps });
        }
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
                <h2 className="text-xl font-semibold mb-4 text-slate-800">Equation Balancer</h2>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-500 mb-2">Reactants</label>
                    <div className="space-y-4">
                        {reactants.map((mol, idx) => (
                            // ... inside the reactants.map loop ...
                            <div key={mol.id} className="relative">
                                {reactants.length > 1 && (
                                    <button
                                        onClick={() => removeMolecule(reactants, idx, setReactants)}
                                        className="absolute -left-8 top-3 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors shadow-sm"
                                        title="Remove Reactant"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                                {/* ... MoleculeBuilder ... */}
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                    <MoleculeBuilder molecule={mol} onChange={(m) => updateMolList(reactants, idx, m, setReactants)} />
                                </div>
                                {idx < reactants.length - 1 && <div className="text-center py-2 font-bold text-slate-400">+</div>}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => addMolecule(reactants, setReactants)} className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1">
                        <Plus size={14} /> Add Reactant
                    </button>
                </div>

                <div className="flex items-center gap-4 my-4">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <ArrowDown className="text-slate-400" />
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-500 mb-2">Products</label>
                    <div className="space-y-4">
                        {products.map((mol, idx) => (
                            // ... inside the products.map loop ...
                            <div key={mol.id} className="relative">
                                {products.length > 1 && (
                                    <button
                                        onClick={() => removeMolecule(products, idx, setProducts)}
                                        className="absolute -left-8 top-3 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors shadow-sm"
                                        title="Remove Product"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                    <MoleculeBuilder molecule={mol} onChange={(m) => updateMolList(products, idx, m, setProducts)} />
                                </div>
                                {idx < products.length - 1 && <div className="text-center py-2 font-bold text-slate-400">+</div>}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => addMolecule(products, setProducts)} className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1">
                        <Plus size={14} /> Add Product
                    </button>
                </div>

                <div className="flex justify-end">
                    <button onClick={handleBalance} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2">
                        <Scale size={18} /> Balance Equation
                    </button>
                </div>
            </div>

            {balanceError && <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">{balanceError}</div>}

            {balanceResult && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-4 text-xl">Balanced Equation</h3>
                    <div className="bg-slate-50 p-4 rounded-lg text-center text-2xl font-mono text-slate-800 mb-6 border border-slate-100 overflow-x-auto whitespace-nowrap">
                        <span dangerouslySetInnerHTML={{ __html: balanceResult.equation }} />
                    </div>
                    <h3 className="font-bold text-slate-700 mb-2">Solution Logic</h3>
                    <div className="bg-slate-50 p-4 rounded-lg font-mono text-xs text-slate-600 space-y-1 border border-slate-100">
                        {balanceResult.steps.map((s, i) => <div key={i}>{s}</div>)}
                    </div>
                </div>
            )}
        </div>
    );
}