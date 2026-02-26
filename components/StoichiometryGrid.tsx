"use client";

import React from 'react';
import { Molecule, formatMolecule, calculateMolarMass } from '@/lib/chemistryEngine';

interface StoichiometryGridProps {
  reactants: Molecule[];
  products: Molecule[];
  coefficients: number[];
  knownMolIndex: number;
  knownValue: number;
  knownUnit: 'g' | 'mol' | 'molecules';
  knownIsReactant: boolean;
  targetMolIndex: number;
  targetUnit: 'g' | 'molecules' | 'mol';
  targetIsReactant: boolean;
}

const AVOGADRO = 6.02e23;

// Helper to safely render HTML formulas
const Formula = ({ html }: { html: string }) => (
  <span dangerouslySetInnerHTML={{ __html: html }} />
);

// Helper to format numbers in proper scientific notation
const formatScientific = (num: number) => {
  if (num === 0) return "0";
  const expString = num.toExponential(3);
  const [coefficient, exponent] = expString.split('e');
  const expVal = parseInt(exponent, 10);

  return (
    <span>
      {coefficient} × 10<sup>{expVal}</sup>
    </span>
  );
};

export const StoichiometryGrid: React.FC<StoichiometryGridProps> = ({
  reactants, products, coefficients,
  knownMolIndex, knownValue, knownUnit, knownIsReactant,
  targetMolIndex, targetUnit, targetIsReactant
}) => {

  const allMols = [...reactants, ...products];

  // Calculate molar masses
  const molarMasses = allMols.map(m => calculateMolarMass(m).totalMass);

  // Identify Known and Target Data
  const knownMM = molarMasses[knownMolIndex];
  const knownCoeff = coefficients[knownMolIndex];
  const knownFormulaHtml = formatMolecule(allMols[knownMolIndex]);

  const targetCoeff = coefficients[targetMolIndex];
  const targetMM = molarMasses[targetMolIndex];
  const targetFormulaHtml = formatMolecule(allMols[targetMolIndex]);

  // --- Calculations ---

  // Step 1: Convert Known Value to Known Moles
  let knownMoles = 0;
  let step1Top = <></>;
  let step1Bottom = <></>;

  if (knownUnit === 'mol') {
    knownMoles = knownValue;
    step1Top = <span className="text-blue-600 font-bold">{knownValue} mol <Formula html={knownFormulaHtml} /></span>;
    step1Bottom = <span>1 mol <Formula html={knownFormulaHtml} /></span>;
  } else if (knownUnit === 'g') {
    knownMoles = knownValue / knownMM;
    step1Top = <span className="text-blue-600 font-bold">{knownValue} g <Formula html={knownFormulaHtml} /></span>;
    step1Bottom = <span>{knownMM.toFixed(3)} g <Formula html={knownFormulaHtml} /></span>;
  } else { // molecules
    knownMoles = knownValue / AVOGADRO;
    step1Top = <span className="text-blue-600 font-bold">{formatScientific(knownValue)} molecules <Formula html={knownFormulaHtml} /></span>;
    step1Bottom = <span>6.02 × 10<sup>23</sup> molecules <Formula html={knownFormulaHtml} /></span>;
  }

  // Step 2: Mole Ratio
  const targetMoles = knownMoles * (targetCoeff / knownCoeff);

  // Step 3: Convert Target Moles to Target Unit
  let targetValue = 0;
  let step3Top = <></>;
  let step3Bottom = <></>;
  let unitLabel = '';

  if (targetUnit === 'mol') {
    targetValue = targetMoles;
    step3Top = <span>1 mol <Formula html={targetFormulaHtml} /></span>;
    step3Bottom = <span className="text-teal-600 font-bold">1 mol <Formula html={targetFormulaHtml} /></span>;
    unitLabel = 'mol';
  } else if (targetUnit === 'g') {
    targetValue = targetMoles * targetMM;
    step3Top = <span>{targetMM.toFixed(3)} g <Formula html={targetFormulaHtml} /></span>;
    step3Bottom = <span className="text-teal-600 font-bold">1 mol <Formula html={targetFormulaHtml} /></span>;
    unitLabel = 'g';
  } else { // molecules
    targetValue = targetMoles * AVOGADRO;
    step3Top = <span>6.02 × 10<sup>23</sup> molecules <Formula html={targetFormulaHtml} /></span>;
    step3Bottom = <span className="text-teal-600 font-bold">1 mol <Formula html={targetFormulaHtml} /></span>;
    unitLabel = 'molecules';
  }

  // Helper for Cell Classes
  const cellClass = "px-4 py-3 text-center align-middle border-r-2 border-slate-200 last:border-r-0";

  return (
    <div className="space-y-6">

      {/* 1. Summary Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 w-32 font-semibold">Property</th>
              {allMols.map((m, i) => (
                <th key={i} className="px-4 py-3 border-l border-slate-200 text-center">
                  <Formula html={formatMolecule(m)} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-900">Coefficients</td>
              {coefficients.map((c, i) => (
                <td key={i} className="px-4 py-3 border-l border-slate-200 text-center font-bold text-slate-700">
                  {c}
                </td>
              ))}
            </tr>

            <tr className="bg-slate-50/50 border-b border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-900">Molar Mass</td>
              {molarMasses.map((mm, i) => (
                <td key={i} className="px-4 py-3 border-l border-slate-200 text-center font-mono">
                  {mm.toFixed(3)} g/mol
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2. Dimensional Analysis Grid */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Dimensional Analysis</h3>

        <div className="overflow-x-auto pb-2">
          <table className="w-full border-collapse">
            <tbody>
              {/* Top Row: Numerators */}
              <tr>
                {/* Step 1: Given Value */}
                <td className={`${cellClass} font-bold text-slate-800 border-b-2 border-slate-300`}>
                  {step1Top}
                </td>

                {/* Step 1: Conversion Factor (if not moles) */}
                {knownUnit !== 'mol' && (
                  <td className={`${cellClass} text-blue-600 font-bold border-b-2 border-slate-300`}>
                    1 mol <Formula html={knownFormulaHtml} />
                  </td>
                )}

                {/* Step 2: Mole Ratio */}
                <td className={`${cellClass} text-indigo-600 font-bold border-b-2 border-slate-300`}>
                  {targetCoeff} mol <Formula html={targetFormulaHtml} />
                </td>

                {/* Step 3: Conversion Factor (if not moles) */}
                {targetUnit !== 'mol' && (
                  <td className={`${cellClass} text-teal-600 font-bold border-b-2 border-slate-300`}>
                    {step3Top}
                  </td>
                )}

                {/* Result */}
                <td className={`${cellClass} font-bold text-slate-800 border-b-2 border-slate-300`}>
                  = {targetUnit === 'molecules' ? formatScientific(targetValue) : targetValue.toFixed(3)} {unitLabel}
                </td>
              </tr>

              {/* Bottom Row: Denominators */}
              <tr>
                <td className={`${cellClass} h-10`}></td>

                {knownUnit !== 'mol' && (
                  <td className={`${cellClass} text-slate-500 font-medium`}>
                    {step1Bottom}
                  </td>
                )}

                <td className={`${cellClass} text-slate-500 font-medium`}>
                  {knownCoeff} mol <Formula html={knownFormulaHtml} />
                </td>

                {targetUnit !== 'mol' && (
                  <td className={`${cellClass} text-slate-500 font-medium`}>
                    {step3Bottom}
                  </td>
                )}

                <td className={cellClass}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Explanation Steps */}
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-3 text-sm text-slate-600">
          <p><strong className="text-slate-700">1.</strong> Start with <span className="font-semibold">{knownUnit === 'molecules' ? formatScientific(knownValue) : knownValue} {knownUnit}</span> of <Formula html={knownFormulaHtml} />.</p>
          {knownUnit !== 'mol' && (
            <p><strong className="text-slate-700">2.</strong> Convert to moles using {knownUnit === 'g' ? `molar mass (${knownMM.toFixed(3)} g/mol)` : 'Avogadro\'s number'}.</p>
          )}
          <p><strong className="text-slate-700">{knownUnit === 'mol' ? '2' : '3'}.</strong> Use the mole ratio (<strong>{targetCoeff}:{knownCoeff}</strong>) to convert to moles of <Formula html={targetFormulaHtml} />.</p>
          {targetUnit !== 'mol' && (
            <p><strong className="text-slate-700">{knownUnit === 'mol' ? '3' : '4'}.</strong> Convert moles to {targetUnit} using {targetUnit === 'g' ? `molar mass (${targetMM.toFixed(3)} g/mol)` : 'Avogadro\'s number'}.</p>
          )}
        </div>

        {/* Final Result Box */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-blue-200 text-center">
          <span className="text-sm text-slate-500 block mb-1">Final Answer</span>
          <span className="text-2xl font-bold text-slate-800">
            {targetUnit === 'molecules' ? formatScientific(targetValue) : targetValue.toFixed(3)} {targetUnit} <Formula html={targetFormulaHtml} />
          </span>
        </div>
      </div>
    </div>
  );
};
