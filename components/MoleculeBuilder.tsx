"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Element as ChemElement, elementMap } from '@/data/elements';
import { PeriodicTable } from './PeriodicTable';
import { Molecule, MoleculePart } from '@/lib/chemistryEngine';

interface MoleculeBuilderProps {
    molecule: Molecule;
    onChange: (molecule: Molecule) => void;
}

const parseFormula = (formula: string): MoleculePart[] => {
    const parts: MoleculePart[] = [];
    
    const parseGroup = (str: string): MoleculePart[] => {
        const groupParts: MoleculePart[] = [];
        let i = 0;
        
        while (i < str.length) {
            if (str[i] === '(') {
                let depth = 1;
                let j = i + 1;
                while (j < str.length && depth > 0) {
                    if (str[j] === '(') depth++;
                    if (str[j] === ')') depth--;
                    j++;
                }
                const groupContent = str.slice(i + 1, j - 1);
                let countStr = '';
                while (j < str.length && /\d/.test(str[j])) {
                    countStr += str[j];
                    j++;
                }
                const groupCount = countStr ? parseInt(countStr, 10) : 1;
                
                const innerParts = parseGroup(groupContent);
                if (innerParts.length > 0) {
                    groupParts.push({ type: 'group', parts: innerParts, count: groupCount });
                }
                i = j;
            } else if (/[A-Z]/.test(str[i])) {
                let symbol = str[i];
                let j = i + 1;
                while (j < str.length && /[a-z]/.test(str[j])) {
                    symbol += str[j];
                    j++;
                }
                
                if (elementMap.has(symbol)) {
                    let countStr = '';
                    while (j < str.length && /\d/.test(str[j])) {
                        countStr += str[j];
                        j++;
                    }
                    const count = countStr ? parseInt(countStr, 10) : 1;
                    groupParts.push({ type: 'element', symbol, count });
                }
                i = j;
            } else {
                i++;
            }
        }
        
        return groupParts;
    };
    
    return parseGroup(formula);
};

const formatPart = (part: MoleculePart): string => {
    if (part.type === 'element') {
        return part.count > 1 ? `${part.symbol}${part.count}` : part.symbol;
    } else {
        const inner = part.parts.map(formatPart).join('');
        return part.count > 1 ? `(${inner})${part.count}` : `(${inner})`;
    }
};

