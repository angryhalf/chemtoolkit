'use client';

import React from 'react';
import { useSigFigs, SigFigMode } from '@/lib/SigFigContext';
import { Settings2 } from 'lucide-react';

export const SigFigSelector: React.FC = () => {
  const { settings, setMode, setFixedCount, toggleHighlightUncertain } = useSigFigs();

  const handleModeChange = (mode: SigFigMode) => {
    setMode(mode);
  };

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-1.5 text-slate-600">
        <Settings2 size={14} />
        <span className="font-medium">Sig Figs:</span>
      </div>

      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
        {(['auto', 'fixed', 'disabled'] as SigFigMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => handleModeChange(mode)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
              settings.mode === mode
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {settings.mode === 'fixed' && (
        <div className="flex items-center gap-1">
          <span className="text-slate-500 text-xs">Count:</span>
          <input
            type="number"
            min={1}
            max={15}
            value={settings.fixedCount}
            onChange={(e) => setFixedCount(parseInt(e.target.value) || 3)}
            className="w-14 px-2 py-1 text-xs border border-slate-200 rounded-md text-center"
          />
        </div>
      )}

      <button
        onClick={toggleHighlightUncertain}
        className={`px-2 py-1 rounded-md text-xs font-medium transition border ${
          settings.highlightUncertain
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : 'bg-slate-50 text-slate-400 border-slate-200'
        }`}
        title="Highlight uncertain digits in results"
      >
        Highlight
      </button>
    </div>
  );
};
