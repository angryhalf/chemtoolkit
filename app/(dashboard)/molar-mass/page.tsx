"use client";

import { useState } from 'react';
import { MoleculeBuilder } from '@/components/MoleculeBuilder';
import { Molecule, calculateMolarMass } from '@/lib/chemistryEngine';
import { createEmptyMolecule } from '@/lib/utils';
import { CopyButton } from '@/components/CopyButton';
import { useSigFigs } from '@/lib/SigFigContext';
import { SigFigDisplay } from '@/components/SigFigDisplay';
import { SigFigSelector } from '@/components/SigFigSelector';
import { usePageConfig, usePageTheme } from '@/lib/usePageConfig';

export default function MolarMassPage() {
  const pageConfig = usePageConfig();
  const theme = usePageTheme(pageConfig);
  
  const [massMolecule, setMassMolecule] = useState<Molecule>(createEmptyMolecule());
  const [massResult, setMassResult] = useState<ReturnType<typeof calculateMolarMass> | null>(null);
  const { settings } = useSigFigs();

  const handleCalcMass = () => {
    const res = calculateMolarMass(massMolecule);
    setMassResult(res);
  };

  const sigFigs = settings.mode === 'disabled' ? 4 : 5;

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
            {pageConfig?.title || 'Molar Mass Calculator'}
          </h2>
        </div>
        
        <MoleculeBuilder molecule={massMolecule} onChange={setMassMolecule} />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleCalcMass}
            className={`px-6 py-2 text-white rounded-lg transition shadow-sm flex items-center gap-2 ${theme.buttonBg} ${theme.buttonHover}`}
          >
            {pageConfig && <pageConfig.icon size={18} />} Calculate Molar Mass
          </button>
        </div>
      </div>

      {massResult && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700">Results</h3>
              <CopyButton text={`${massResult.totalMass.toFixed(4)} g/mol`} />
            </div>
            <div className="mb-4">
              <SigFigSelector compact />
            </div>
            <div className={`text-4xl font-bold mb-4 ${theme.resultColor}`}>
              <SigFigDisplay value={massResult.totalMass} sigFigs={sigFigs} unit="g/mol" />
            </div>
            <h4 className="font-semibold text-slate-600 mb-2 border-t border-slate-200 pt-4">Percent Composition</h4>
            <ul className="space-y-2">
              {massResult.composition.map(c => (
                <li key={c.symbol} className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-700">{c.symbol}</span>
                  <div className="w-full bg-slate-100 h-2 rounded-full mx-4 overflow-hidden">
                    <div className={`${theme.bgColor.replace('bg-', 'bg-').replace('-50', '-400')} h-full rounded-full`} style={{ width: `${c.percentage}%` }}></div>
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
                <div 
                  key={i} 
                  className={step.type === 'calculation' ? 'pl-4' : step.type === 'info' ? `font-semibold ${theme.stepHighlight} mt-2` : `font-semibold ${theme.stepHighlight} mt-2`}
                >
                  {step.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