export const MoleculeBuilder: React.FC<MoleculeBuilderProps> = ({ molecule, onChange }) => {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const updateCount = useCallback((count: number) => {
        onChange({ ...molecule, count: Math.max(1, count) });
    }, [molecule, onChange]);

    const parseAndAddElements = useCallback((value: string) => {
        const trimmed = value.trim();
        let moleculeCount = 1;
        let formula = trimmed;
        
        const countMatch = trimmed.match(/^(\d+)(.+)$/);
        if (countMatch && !elementMap.has(countMatch[1])) {
            moleculeCount = parseInt(countMatch[1], 10);
            formula = countMatch[2];
        }
        
        if (!formula.trim()) return;
        
        const newParts = parseFormula(formula);
        
        if (newParts.length > 0) {
            const existingCounts = new Map<string, number>();
            const existingGroupCounts: MoleculePart[] = [];
            
            molecule.parts.forEach(part => {
                if (part.type === 'element') {
                    existingCounts.set(part.symbol, (existingCounts.get(part.symbol) || 0) + part.count);
                } else {
                    existingGroupCounts.push(part);
                }
            });
            
            const newPartsMap = new Map<string, number>();
            newParts.forEach(part => {
                if (part.type === 'element') {
                    newPartsMap.set(part.symbol, (newPartsMap.get(part.symbol) || 0) + part.count);
                }
            });
            
            const finalParts: MoleculePart[] = [];
            
            existingGroupCounts.forEach(g => finalParts.push(g));
            
            molecule.parts.forEach(part => {
                if (part.type === 'element' && !newPartsMap.has(part.symbol)) {
                    finalParts.push(part);
                }
            });
            
            newParts.forEach(part => {
                if (part.type === 'element') {
                    const existing = existingCounts.get(part.symbol) || 0;
                    finalParts.push({ type: 'element', symbol: part.symbol, count: existing + part.count });
                } else {
                    finalParts.push(part);
                }
            });
            
            const finalCount = moleculeCount;
            onChange({ ...molecule, parts: finalParts, count: finalCount });
            setInputValue('');
        }
    }, [molecule, onChange]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            parseAndAddElements(inputValue);
        }
    }, [inputValue, parseAndAddElements]);

    useEffect(() => {
        const lastChar = inputValue.slice(-1);
        if (/^\d$/.test(lastChar)) {
            const secondLast = inputValue.slice(-2, -1);
            if (secondLast && /[A-Z]/.test(secondLast)) {
                parseAndAddElements(inputValue);
            }
        }
    }, [inputValue, parseAndAddElements]);

    const updatePartCount = useCallback((index: number, delta: number) => {
        const newParts = [...molecule.parts];
        const part = newParts[index];
        const newCount = Math.max(1, part.count + delta);
        part.count = newCount;
        onChange({ ...molecule, parts: newParts });
    }, [molecule, onChange]);

    const removePart = useCallback((index: number) => {
        const newParts = molecule.parts.filter((_, i) => i !== index);
        onChange({ ...molecule, parts: newParts });
    }, [molecule, onChange]);

    const handleElementSelect = useCallback((element: ChemElement) => {
        const existingIndex = molecule.parts.findIndex(p => p.type === 'element' && p.symbol === element.symbol);
        
        if (existingIndex >= 0) {
            const newParts = [...molecule.parts];
            newParts[existingIndex] = { ...newParts[existingIndex], count: newParts[existingIndex].count + 1 };
            onChange({ ...molecule, parts: newParts });
        } else {
            const newPart: MoleculePart = { type: 'element', symbol: element.symbol, count: 1 };
            onChange({
                ...molecule,
                parts: [...molecule.parts, newPart]
            });
        }
        inputRef.current?.focus();
    }, [molecule, onChange]);

    const getFormulaDisplay = (): string => {
        return molecule.parts.map(formatPart).join('');
    };

    return (
        <div className="space-y-4">
            <div 
                className="flex flex-wrap items-center gap-2 min-h-[40px] p-2 rounded-lg cursor-text"
                onClick={() => inputRef.current?.focus()}
            >
                <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                    <button
                        onClick={(e) => { e.stopPropagation(); updateCount(molecule.count - 1); }}
                        className="px-1.5 py-1 hover:bg-slate-100 border-r border-slate-200"
                        aria-label="Decrease count"
                    >
                        <Minus size={14} />
                    </button>
                    <input
                        type="number"
                        min="1"
                        value={molecule.count}
                        onChange={(e) => updateCount(parseInt(e.target.value) || 1)}
                        className="w-12 text-center py-1 text-sm font-bold text-blue-600 border-0 outline-none"
                    />
                    <button
                        onClick={(e) => { e.stopPropagation(); updateCount(molecule.count + 1); }}
                        className="px-1.5 py-1 hover:bg-slate-100 border-l border-slate-200"
                        aria-label="Increase count"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                {molecule.parts.map((part, index) => (
                    part.type === 'element' ? (
                        <div key={index} className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                            <button
                                onClick={(e) => { e.stopPropagation(); removePart(index); }}
                                className="px-2 py-1 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 border-r border-slate-200"
                                aria-label={`Remove ${part.symbol}`}
                            >
                                <X size={14} />
                            </button>
                            <span className="px-2 font-bold text-slate-700">{part.symbol}</span>
                            <div className="flex items-center border-l border-slate-200">
                                <button onClick={(e) => { e.stopPropagation(); updatePartCount(index, -1); }} className="px-1 hover:bg-slate-100" aria-label="Decrease count"><Minus size={12} /></button>
                                <span className="text-xs font-bold text-blue-600 w-4 text-center">{part.count}</span>
                                <button onClick={(e) => { e.stopPropagation(); updatePartCount(index, 1); }} className="px-1 hover:bg-slate-100" aria-label="Increase count"><Plus size={12} /></button>
                            </div>
                        </div>
                    ) : (
                        <div key={index} className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                            <button
                                onClick={(e) => { e.stopPropagation(); removePart(index); }}
                                className="px-2 py-1 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 border-r border-slate-200"
                                aria-label="Remove group"
                            >
                                <X size={14} />
                            </button>
                            <span className="px-2 font-bold text-slate-700">
                                ({part.parts.map(formatPart).join('')}) × {part.count}
                            </span>
                            <div className="flex items-center border-l border-slate-200">
                                <button onClick={(e) => { e.stopPropagation(); updatePartCount(index, -1); }} className="px-1 hover:bg-slate-100" aria-label="Decrease count"><Minus size={12} /></button>
                                <span className="text-xs font-bold text-blue-600 w-4 text-center">{part.count}</span>
                                <button onClick={(e) => { e.stopPropagation(); updatePartCount(index, 1); }} className="px-1 hover:bg-slate-100" aria-label="Increase count"><Plus size={12} /></button>
                            </div>
                        </div>
                    )
                ))}
                
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type formula..."
                    aria-label="Type formula to add elements"
                    className="flex-1 min-w-[120px] bg-transparent border-0 outline-none text-sm"
                />
            </div>

            <PeriodicTable onSelect={handleElementSelect} />
        </div>
    );
};
