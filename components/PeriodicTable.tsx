"use client";

import React, { useMemo, memo, useCallback } from 'react';
import { elements, Element, ElementCategory } from '@/data/elements';

interface PeriodicTableProps {
    onSelect: (element: Element) => void;
}

export const ELEMENT_CATEGORY_COLORS: Record<ElementCategory, { bg: string; border: string; hover: string }> = {
    'Alkali Metal': { bg: 'bg-red-100', border: 'border-red-200', hover: 'hover:bg-red-200' },
    'Alkaline Earth Metal': { bg: 'bg-orange-100', border: 'border-orange-200', hover: 'hover:bg-orange-200' },
    'Transition Metal': { bg: 'bg-yellow-100', border: 'border-yellow-200', hover: 'hover:bg-yellow-200' },
    'Post-Transition Metal': { bg: 'bg-blue-100', border: 'border-blue-200', hover: 'hover:bg-blue-200' },
    'Metalloid': { bg: 'bg-teal-100', border: 'border-teal-200', hover: 'hover:bg-teal-200' },
    'Non-Metal': { bg: 'bg-green-100', border: 'border-green-200', hover: 'hover:bg-green-200' },
    'Halogen': { bg: 'bg-indigo-100', border: 'border-indigo-200', hover: 'hover:bg-indigo-200' },
    'Noble Gas': { bg: 'bg-purple-100', border: 'border-purple-200', hover: 'hover:bg-purple-200' },
    'Lanthanide': { bg: 'bg-pink-100', border: 'border-pink-200', hover: 'hover:bg-pink-200' },
    'Actinide': { bg: 'bg-rose-100', border: 'border-rose-200', hover: 'hover:bg-rose-200' },
};

const CategoryLegend: React.FC = memo(() => (
    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-xs">
        {(Object.keys(ELEMENT_CATEGORY_COLORS) as ElementCategory[]).map((cat) => {
            const colors = ELEMENT_CATEGORY_COLORS[cat];
            return (
                <div key={cat} className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded-sm ${colors.bg} border ${colors.border}`}></div>
                    <span className="text-slate-600">{cat}</span>
                </div>
            );
        })}
    </div>
));

CategoryLegend.displayName = 'CategoryLegend';

interface ElementCellProps {
    element: Element;
    onSelect: (el: Element) => void;
}

const ElementCell: React.FC<ElementCellProps> = memo(({ element, onSelect }) => {
    const colors = ELEMENT_CATEGORY_COLORS[element.category];

    return (
        <button
            onClick={() => onSelect(element)}
            className={`
                flex flex-col items-center justify-center p-1 rounded-md border transition-all duration-150 
                focus:ring-2 focus:ring-blue-300 focus:outline-none
                ${colors.bg} ${colors.border} ${colors.hover}
            `}
            title={`${element.name} (${element.mass})`}
            aria-label={`${element.name}, atomic number ${element.number}, ${element.mass} g/mol`}
        >
            <span className="text-xs font-bold text-slate-700">{element.symbol}</span>
            <span className="text-[8px] text-slate-400">{element.mass}</span>
        </button>
    );
});

ElementCell.displayName = 'ElementCell';

const EmptyCell: React.FC<{ row: number; col: number }> = memo(({ row, col }) => (
    <div key={`empty-${row}-${col}`} className="w-full h-10" />
));

EmptyCell.displayName = 'EmptyCell';

export const PeriodicTable: React.FC<PeriodicTableProps> = memo(({ onSelect }) => {
    const gridMap = useMemo(() => {
        const map = new Map<string, Element>();
        elements.forEach(el => {
            map.set(`${el.row}-${el.col}`, el);
        });
        return map;
    }, []);

    const handleSelect = useCallback((element: Element) => {
        onSelect(element);
    }, [onSelect]);

    const renderCell = useCallback((row: number, col: number) => {
        const el = gridMap.get(`${row}-${col}`);
        if (el) {
            return <ElementCell key={el.number} element={el} onSelect={handleSelect} />;
        }
        return <EmptyCell key={`empty-${row}-${col}`} row={row} col={col} />;
    }, [gridMap, handleSelect]);

    const mainRows = useMemo(() => Array.from({ length: 7 }), []);
    const lanthanideCols = useMemo(() => Array.from({ length: 16 }), []);

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
            <CategoryLegend />

            <div className="space-y-1">
                {mainRows.map((_, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="grid gap-1" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
                        {Array.from({ length: 18 }).map((_, colIndex) => renderCell(rowIndex + 1, colIndex + 1))}
                    </div>
                ))}

                <div className="h-4"></div>

                <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
                    <div className="col-span-2 flex items-center justify-end pr-2 text-xs text-slate-400 font-medium">
                        Lanthanides
                    </div>
                    {lanthanideCols.map((_, colIndex) => renderCell(9, colIndex + 3))}
                </div>

                <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
                    <div className="col-span-2 flex items-center justify-end pr-2 text-xs text-slate-400 font-medium">
                        Actinides
                    </div>
                    {lanthanideCols.map((_, colIndex) => renderCell(10, colIndex + 3))}
                </div>
            </div>
        </div>
    );
});

PeriodicTable.displayName = 'PeriodicTable';
