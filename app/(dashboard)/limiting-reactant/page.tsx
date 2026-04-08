"use client";

import React, { useState } from 'react';
import { Plus, ArrowDown, Trash2 } from 'lucide-react';
import { MoleculeBuilder } from '@/components/MoleculeBuilder';
import { LimitingReactantResults } from '@/components/LimitingReactantResults';
import { Molecule, formatMoleculePlainText, Unit } from '@/lib/chemistryEngine';
import { createEmptyMolecule } from '@/lib/utils';
import { usePageConfig, usePageTheme } from '@/lib/usePageConfig';

interface ReactantInput {
    mol: Molecule;
    value: number;
    unit: Unit;
}

export default function LimitingReactantPage() {
    const pageConfig = usePageConfig();
    const theme = usePageTheme(pageConfig);
    const [reactants, setReactants] = useState<ReactantInput[]>([
        { mol: createEmptyMolecule(), value: 10, unit: 'g' }
    ]);

    const [products, setProducts] = useState<Molecule[]>([
        createEmptyMolecule()
    ]);

    const [targetProductIdx, setTargetProductIdx] = useState(0);
    const [targetUnit, setTargetUnit] = useState<Unit>('g');
    const [showResults, setShowResults] = useState(false);

    const addReactant = () => {
        setReactants([...reactants, { mol: createEmptyMolecule(), value: 0, unit: 'g' }]);
    };

    const removeReactant = (index: number) => {
        if (reactants.length > 1) {
            setReactants(reactants.filter((_, i) => i !== index));
        }
    };

    const addProduct = () => {
        setProducts([...products, createEmptyMolecule()]);
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
                <div className="flex items-center gap-3 mb-4">
                    {pageConfig && (
                        <div className={`p-2 ${theme.iconBg} ${theme.iconColor} rounded-lg`}>
                            <pageConfig.icon size={24} />
                        </div>
                    )}
                    <h2 className="text-xl font-semibold text-slate-800">
                        {pageConfig?.title || 'Limiting Reactant Calculator'}
                    </h2>
                </div>

                {/* Reactants Section */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-500 mb-2">Reactants (Given Amounts)</label>
                    <div className="space-y-4">
                        {reactants.map((r, idx) => (
                            <div key={idx} className="relative flex items-start gap-2">
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
                                                newR[idx].unit = e.target.value as Unit;
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
                                                title="Remove Reactant"
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
                    <ArrowDown className="text-slate-400" />
                    <div className="flex-grow border-t border-slate-200"></div>
                </div>

                {/* Products Section */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-500 mb-2">Products</label>
                    <div className="space-y-4">
                        {products.map((p, idx) => (
                            <div key={idx} className="relative flex items-center gap-2">
                                <div className="flex-1 relative">
                                    {products.length > 1 && (
                                        <button
                                            onClick={() => removeProduct(idx)}
                                            className="absolute -left-8 top-3 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 shadow-sm"
                                            title="Remove Product"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                        <MoleculeBuilder
                                            molecule={p}
                                            onChange={(m) => {
                                                const newP = [...products];
                                                newP[idx] = m;
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
                                    {formatMoleculePlainText(p) || `Product ${i + 1}`}
                                </option>
                            ))}
                        </select>

                        <span className="text-sm font-medium text-slate-700 ml-2">in:</span>
                        <select
                            value={targetUnit}
                            onChange={(e) => setTargetUnit(e.target.value as Unit)}
                            className="px-3 py-2 border border-slate-200 rounded-lg shadow-sm bg-white text-sm"
                        >
                            <option value="g">grams</option>
                            <option value="mol">moles</option>
                            <option value="molecules">molecules</option>
                        </select>
                    </div>

                    <button
                        onClick={handleCalculate}
                        className={`px-6 py-2 text-white rounded-lg transition shadow-sm flex items-center gap-2 ${theme.buttonBg} ${theme.buttonHover}`}
                    >
                        {pageConfig && <pageConfig.icon size={18} />} Calculate Yield
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
