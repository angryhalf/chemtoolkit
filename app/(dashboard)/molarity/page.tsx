"use client";

import { useState } from 'react';
import { FlaskConical, Calculator } from 'lucide-react';
import { MoleculeBuilder } from '@/components/MoleculeBuilder';
import { Molecule, calculateMolarMass } from '@/lib/chemistryEngine';
import { createEmptyMolecule } from '@/lib/utils';
import { CopyButton } from '@/components/CopyButton';
import { useSigFigs } from '@/lib/SigFigContext';
import { SigFigDisplay } from '@/components/SigFigDisplay';
import { SigFigSelector } from '@/components/SigFigSelector';
import { parseSigFigsFromInput, roundToSigFigs } from '@/lib/sigfigs';
import { usePageConfig, usePageTheme } from '@/lib/usePageConfig';

type CalculationType = 'molarity' | 'moles' | 'volume' | 'mass';

export default function MolarityPage() {
  const pageConfig = usePageConfig();
  const theme = usePageTheme(pageConfig);
  const [calcType, setCalcType] = useState<CalculationType>('molarity');
  const [molecule, setMolecule] = useState<Molecule>(createEmptyMolecule());
  const [mass, setMass] = useState('');
  const [volume, setVolume] = useState('');
  const [molarity, setMolarity] = useState('');
  const [moles, setMoles] = useState('');
  const [result, setResult] = useState<{
    value: number;
    unit: string;
    steps: string[];
  } | null>(null);
  
  const { settings } = useSigFigs();

  const handleCalculate = () => {
    const molarMass = calculateMolarMass(molecule).totalMass;
    if (molarMass === 0) return;

    let calcValue = 0;
    let unit = '';
    const steps: string[] = [];

    const massVal = parseFloat(mass);
    const volumeVal = parseFloat(volume);
    const molarityVal = parseFloat(molarity);
    const molesVal = parseFloat(moles);

    if (calcType === 'molarity') {
      // M = n / V, need mass or moles + volume
      if (!volumeVal || volumeVal <= 0) return;
      
      let n: number;
      if (massVal && massVal > 0) {
        n = massVal / molarMass;
        steps.push(`Given mass: ${massVal} g`);
        steps.push(`Molar mass of ${molecule.parts.map(p => p.type === 'element' ? p.symbol : '').join('')}: ${molarMass.toFixed(4)} g/mol`);
        steps.push(`Moles = mass / molar mass = ${massVal} / ${molarMass.toFixed(4)} = ${n.toFixed(6)} mol`);
      } else if (molesVal && molesVal > 0) {
        n = molesVal;
        steps.push(`Given moles: ${molesVal} mol`);
      } else {
        return;
      }
      
      calcValue = n / volumeVal;
      unit = 'M';
      steps.push(`Volume: ${volumeVal} L`);
      steps.push(`Molarity = moles / volume = ${n.toFixed(6)} / ${volumeVal} = ${calcValue.toFixed(6)} M`);
    } else if (calcType === 'moles') {
      // n = M × V
      if (!molarityVal || !volumeVal || molarityVal <= 0 || volumeVal <= 0) return;
      
      calcValue = molarityVal * volumeVal;
      unit = 'mol';
      steps.push(`Given molarity: ${molarityVal} M`);
      steps.push(`Given volume: ${volumeVal} L`);
      steps.push(`Moles = molarity × volume = ${molarityVal} × ${volumeVal} = ${calcValue.toFixed(6)} mol`);
    } else if (calcType === 'volume') {
      // V = n / M
      if (!molarityVal || molarityVal <= 0) return;
      
      let n: number;
      if (massVal && massVal > 0) {
        n = massVal / molarMass;
        steps.push(`Given mass: ${massVal} g`);
        steps.push(`Molar mass: ${molarMass.toFixed(4)} g/mol`);
        steps.push(`Moles = ${massVal} / ${molarMass.toFixed(4)} = ${n.toFixed(6)} mol`);
      } else if (molesVal && molesVal > 0) {
        n = molesVal;
        steps.push(`Given moles: ${molesVal} mol`);
      } else {
        return;
      }
      
      calcValue = n / molarityVal;
      unit = 'L';
      steps.push(`Molarity: ${molarityVal} M`);
      steps.push(`Volume = moles / molarity = ${n.toFixed(6)} / ${molarityVal} = ${calcValue.toFixed(6)} L`);
    } else if (calcType === 'mass') {
      // mass = M × V × MM
      if (!molarityVal || !volumeVal || molarityVal <= 0 || volumeVal <= 0) return;
      
      const n = molarityVal * volumeVal;
      calcValue = n * molarMass;
      unit = 'g';
      steps.push(`Given molarity: ${molarityVal} M`);
      steps.push(`Given volume: ${volumeVal} L`);
      steps.push(`Moles = ${molarityVal} × ${volumeVal} = ${n.toFixed(6)} mol`);
      steps.push(`Molar mass: ${molarMass.toFixed(4)} g/mol`);
      steps.push(`Mass = moles × molar mass = ${n.toFixed(6)} × ${molarMass.toFixed(4)} = ${calcValue.toFixed(6)} g`);
    }

    setResult({ value: calcValue, unit, steps });
  };

  const detectSigFigs = (): number => {
    const inputs = [mass, volume, molarity, moles].filter(v => v !== '');
    if (inputs.length === 0) return 3;
    const sigFigsArr = inputs.map(v => parseSigFigsFromInput(v).sigFigs).filter(s => s > 0);
    return sigFigsArr.length > 0 ? Math.min(...sigFigsArr) : 3;
  };

  const calcSigFigs = settings.mode === 'disabled' ? 4 : (settings.mode === 'fixed' ? settings.fixedCount : detectSigFigs() || 3);

  const formatResult = (val: number) => {
    if (settings.mode === 'disabled') {
      return val.toFixed(4);
    }
    const absVal = Math.abs(val);
    const useScientific = absVal >= 1e6 || (absVal < 1e-3 && absVal !== 0);
    if (useScientific) {
      return val.toExponential(calcSigFigs - 1);
    }
    const d = Math.ceil(Math.log10(absVal));
    const decimals = Math.max(0, calcSigFigs - d);
    return val.toFixed(decimals);
  };

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <FlaskConical size={24} />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Molarity Calculator</h2>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Calculate</label>
          <select
            value={calcType}
            onChange={(e) => setCalcType(e.target.value as CalculationType)}
            className="w-full p-3 rounded-lg border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="molarity">Molarity (M)</option>
            <option value="moles">Moles (mol)</option>
            <option value="volume">Volume (L)</option>
            <option value="mass">Mass (g)</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Compound</label>
          <MoleculeBuilder molecule={molecule} onChange={setMolecule} />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {(calcType === 'molarity' || calcType === 'volume' || calcType === 'mass') && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mass (g)</label>
                <input
                  type="number"
                  value={mass}
                  onChange={(e) => setMass(e.target.value)}
                  placeholder="Enter mass"
                  className="w-full p-3 rounded-lg border border-slate-200 bg-white text-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">OR Moles (mol)</label>
                <input
                  type="number"
                  value={moles}
                  onChange={(e) => setMoles(e.target.value)}
                  placeholder="Enter moles"
                  className="w-full p-3 rounded-lg border border-slate-200 bg-white text-slate-800"
                />
              </div>
            </>
          )}
          
          {calcType === 'molarity' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Volume (L)</label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                placeholder="Enter volume"
                className="w-full p-3 rounded-lg border border-slate-200 bg-white text-slate-800"
              />
            </div>
          )}
          
          {(calcType === 'moles' || calcType === 'volume' || calcType === 'mass') && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Molarity (M)</label>
                <input
                  type="number"
                  value={molarity}
                  onChange={(e) => setMolarity(e.target.value)}
                  placeholder="Enter molarity"
                  className="w-full p-3 rounded-lg border border-slate-200 bg-white text-slate-800"
                />
              </div>
              {calcType !== 'volume' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Volume (L)</label>
                  <input
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    placeholder="Enter volume"
                    className="w-full p-3 rounded-lg border border-slate-200 bg-white text-slate-800"
                  />
                </div>
              )}
            </>
          )}
        </div>

        <button
          onClick={handleCalculate}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-sm flex items-center gap-2"
        >
          <Calculator size={18} /> Calculate
        </button>
      </div>

      {result && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700">Results</h3>
              <CopyButton text={`${formatResult(result.value)} ${result.unit}`} />
            </div>
            <div className="mb-3">
              <SigFigSelector compact />
            </div>
            <div className="text-4xl font-bold text-emerald-600 mb-2">
              <SigFigDisplay value={result.value} sigFigs={calcSigFigs} unit={result.unit} />
            </div>
            <p className="text-sm text-slate-500">
              {calcType === 'molarity' && 'Molarity (moles per liter)'}
              {calcType === 'moles' && 'Amount of substance in moles'}
              {calcType === 'volume' && 'Volume in liters'}
              {calcType === 'mass' && 'Mass in grams'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-4">Step-by-Step Solution</h3>
            <div className="bg-slate-50 p-4 rounded-lg font-mono text-xs text-slate-600 space-y-1 border border-slate-100">
              {result.steps.map((step, i) => (
                <div key={i} className={i === result.steps.length - 1 ? 'font-semibold text-emerald-700 mt-2' : ''}>
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
