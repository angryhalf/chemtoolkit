"use client";

import { useState, useEffect } from 'react';
import { Wind, Calculator, Trash2 } from 'lucide-react';
import { calculateGasLaw, GasLaw, GasLawInput, GasLawResult } from '@/lib/chemistryEngine';
import { CopyButton } from '@/components/CopyButton';
import { useSigFigs } from '@/lib/SigFigContext';
import { SigFigDisplay } from '@/components/SigFigDisplay';
import { SigFigSelector } from '@/components/SigFigSelector';
import { parseSigFigsFromInput } from '@/lib/sigfigs';

interface HistoryItem {
  id: string;
  input: GasLawInput;
  result: GasLawResult;
  timestamp: number;
}

export default function GasLawsPage() {
  const [law, setLaw] = useState<GasLaw>('boyle');
  const [pressure1, setPressure1] = useState('');
  const [pressure2, setPressure2] = useState('');
  const [volume1, setVolume1] = useState('');
  const [volume2, setVolume2] = useState('');
  const [temp1, setTemp1] = useState('');
  const [temp2, setTemp2] = useState('');
  const [pressureUnit, setPressureUnit] = useState<'atm' | 'kPa' | 'mmHg'>('atm');
  const [volumeUnit, setVolumeUnit] = useState<'L' | 'mL'>('L');
  const [temperatureUnit, setTemperatureUnit] = useState<'K' | 'C' | 'F'>('K');
  const [result, setResult] = useState<GasLawResult | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { settings, resolveSigFigs } = useSigFigs();

  useEffect(() => {
    const saved = localStorage.getItem('gasLawsHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveHistory = (newHistory: HistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem('gasLawsHistory', JSON.stringify(newHistory));
  };

  const handleCalculate = () => {
    setError('');
    setResult(null);

    const input: GasLawInput = {
      law,
      pressure: pressure1 ? parseFloat(pressure1) : undefined,
      volume: volume1 ? parseFloat(volume1) : undefined,
      temperature: temp1 ? parseFloat(temp1) : undefined,
      pressureUnit,
      volumeUnit,
      temperatureUnit,
      p2: pressure2 ? parseFloat(pressure2) : undefined,
      v2: volume2 ? parseFloat(volume2) : undefined,
      t2: temp2 ? parseFloat(temp2) : undefined,
    };

    if (law === 'boyle') {
      if (!input.pressure || !input.volume) {
        setError('Please provide Pressure and Volume');
        return;
      }
    } else if (law === 'charles') {
      if (!input.volume || !input.temperature) {
        setError('Please provide Volume and Temperature');
        return;
      }
    } else if (law === 'combined') {
      if (!input.pressure || !input.volume || !input.temperature) {
        setError('Please provide Pressure, Volume, and Temperature');
        return;
      }
    }

    try {
      const res = calculateGasLaw(input);
      setResult(res);
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        input,
        result: res,
        timestamp: Date.now(),
      };
      saveHistory([newItem, ...history.slice(0, 9)]);
    } catch (e) {
      setError('Calculation error. Please check your inputs.');
    }
  };

  const clearHistory = () => {
    saveHistory([]);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setLaw(item.input.law);
    setPressure1(item.input.pressure?.toString() || '');
    setPressure2(item.input.p2?.toString() || '');
    setVolume1(item.input.volume?.toString() || '');
    setVolume2(item.input.v2?.toString() || '');
    setTemp1(item.input.temperature?.toString() || '');
    setTemp2(item.input.t2?.toString() || '');
    setPressureUnit(item.input.pressureUnit);
    setVolumeUnit(item.input.volumeUnit);
    setTemperatureUnit(item.input.temperatureUnit);
    setResult(item.result);
    setError('');
  };

  const getLawDescription = (l: GasLaw) => {
    const descriptions: Record<GasLaw, string> = {
      boyle: "Relates pressure and volume at constant temperature (P₁V₁ = P₂V₂)",
      charles: "Relates volume and temperature at constant pressure (V₁/T₁ = V₂/T₂)",
      combined: "Combines Boyle's and Charles's laws ((P₁V₁)/T₁ = (P₂V₂)/T₂)",
    };
    return descriptions[l];
  };

  const detectInputSigFigs = (): number => {
    const inputs = [pressure1, volume1, temp1, pressure2, volume2, temp2].filter(v => v !== '');
    if (inputs.length === 0) return 3;
    const sigFigsArr = inputs.map(v => parseSigFigsFromInput(v).sigFigs).filter(s => s > 0);
    return sigFigsArr.length > 0 ? Math.min(...sigFigsArr) : 3;
  };

  const calcSigFigs = resolveSigFigs(detectInputSigFigs());

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
          <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
            <Wind size={24} />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Gas Laws Calculator</h2>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Gas Law</label>
          <select
            value={law}
            onChange={(e) => setLaw(e.target.value as GasLaw)}
            className="w-full p-3 rounded-lg border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            <option value="boyle">Boyle&apos;s Law</option>
            <option value="charles">Charles&apos;s Law</option>
            <option value="combined">Combined Gas Law</option>
          </select>
          <p className="mt-2 text-sm text-slate-500">{getLawDescription(law)}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Initial Values</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {(law === 'boyle' || law === 'combined') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Pressure (P₁)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={pressure1}
                    onChange={(e) => setPressure1(e.target.value)}
                    placeholder="Enter pressure"
                    className="flex-1 p-3 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <select
                    value={pressureUnit}
                    onChange={(e) => setPressureUnit(e.target.value as typeof pressureUnit)}
                    className="w-24 p-3 rounded-lg border border-slate-200 bg-white text-slate-800"
                  >
                    <option value="atm">atm</option>
                    <option value="kPa">kPa</option>
                    <option value="mmHg">mmHg</option>
                  </select>
                </div>
              </div>
            )}

            {(law === 'charles' || law === 'combined') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Temperature (T₁)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={temp1}
                    onChange={(e) => setTemp1(e.target.value)}
                    placeholder="Enter temperature"
                    className="flex-1 p-3 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <select
                    value={temperatureUnit}
                    onChange={(e) => setTemperatureUnit(e.target.value as typeof temperatureUnit)}
                    className="w-24 p-3 rounded-lg border border-slate-200 bg-white text-slate-800"
                  >
                    <option value="K">K</option>
                    <option value="C">°C</option>
                    <option value="F">°F</option>
                  </select>
                </div>
              </div>
            )}

            {(law === 'boyle' || law === 'charles' || law === 'combined') && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Volume (V₁)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={volume1}
                    onChange={(e) => setVolume1(e.target.value)}
                    placeholder="Enter volume"
                    className="flex-1 p-3 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <select
                    value={volumeUnit}
                    onChange={(e) => setVolumeUnit(e.target.value as typeof volumeUnit)}
                    className="w-24 p-3 rounded-lg border border-slate-200 bg-white text-slate-800"
                  >
                    <option value="L">L</option>
                    <option value="mL">mL</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {(law === 'boyle' || law === 'charles' || law === 'combined') && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Final Values (leave one empty to solve for)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {(law === 'boyle' || law === 'combined') && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Pressure (P₂)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={pressure2}
                      onChange={(e) => setPressure2(e.target.value)}
                      placeholder="Enter final pressure"
                      className="flex-1 p-3 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                    <select
                      value={pressureUnit}
                      onChange={(e) => setPressureUnit(e.target.value as typeof pressureUnit)}
                      className="w-24 p-3 rounded-lg border border-slate-200 bg-white text-slate-800"
                    >
                      <option value="atm">atm</option>
                      <option value="kPa">kPa</option>
                      <option value="mmHg">mmHg</option>
                    </select>
                  </div>
                </div>
              )}
              {(law === 'charles' || law === 'combined') && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Temperature (T₂)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={temp2}
                      onChange={(e) => setTemp2(e.target.value)}
                      placeholder="Enter final temperature"
                      className="flex-1 p-3 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                    <select
                      value={temperatureUnit}
                      onChange={(e) => setTemperatureUnit(e.target.value as typeof temperatureUnit)}
                      className="w-24 p-3 rounded-lg border border-slate-200 bg-white text-slate-800"
                    >
                      <option value="K">K</option>
                      <option value="C">°C</option>
                      <option value="F">°F</option>
                    </select>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Volume (V₂)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={volume2}
                    onChange={(e) => setVolume2(e.target.value)}
                    placeholder="Enter final volume"
                    className="flex-1 p-3 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <select
                    value={volumeUnit}
                    onChange={(e) => setVolumeUnit(e.target.value as typeof volumeUnit)}
                    className="w-24 p-3 rounded-lg border border-slate-200 bg-white text-slate-800"
                  >
                    <option value="L">L</option>
                    <option value="mL">mL</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleCalculate}
          className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition shadow-sm flex items-center gap-2"
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
            <div className="text-4xl font-bold text-violet-600 mb-2">
              <SigFigDisplay value={result.value} sigFigs={calcSigFigs} unit={result.unit} />
            </div>
            <p className="text-sm text-slate-500">{result.unknown}</p>
            
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm font-medium text-slate-600">Formula: <code className="bg-slate-100 px-2 py-1 rounded">{result.formula}</code></p>
              {settings.mode !== 'disabled' && (
                <p className="text-xs text-slate-400 mt-1">Using {calcSigFigs} significant figures</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-4">Step-by-Step Solution</h3>
            <div className="bg-slate-50 p-4 rounded-lg font-mono text-xs text-slate-600 space-y-1 border border-slate-100">
              {result.steps.map((step, i) => (
                <div 
                  key={i} 
                  className={
                    step.type === 'calculation' ? 'pl-4 text-slate-500' : 
                    step.type === 'result' ? 'font-semibold text-violet-700 mt-2' : 
                    'font-semibold text-slate-700 mt-2'
                  }
                >
                  {step.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-700">Calculation History</h3>
            <button
              onClick={clearHistory}
              className="p-2 text-slate-400 hover:text-red-500 transition"
              title="Clear history"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div className="space-y-2">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => loadFromHistory(item)}
                className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-slate-700">{item.input.law} Law</span>
                  <span className="text-sm text-slate-500">
                    {formatResult(item.result.value)} {item.result.unit}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(item.timestamp).toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
