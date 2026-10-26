import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface CustomArrayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (numbers: number[]) => void;
  currentArray: number[];
}

export const CustomArrayModal: React.FC<CustomArrayModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentArray,
}) => {
  const [text, setText] = useState(currentArray.join(', '));
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApply = () => {
    const rawTokens = text.split(/[\s,]+/);
    const parsed: number[] = [];

    for (const t of rawTokens) {
      if (!t.trim()) continue;
      const num = Number(t.trim());
      if (isNaN(num) || num < 1 || num > 100) {
        setError(`"${t}" is not a valid number. Please provide positive integers between 1 and 100.`);
        return;
      }
      parsed.push(Math.round(num));
    }

    if (parsed.length < 4) {
      setError('Please provide at least 4 numbers.');
      return;
    }
    if (parsed.length > 40) {
      setError('Maximum 40 numbers allowed for optimal 3D clarity.');
      return;
    }

    setError(null);
    onSubmit(parsed);
    onClose();
  };

  const samplePresets: { label: string; values: number[] }[] = [
    { label: 'alg0.dev classic', values: [38, 27, 43, 3, 9, 82, 10, 19] },
    { label: 'Steep Pyramidal', values: [5, 18, 32, 50, 75, 45, 28, 12] },
    { label: 'Worst-case Descending', values: [80, 70, 60, 50, 40, 30, 20, 10] },
    { label: 'Duplicated Peaks', values: [20, 45, 20, 70, 45, 90, 70, 15] },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-5 text-slate-100 animate-fadeIn">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-semibold text-slate-100">Custom Array Input</h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="my-4 space-y-3">
          <label className="text-xs text-slate-400 block">
            Enter numbers separated by commas or spaces (1 - 100):
          </label>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError(null);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-mono text-sky-300 focus:outline-none focus:border-sky-500 resize-none"
            placeholder="e.g. 15, 42, 8, 93, 27, 64, 11"
          />

          {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

          <div>
            <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider block mb-2">
              Quick Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              {samplePresets.map((sp) => (
                <button
                  key={sp.label}
                  onClick={() => {
                    setText(sp.values.join(', '));
                    setError(null);
                  }}
                  className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700/60"
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-md"
          >
            <Check className="w-4 h-4" />
            Apply Array
          </button>
        </div>
      </div>
    </div>
  );
};
