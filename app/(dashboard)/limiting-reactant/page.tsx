"use client";

import React, { useState } from 'react';
import { Plus, ArrowRight, Trash2, Beaker } from 'lucide-react';
import { MoleculeBuilder } from '@/components/MoleculeBuilder';
import { LimitingReactantResults } from '@/components/LimitingReactantResults';
import { Molecule, formatMoleculePlainText } from '@/lib/chemistryEngine';

const createEmptyMolecule = (): Molecule => ({ id: Math.random().toString(36).substr(2, 9), parts: [] });

export default function LimitingReactantPage() {
    // Reactants: Array of { mol, coeff, value, unit }
    const [reactants, setReactants] = useState([
        { mol: createEmptyMolecule(), coeff: 1, value: 10, unit: 'g' as 'g' | 'mol' | 'molecules' }
    ]);

    // Products: Array of { mol, coeff }
    const [products, setProducts] = useState([
        { mol: createEmptyMolecule(), coeff: 1 }
    ]);

    const [targetProductIdx, setTargetProductIdx] = useState(0);
    const [targetUnit, setTargetUnit] = useState<'g' | 'mol' | 'molecules'>('g'); // New state
    const [showResults, setShowResults] = useState(false);

    // Handlers
    const addReactant = () => {
        setReactants([...reactants, { mol: createEmptyMolecule(), coeff: 1, value: 0, unit: 'g' }]);
    };

    const removeReactant = (index: number) => {
        if (reactants.length > 1) {
            setReactants(reactants.filter((_, i) => i !== index));
        }
    };

    const addProduct = () => {
        setProducts([...products, { mol: createEmptyMolecule(), coeff: 1 }]);
    };

    const removeProduct = (index: number) => {
        if (products.length > 1) {
            setProducts(products.filter((_, i) => i !== index));
        }
    };

    const handleCalculate = () => {
        setShowResults(true);
    };

    return (
        <div className="p-6 lg:p-10 space-y-6 max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold mb-4 text-slate-800">Limiting Reactant Calculator</h2>

                {/* Reactants Section */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-500 mb-2">Reactants (Given Amounts)</label>
                    <div className="space-y-4">
                        {reactants.map((r, idx) => (
                            <div key={idx} className="relative flex items-start gap-2">
                                {/* Coefficient */}
                                <input
                                    type="number"
                                    min="1"
                                    value={r.coeff}
                                    onChange={(e) => {
                                        const newR = [...reactants];
                                        newR[idx].coeff = parseInt(e.target.value) || 1;
                                        setReactants(newR);
                                    }}
                                    className="w-12 text-center px-2 py-2 mt-7 border border-slate-200 rounded-lg shadow-sm text-sm font-bold text-slate-600 bg-slate-50"
                                />

                                <div className="flex-1 space-y-2">
                                    {/* Inputs Row */}
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            value={r.value}
                                            onChange={(e) => {
                                                const newR = [...reactants];
                                                newR[idx].value = parseFloat(e.target.value) || 0;
                                                setReactants(newR);
                                            }}
                                            className="w-24 px-3 py-2 border border-slate-200 rounded-lg shadow-sm text-sm"
                                        />
                                        <select
                                            value={r.unit}
                                            onChange={(e) => {
                                                const newR = [...reactants];
                                                newR[idx].unit = e.target.value as any;
                                                setReactants(newR);
                                            }}
                                            className="px-3 py-2 border border-slate-200 rounded-lg shadow-sm bg-white text-sm"
                                        >
                                            <option value="g">grams</option>
                                            <option value="mol">moles</option>
                                            <option value="molecules">molecules</option>
                                        </select>
                                    </div>

                                    {/* Molecule Builder */}
                                    <div className="relative">
                                        {reactants.length > 1 && (
                                            <button
                                                onClick={() => removeReactant(idx)}
                                                className="absolute -left-8 top-3 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 shadow-sm"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                            <MoleculeBuilder
                                                molecule={r.mol}
                                                onChange={(m) => {
                                                    const newR = [...reactants];
                                                    newR[idx].mol = m;
                                                    setReactants(newR);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={addReactant} className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1">
                        <Plus size={14} /> Add Reactant
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 my-4">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <ArrowRight className="text-slate-400" />
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Products Section */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-500 mb-2">Products</label>
                    <div className="space-y-4">
                        {products.map((p, idx) => (
                            <div key={idx} className="relative flex items-center gap-2">
                                {/* Coefficient */}
                                <input
                                    type="number"
                                    min="1"
                                    value={p.coeff}
                                    onChange={(e) => {
                                        const newP = [...products];
                                        newP[idx].coeff = parseInt(e.target.value) || 1;
                                        setProducts(newP);
                                    }}
                                    className="w-12 text-center px-2 py-2 border border-slate-200 rounded-lg shadow-sm text-sm font-bold text-slate-600 bg-slate-50"
                                />

                                <div className="flex-1 relative">
                                    {products.length > 1 && (
                                        <button
                                            onClick={() => removeProduct(idx)}
                                            className="absolute -left-8 top-3 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 shadow-sm"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                        <MoleculeBuilder
                                            molecule={p.mol}
                                            onChange={(m) => {
                                                const newP = [...products];
                                                newP[idx].mol = m;
                                                setProducts(newP);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={addProduct} className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1">
                        <Plus size={14} /> Add Product
                    </button>
                </div>

                {/* Controls */}
                <div className="border-t border-slate-100 pt-6 flex justify-between items-end gap-4 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-slate-700">Find yield for:</span>
                        <select
                            value={targetProductIdx}
                            onChange={(e) => setTargetProductIdx(parseInt(e.target.value))}
                            className="px-3 py-2 border border-slate-200 rounded-lg shadow-sm bg-white text-sm"
                        >
                            {products.map((p, i) => (
                                <option key={i} value={i}>
                                    {formatMoleculePlainText(p.mol) || `Product ${i + 1}`}
                                </option>
                            ))}
                        </select>

                        {/* New Unit Selector */}
                        <span className="text-sm font-medium text-slate-700 ml-2">in:</span>
                        <select
                            value={targetUnit}
                            onChange={(e) => setTargetUnit(e.target.value as any)}
                            className="px-3 py-2 border border-slate-200 rounded-lg shadow-sm bg-white text-sm"
                        >
                            <option value="g">grams</option>
                            <option value="mol">moles</option>
                            <option value="molecules">molecules</option>
                        </select>
                    </div>

                    <button
                        onClick={handleCalculate}
                        className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition shadow-sm flex items-center gap-2"
                    >
                        <Beaker size={18} /> Calculate Yield
                    </button>
                </div>
            </div>

            {/* Results */}
            {showResults && (
                <LimitingReactantResults
                    reactants={reactants}
                    products={products}
                    targetProductIndex={targetProductIdx}
                    targetUnit={targetUnit}
                />
            )}
        </div>
    );
}