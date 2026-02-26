"use client";

import React, { useState } from 'react';
import { Plus, ArrowRight, Trash2, Scale } from 'lucide-react';
import { MoleculeBuilder } from '@/components/MoleculeBuilder';
import { Molecule, formatMolecule, balanceEquation } from '@/lib/chemistryEngine';

const createEmptyMolecule = (): Molecule => ({ id: Math.random().toString(36).substr(2, 9), parts: [] });

export default function BalancerPage() {
    const [reactants, setReactants] = useState<Molecule[]>([createEmptyMolecule()]);
    const [products, setProducts] = useState<Molecule[]>([createEmptyMolecule()]);

    // Add state for coefficients
    const [reactantCoeffs, setReactantCoeffs] = useState<number[]>([1]);
    const [productCoeffs, setProductCoeffs] = useState<number[]>([1]);

    const [balanceError, setBalanceError] = useState<string | null>(null);

    const handleBalance = () => {
        setBalanceError(null);
        const res = balanceEquation(reactants, products);
        if (res instanceof Error) {
            setBalanceError(res.message);
        } else {
            // Update state with calculated coefficients
            const newReactantCoeffs = res.coefficients.slice(0, reactants.length);
            const newProductCoeffs = res.coefficients.slice(reactants.length);

            setReactantCoeffs(newReactantCoeffs);
            setProductCoeffs(newProductCoeffs);
        }
    };

    const updateMolList = (list: Molecule[], index: number, newMol: Molecule, setter: Function) => {
        const newList = [...list];
        newList[index] = newMol;
        setter(newList);
    };

    const updateCoeffList = (list: number[], index: number, value: string, setter: Function) => {
        const newList = [...list];
        const parsed = parseInt(value);
        newList[index] = isNaN(parsed) || parsed < 1 ? 1 : parsed;
        setter(newList);
    };

    const addMolecule = (list: Molecule[], setter: Function, coeffList: number[], coeffSetter: Function) => {
        setter([...list, createEmptyMolecule()]);
        coeffSetter([...coeffList, 1]);
    };

    const removeMolecule = (list: Molecule[], index: number, setter: Function, coeffList: number[], coeffSetter: Function) => {
        if (list.length > 1) {
            setter(list.filter((_, i) => i !== index));
            coeffSetter(coeffList.filter((_, i) => i !== index));
        }
    };

    return (
        <div className="p-6 lg:p-10 space-y-6 max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold mb-4 text-slate-800">Equation Balancer</h2>

                {/* Reactants */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-500 mb-2">Reactants</label>
                    <div className="space-y-4">
                        {reactants.map((mol, idx) => (
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
                                    {reactants.length > 1 && (
                                        <button
                                            onClick={() => removeMolecule(reactants, idx, setReactants, reactantCoeffs, setReactantCoeffs)}
                                            className="absolute -left-8 top-3 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors shadow-sm"
                                            title="Remove Reactant"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                        <MoleculeBuilder molecule={mol} onChange={(m) => updateMolList(reactants, idx, m, setReactants)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => addMolecule(reactants, setReactants, reactantCoeffs, setReactantCoeffs)}
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
                        {products.map((mol, idx) => (
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
                                    {products.length > 1 && (
                                        <button
                                            onClick={() => removeMolecule(products, idx, setProducts, productCoeffs, setProductCoeffs)}
                                            className="absolute -left-8 top-3 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors shadow-sm"
                                            title="Remove Product"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                        <MoleculeBuilder molecule={mol} onChange={(m) => updateMolList(products, idx, m, setProducts)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => addMolecule(products, setProducts, productCoeffs, setProductCoeffs)}
                        className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                        <Plus size={14} /> Add Product
                    </button>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleBalance}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
                    >
                        <Scale size={18} /> Balance Equation
                    </button>
                </div>
            </div>

            {balanceError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
                    {balanceError}
                </div>
            )}

            {!balanceError && reactantCoeffs.some(c => c > 1) && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-700 mb-4 text-xl">Balanced Equation</h3>
                    <div className="bg-slate-50 p-4 rounded-lg text-center text-2xl font-mono text-slate-800 border border-slate-100 overflow-x-auto whitespace-nowrap">
                        {/* Render formatted equation using the state coefficients */}
                        <span className="mr-2">
                            {reactants.map((mol, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && <span className="text-slate-400 mx-2">+</span>}
                                    <span className="font-bold text-blue-700">{reactantCoeffs[i] > 1 ? reactantCoeffs[i] : ''}</span>
                                    <span dangerouslySetInnerHTML={{ __html: formatMolecule(mol) }} />
                                </React.Fragment>
                            ))}
                        </span>
                        <span className="text-slate-400 mx-4">→</span>
                        <span>
                            {products.map((mol, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && <span className="text-slate-400 mx-2">+</span>}
                                    <span className="font-bold text-teal-700">{productCoeffs[i] > 1 ? productCoeffs[i] : ''}</span>
                                    <span dangerouslySetInnerHTML={{ __html: formatMolecule(mol) }} />
                                </React.Fragment>
                            ))}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}