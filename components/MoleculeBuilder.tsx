"use client";

import React from 'react';
import { X, Plus, Minus, Parentheses } from 'lucide-react';
import { Element } from '@/data/elements';
import { PeriodicTable } from './PeriodicTable';
import { Molecule, MoleculePart } from '@/lib/chemistryEngine';

interface MoleculeBuilderProps {
    molecule: Molecule;
    onChange: (molecule: Molecule) => void;
}

// Helper to generate IDs
const genId = () => Math.random().toString(36).substr(2, 9);

export const MoleculeBuilder: React.FC<MoleculeBuilderProps> = ({ molecule, onChange }) => {

    const handleElementSelect = (element: Element) => {
        const newPart: MoleculePart = { type: 'element', symbol: element.symbol, count: 1 };
        onChange({
            ...molecule,
            parts: [...molecule.parts, newPart]
        });
    };

    const handleAddGroup = () => {
        const newPart: MoleculePart = { type: 'group', parts: [], count: 1 };
        onChange({
            ...molecule,
            parts: [...molecule.parts, newPart]
        });
    };

    const updatePartCount = (index: number, delta: number) => {
        const newParts = [...molecule.parts];
        const part = newParts[index];
        const newCount = Math.max(1, part.count + delta);
        part.count = newCount;
        onChange({ ...molecule, parts: newParts });
    };

    const removePart = (index: number) => {
        const newParts = molecule.parts.filter((_, i) => i !== index);
        onChange({ ...molecule, parts: newParts });
    };

    const addElementToGroup = (groupIndex: number, element: Element) => {
        const newParts = [...molecule.parts];
        const group = newParts[groupIndex] as { type: 'group'; parts: MoleculePart[]; count: number };
        group.parts.push({ type: 'element', symbol: element.symbol, count: 1 });
        onChange({ ...molecule, parts: newParts });
    };

    const updateGroupChildCount = (groupIndex: number, childIndex: number, delta: number) => {
        const newParts = [...molecule.parts];
        const group = newParts[groupIndex] as { type: 'group'; parts: MoleculePart[]; count: number };
        const child = group.parts[childIndex];
        child.count = Math.max(1, child.count + delta);
        onChange({ ...molecule, parts: newParts });
    };

    const removeGroupChild = (groupIndex: number, childIndex: number) => {
        const newParts = [...molecule.parts];
        const group = newParts[groupIndex] as { type: 'group'; parts: MoleculePart[]; count: number };
        group.parts = group.parts.filter((_, i) => i !== childIndex);
        onChange({ ...molecule, parts: newParts });
    };

    return (
        <div className="space-y-4">
            {/* Construction Zone */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 min-h-[80px] shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                    {molecule.parts.length === 0 && (
                        <span className="text-slate-400 text-sm italic">Click elements below to build...</span>
                    )}

                    {molecule.parts.map((part, index) => (
                        <React.Fragment key={index}>
                            {part.type === 'element' ? (
                                <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                                    <button
                                        onClick={() => removePart(index)}
                                        className="px-2 py-1 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 border-r border-slate-200"
                                    >
                                        <X size={14} />
                                    </button>
                                    <span className="px-2 font-bold text-slate-700">{part.symbol}</span>
                                    <div className="flex items-center border-l border-slate-200">
                                        <button onClick={() => updatePartCount(index, -1)} className="px-1 hover:bg-slate-100"><Minus size={12} /></button>
                                        <span className="text-xs font-bold text-blue-600 w-4 text-center">{part.count}</span>
                                        <button onClick={() => updatePartCount(index, 1)} className="px-1 hover:bg-slate-100"><Plus size={12} /></button>
                                    </div>
                                </div>
                            ) : (
                                // Group Rendering
                                <div className="flex items-center bg-white border border-dashed border-slate-300 rounded-lg shadow-sm overflow-hidden">
                                    <button
                                        onClick={() => removePart(index)}
                                        className="px-2 py-1 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 border-r border-slate-200 h-full"
                                    >
                                        <X size={14} />
                                    </button>

                                    <span className="pl-2 text-slate-400">(</span>
                                    <div className="flex flex-wrap items-center gap-1 px-1 py-1">
                                        {part.parts.map((child, cIdx) => {
                                            // FIX: Check if child is an element before rendering controls
                                            if (child.type === 'element') {
                                                return (
                                                    <div key={cIdx} className="flex items-center bg-slate-50 rounded border border-slate-100 text-xs">
                                                        <span className="px-1 font-bold">{child.symbol}</span>
                                                        <div className="flex items-center border-l border-slate-100">
                                                            <button onClick={() => updateGroupChildCount(index, cIdx, -1)} className="px-0.5 hover:bg-slate-200"><Minus size={10} /></button>
                                                            <span className="font-bold text-blue-600 w-3 text-center">{child.count}</span>
                                                            <button onClick={() => updateGroupChildCount(index, cIdx, 1)} className="px-0.5 hover:bg-slate-200"><Plus size={10} /></button>
                                                            <button onClick={() => removeGroupChild(index, cIdx)} className="px-0.5 hover:bg-red-100 text-red-400"><X size={10} /></button>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null; // Handle nested groups here if needed in future
                                        })}
                                        {/* Placeholder to add to group */}
                                        <span
                                            onClick={() => {
                                                // Simple prompt to add element to group for now, 
                                                // ideally this opens a mini-picker
                                                const sym = prompt("Enter element symbol (e.g., O, H):");
                                                if (sym) {
                                                    const el = { symbol: sym.toUpperCase(), count: 1, type: 'element' as const };
                                                    const newParts = [...molecule.parts];
                                                    const group = newParts[index] as { type: 'group'; parts: MoleculePart[]; count: number };
                                                    group.parts.push(el);
                                                    onChange({ ...molecule, parts: newParts });
                                                }
                                            }}
                                            className="text-slate-300 text-[10px] px-1 cursor-pointer hover:text-blue-500"
                                        >
                                            + Add
                                        </span>
                                    </div>
                                    <span className="text-slate-400">)</span>
                                    <div className="flex items-center border-l border-slate-200 bg-slate-50 h-full">
                                        <button onClick={() => updatePartCount(index, -1)} className="px-1 hover:bg-slate-100"><Minus size={12} /></button>
                                        <span className="text-xs font-bold text-purple-600 w-4 text-center">{part.count}</span>
                                        <button onClick={() => updatePartCount(index, 1)} className="px-1 hover:bg-slate-100"><Plus size={12} /></button>
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}

                    {molecule.parts.length > 0 && (
                        <button
                            onClick={handleAddGroup}
                            className="flex items-center gap-1 px-3 py-1 border border-dashed border-slate-300 rounded-lg text-slate-400 hover:border-slate-400 hover:text-slate-500 text-sm"
                        >
                            <Parentheses size={14} /> Add Group
                        </button>
                    )}
                </div>
            </div>

            {/* Element Picker */}
            <PeriodicTable onSelect={handleElementSelect} />
        </div>
    );
};
