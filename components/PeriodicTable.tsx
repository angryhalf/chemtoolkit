"use client";

import React from 'react';
import { elements, Element } from '@/data/elements';

interface PeriodicTableProps {
    onSelect: (element: Element) => void;
}

const categoryColors: Record<string, string> = {
    'Alkali Metal': 'bg-red-100 hover:bg-red-200 border-red-200',
    'Alkaline Earth Metal': 'bg-orange-100 hover:bg-orange-200 border-orange-200',
    'Transition Metal': 'bg-yellow-100 hover:bg-yellow-200 border-yellow-200',
    'Post-Transition Metal': 'bg-blue-100 hover:bg-blue-200 border-blue-200',
    'Metalloid': 'bg-teal-100 hover:bg-teal-200 border-teal-200',
    'Non-Metal': 'bg-green-100 hover:bg-green-200 border-green-200',
    'Halogen': 'bg-indigo-100 hover:bg-indigo-200 border-indigo-200',
    'Noble Gas': 'bg-purple-100 hover:bg-purple-200 border-purple-200',
    'Lanthanide': 'bg-pink-100 hover:bg-pink-200 border-pink-200',
    'Actinide': 'bg-rose-100 hover:bg-rose-200 border-rose-200',
};

const CategoryLegend = () => (
    <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-xs">
        {Object.entries(categoryColors).map(([cat, colors]) => (
            <div key={cat} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-sm ${colors.split(' ')[0]} border`}></div>
                <span className="text-slate-600">{cat}</span>
            </div>
        ))}
    </div>
);

export const PeriodicTable: React.FC<PeriodicTableProps> = ({ onSelect }) => {
    // Create a grid map
    const gridMap = new Map<string, Element>();
    elements.forEach(el => {
        gridMap.set(`${el.row}-${el.col}`, el);
    });

    const renderCell = (row: number, col: number) => {
        const el = gridMap.get(`${row}-${col}`);
        if (el) {
            return (
                <button
                    key={el.number}
                    onClick={() => onSelect(el)}
                    className={`flex flex-col items-center justify-center p-1 rounded-md border transition-all duration-150 focus:ring-2 focus:ring-blue-300 focus:outline-none ${categoryColors[el.category]}`}
                    title={`${el.name} (${el.mass})`}
                >
                    <span className="text-xs font-bold text-slate-700">{el.symbol}</span>
                    <span className="text-[8px] text-slate-400">{el.number}</span>
                </button>
            );
        }
        // Empty cell placeholder
        return <div key={`empty-${row}-${col}`} className="w-full h-10" />;
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
            <CategoryLegend />

            {/* Main Grid: Rows 1-7 */}
            {/* We use a container to manage the grid layout */}
            <div className="space-y-1">
                {Array.from({ length: 7 }).map((_, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="grid gap-1" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
                        {Array.from({ length: 18 }).map((_, colIndex) => renderCell(rowIndex + 1, colIndex + 1))}
                    </div>
                ))}

                {/* Spacer */}
                <div className="h-4"></div>

                {/* Lanthanides (Row 9) & Actinides (Row 10) */}
                {/* We render cols 1-18, but data starts at col 3 for alignment under the main table gap */}
                <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
                    <div className="col-span-2 flex items-center justify-end pr-2 text-xs text-slate-400 font-medium">
                        Lanthanides
                    </div>
                    {Array.from({ length: 16 }).map((_, colIndex) => renderCell(9, colIndex + 3))}
                </div>

                <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
                    <div className="col-span-2 flex items-center justify-end pr-2 text-xs text-slate-400 font-medium">
                        Actinides
                    </div>
                    {Array.from({ length: 16 }).map((_, colIndex) => renderCell(10, colIndex + 3))}
                </div>
            </div>
        </div>
    );
};