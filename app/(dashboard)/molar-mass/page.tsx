"use client";

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { MoleculeBuilder } from '@/components/MoleculeBuilder';
import { Molecule, calculateMolarMass } from '@/lib/chemistryEngine';

const createEmptyMolecule = (): Molecule => ({ id: Math.random().toString(36).substr(2, 9), parts: [] });

export default function MolarMassPage() {
  const [massMolecule, setMassMolecule] = useState<Molecule>(createEmptyMolecule());
  const [massResult, setMassResult] = useState<ReturnType<typeof calculateMolarMass> | null>(null);

  const handleCalcMass = () => {
    const res = calculateMolarMass(massMolecule);
    setMassResult(res);
  };

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Molar Mass Calculator</h2>
        <MoleculeBuilder molecule={massMolecule} onChange={setMassMolecule} />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCalcMass}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
          >
            <CheckCircle size={18} /> Calculate
          </button>
        </div>
      </div>

      {massResult && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-4">Results</h3>
            <div className="text-4xl font-bold text-blue-600 mb-4">
              {massResult.totalMass.toFixed(3)} <span className="text-xl text-slate-500 font-normal">g/mol</span>
            </div>
            <h4 className="font-semibold text-slate-600 mb-2 border-t pt-4">Percent Composition</h4>
            <ul className="space-y-2">
              {massResult.composition.map(c => (
                <li key={c.symbol} className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-700">{c.symbol}</span>
                  <div className="w-full bg-slate-100 h-2 rounded-full mx-4 overflow-hidden">
                    <div className="bg-blue-400 h-full rounded-full" style={{ width: `${c.percentage}%` }}></div>
                  </div>
                  <span className="text-slate-500">{c.percentage.toFixed(2)}%</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-4">Step-by-Step Solution</h3>
            <div className="bg-slate-50 p-4 rounded-lg font-mono text-xs text-slate-600 space-y-1 border border-slate-100">
              {massResult.steps.map((step, i) => (
                <div key={i} className={step.startsWith('   ') ? 'pl-4' : 'font-semibold text-slate-700 mt-2'}>
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}