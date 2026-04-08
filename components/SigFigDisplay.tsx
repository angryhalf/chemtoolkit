'use client';

import React from 'react';
import { useSigFigs } from '@/lib/SigFigContext';
import { formatSigFigs } from '@/lib/sigfigs';

interface SigFigDisplayProps {
  value: number;
  sigFigs: number;
  unit?: string;
  className?: string;
}

export const SigFigDisplay: React.FC<SigFigDisplayProps> = ({ value, sigFigs, unit, className = '' }) => {
  const { settings } = useSigFigs();

  if (settings.mode === 'disabled') {
    return (
      <span className={className}>
        {value.toFixed(4)}{unit ? ` ${unit}` : ''}
      </span>
    );
  }

  const absVal = Math.abs(value);
  const useScientific = absVal >= 1e6 || (absVal < 1e-3 && absVal !== 0);

  if (useScientific) {
    const formatted = value.toExponential(sigFigs - 1);
    return (
      <span className={className}>
        {formatted}{unit ? ` ${unit}` : ''}
      </span>
    );
  }

  if (!settings.highlightUncertain || sigFigs <= 0) {
    return (
      <span className={className}>
        {formatSigFigs(value, sigFigs)}{unit ? ` ${unit}` : ''}
      </span>
    );
  }

  const d = Math.ceil(Math.log10(absVal));
  const decimals = Math.max(0, sigFigs - d);
  const fixedStr = value.toFixed(decimals);
  const parts = fixedStr.split('.');
  const intPart = parts[0];
  const decPart = parts[1] || '';

  const uncertainCount = Math.max(1, decPart.length > 0 ? 1 : 0);
  const certainDecimals = Math.max(0, decPart.length - uncertainCount);

  return (
    <span className={className}>
      {intPart}
      {decPart.length > 0 && (
        <>
          .{decPart.slice(0, certainDecimals)}
          <span className="text-amber-600 font-semibold">{decPart.slice(certainDecimals)}</span>
        </>
      )}
      {unit ? ` ${unit}` : ''}
    </span>
  );
};
