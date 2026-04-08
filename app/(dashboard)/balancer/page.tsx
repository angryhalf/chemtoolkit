"use client";

import React, { useState, useCallback } from 'react';
import { Plus, ArrowDown, Trash2 } from 'lucide-react';
import { MoleculeBuilder } from '@/components/MoleculeBuilder';
import { Molecule, formatMolecule, balanceEquation } from '@/lib/chemistryEngine';
import { createEmptyMolecule } from '@/lib/utils';
import { usePageConfig, usePageTheme } from '@/lib/usePageConfig';

export default function BalancerPage() {
    const pageConfig = usePageConfig();
    const theme = usePageTheme(pageConfig);
    const [reactants, setReactants] = useState<Molecule[]>([createEmptyMolecule()]);
    const [products, setProducts] = useState<Molecule[]>([createEmptyMolecule()]);

    const [balanceError, setBalanceError] = useState<string | null>(null);
    const [balancedResult, setBalancedResult] = useState<{ reactants: Molecule[]; products: Molecule[]; coefficients: number[] } | null>(null);

    const handleBalance = useCallback(() => {
        setBalanceError(null);
        const hasEmptyMolecule = [...reactants, ...products].some(m => m.parts.length === 0);
        if (hasEmptyMolecule) {
            setBalanceError("Please add at least one element to each molecule.");
            return;
        }
        
        const result = balanceEquation(reactants, products);
        
        if (!result.success) {
            setBalanceError(result.error.message);
            setBalancedResult(null);
        } else {
            const res = result.data;
            setBalancedResult({
                reactants,
                products,
                coefficients: res.coefficients
            });
        }
    }, [reactants, products]);

    const updateMolList = useCallback((list: Molecule[], index: number, newMol: Molecule, setter: React.Dispatch<React.SetStateAction<Molecule[]>>) => {
        const newList = [...list];
        newList[index] = newMol;
        setter(newList);
    }, []);

    const addMolecule = useCallback((list: Molecule[], setter: React.Dispatch<React.SetStateAction<Molecule[]>>) => {
        setter([...list, createEmptyMolecule()]);
    }, []);

    const removeMolecule = useCallback((list: Molecule[], index: number, setter: React.Dispatch<React.SetStateAction<Molecule[]>>) => {
        if (list.length > 1) {
            setter(list.filter((_, i) => i !== index));
        }
    }, []);

    const getReactantCoeffs = () => {
        if (!balancedResult) return [];
        return balancedResult.coefficients.slice(0, reactants.length);
    };

    const getProductCoeffs = () => {
        if (!balancedResult) return [];
        return balancedResult.coefficients.slice(reactants.length);
    };

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
                        {pageConfig?.title || 'Equation Balancer'}
                    </h2>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-500 mb-2">Reactants</label>
                    <div className="space-y-4">
                        {reactants.map((mol, idx) => (
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
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                    <MoleculeBuilder molecule={mol} onChange={(m) => updateMolList(reactants, idx, m, setReactants)} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => addMolecule(reactants, setReactants)}
                        className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
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
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => addMolecule(products, setProducts)}
                        className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                        <Plus size={14} /> Add Product
                    </button>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleBalance}
                        className={`px-6 py-2 text-white rounded-lg transition shadow-sm flex items-center gap-2 ${theme.buttonBg} ${theme.buttonHover}`}
                    >
                        {pageConfig && <pageConfig.icon size={18} />} Balance Equation
                    </button>
                </div>
            </div>

            {balanceError && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
                    {balanceError}
                </div>
            )}

            {balancedResult && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className={`font-bold mb-4 text-xl ${theme.textColor}`}>Balanced Equation</h3>
                    <div className={`bg-slate-50 p-4 rounded-lg text-center text-2xl font-mono text-slate-800 border border-slate-100 overflow-x-auto whitespace-nowrap`}>
                        <span className="mr-2">
                            {balancedResult.reactants.map((mol, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && <span className="text-slate-400 mx-2">+</span>}
                                    <span className={`font-bold ${theme.resultColor}`}>{getReactantCoeffs()[i] > 1 ? getReactantCoeffs()[i] : ''}</span>
                                    <span dangerouslySetInnerHTML={{ __html: formatMolecule(mol) }} />
                                </React.Fragment>
                            ))}
                        </span>
                        <span className="text-slate-400 mx-4">→</span>
                        <span>
                            {balancedResult.products.map((mol, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && <span className="text-slate-400 mx-2">+</span>}
                                    <span className={`font-bold ${theme.resultColor}`}>{getProductCoeffs()[i] > 1 ? getProductCoeffs()[i] : ''}</span>
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
