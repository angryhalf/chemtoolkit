"use client";

import React from 'react';
import { Molecule, formatMolecule, calculateMolarMass } from '@/lib/chemistryEngine';

interface StoichiometryGridProps {
  reactants: Molecule[];
  products: Molecule[];
  coefficients: number[];
  knownMolIndex: number;
  knownValue: number; // Grams
  knownIsReactant: boolean;
  targetMolIndex: number;
  targetIsReactant: boolean;
}

// Helper to safely render HTML formulas
const Formula = ({ html }: { html: string }) => (
  <span dangerouslySetInnerHTML={{ __html: html }} />
);

export const StoichiometryGrid: React.FC<StoichiometryGridProps> = ({
  reactants, products, coefficients,
  knownMolIndex, knownValue, knownIsReactant,
  targetMolIndex, targetIsReactant
}) => {

  const allMols = [...reactants, ...products];

  // Calculate molar masses
  const molarMasses = allMols.map(m => calculateMolarMass(m).totalMass);

  // Identify Known and Target Data
  const knownMass = knownValue;
  const knownMM = molarMasses[knownMolIndex];
  const knownCoeff = coefficients[knownMolIndex];
  const knownFormulaHtml = formatMolecule(allMols[knownMolIndex]);

  const targetCoeff = coefficients[targetMolIndex];
  const targetMM = molarMasses[targetMolIndex];
  const targetFormulaHtml = formatMolecule(allMols[targetMolIndex]);

  // Calculations
  const knownMoles = knownMass / knownMM;
  const targetMoles = knownMoles * (targetCoeff / knownCoeff);
  const targetMass = targetMoles * targetMM;

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

            <tr className="bg-white">
              <td className="px-4 py-3 font-medium text-slate-900">Values</td>
              {allMols.map((_, i) => {
                const isKnown = i === knownMolIndex;
                const isTarget = i === targetMolIndex;
                return (
                  <td
                    key={i}
                    className={`px-4 py-3 border-l border-slate-200 text-center font-semibold ${isKnown ? 'bg-blue-50 text-blue-700' :
                        isTarget ? 'bg-green-50 text-green-700' : 'text-slate-400'
                      }`}
                  >
                    {isKnown && `${knownMass} g`}
                    {isTarget && `? g`}
                    {!isKnown && !isTarget && '—'}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2. Dimensional Analysis Grid (Train Track Style) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Dimensional Analysis</h3>

        <div className="overflow-x-auto pb-2">
          <table className="w-full border-collapse text-center">
            <tbody>
              {/* Row 1: Numerators (The "Given" and Top of Conversions) */}
              <tr>
                {/* Given Value */}
                <td className="px-2 py-2 min-w-[80px] font-bold text-slate-800 border-b-2 border-slate-300">
                  {knownMass} g
                </td>

                {/* Conversion 1: Mass -> Moles */}
                <td className="px-2 py-2 min-w-[80px] text-blue-600 font-bold border-b-2 border-slate-300">
                  1 mol <Formula html={knownFormulaHtml} />
                </td>

                {/* Conversion 2: Mole Ratio */}
                <td className="px-2 py-2 min-w-[80px] text-indigo-600 font-bold border-b-2 border-slate-300">
                  {targetCoeff} mol <Formula html={targetFormulaHtml} />
                </td>

                {/* Conversion 3: Moles -> Mass */}
                <td className="px-2 py-2 min-w-[80px] text-teal-600 font-bold border-b-2 border-slate-300">
                  {targetMM.toFixed(3)} g
                </td>

                {/* Result */}
                <td className="px-2 py-2 min-w-[80px] font-bold text-slate-800 border-b-2 border-slate-300">
                  = {targetMass.toFixed(3)} g
                </td>
              </tr>

              {/* Row 2: Denominators (The Units to Cancel) */}
              <tr>
                <td className="px-2 py-2 min-w-[80px] h-8"></td> {/* Empty under given */}

                {/* Denominator 1 */}
                <td className="px-2 py-2 min-w-[80px] text-slate-500 font-medium">
                  {knownMM.toFixed(3)} g
                </td>

                {/* Denominator 2 */}
                <td className="px-2 py-2 min-w-[80px] text-slate-500 font-medium">
                  {knownCoeff} mol <Formula html={knownFormulaHtml} />
                </td>

                {/* Denominator 3 */}
                <td className="px-2 py-2 min-w-[80px] text-slate-500 font-medium">
                  1 mol <Formula html={targetFormulaHtml} />
                </td>

                <td className="px-2 py-2 min-w-[80px]"></td> {/* Empty under result */}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Explanation Steps */}
        <div className="mt-6 pt-4 border-t border-slate-100 space-y-3 text-sm text-slate-600">
          <p><strong className="text-slate-700">1.</strong> Start with <span className="font-semibold">{knownMass} g</span> of <Formula html={knownFormulaHtml} />.</p>
          <p><strong className="text-slate-700">2.</strong> Convert grams to moles using molar mass ({knownMM.toFixed(3)} g/mol).</p>
          <p><strong className="text-slate-700">3.</strong> Use the mole ratio (<strong>{targetCoeff}:{knownCoeff}</strong>) to convert to moles of <Formula html={targetFormulaHtml} />.</p>
          <p><strong className="text-slate-700">4.</strong> Convert moles to grams using molar mass ({targetMM.toFixed(3)} g/mol).</p>
        </div>

        {/* Final Result Box */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border border-blue-200 text-center">
          <span className="text-sm text-slate-500 block mb-1">Final Answer</span>
          <span className="text-2xl font-bold text-slate-800">
            {targetMass.toFixed(3)} g <Formula html={targetFormulaHtml} />
          </span>
        </div>
      </div>
    </div>
  );
};