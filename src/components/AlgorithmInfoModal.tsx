import React from 'react';
import { X, BookOpen, Volume2, Sparkles, Cpu } from 'lucide-react';
import { AlgorithmType } from '../types/sorting';
import { ALGORITHM_METADATA } from '../algorithms/codeSnippets';

interface AlgorithmInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAlgorithm: AlgorithmType;
}

export const AlgorithmInfoModal: React.FC<AlgorithmInfoModalProps> = ({
  isOpen,
  onClose,
  currentAlgorithm,
}) => {
  if (!isOpen) return null;

  const meta = ALGORITHM_METADATA[currentAlgorithm];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-none overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-slate-100 my-8 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/10 border border-sky-500/30 rounded-2xl text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">{meta.name} Deep Dive</h2>
              <p className="text-xs text-slate-400">Inspired by alg0.dev interactive algorithm pedagogy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="my-5 space-y-5 text-sm">
          {/* Main concept */}
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl">
            <h3 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> The Mechanics
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
              {meta.conceptSummary}
            </p>
          </div>

          {/* Bubble Sort specific deep dive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-2xl">
              <h4 className="text-xs font-semibold text-amber-400 mb-1.5">Why "Bubble"?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Just like physical bubbles rising to the water's surface, the heaviest (largest) numbers drift toward the end of the array one adjacent comparison at a time during each pass.
              </p>
            </div>

            <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-2xl">
              <h4 className="text-xs font-semibold text-emerald-400 mb-1.5">Early Exit Optimization</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                If an entire pass completes with zero swaps, we immediately know the array is already sorted, stopping early in O(n) best-case linear time!
              </p>
            </div>
          </div>

          {/* Spatial Sound synthesis explanation */}
          <div className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-2xl">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4" /> Spatial Web Audio Synthesis
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every bar's value is procedurally mapped to a musical scale frequency (130 Hz - 1800 Hz). In addition, each element is positioned in a stereo soundstage based on its array index: elements on the left side emit sound into your left speaker/ear, while elements on the right emit into your right ear!
            </p>
          </div>

          {/* Complexity Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Complexity Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Metric</th>
                    <th className="p-2.5">Bubble Sort</th>
                    <th className="p-2.5">Quick Sort</th>
                    <th className="p-2.5">Merge Sort</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                  <tr>
                    <td className="p-2.5 text-slate-400 font-sans">Best Time</td>
                    <td className="p-2.5 text-emerald-400">O(n)</td>
                    <td className="p-2.5 text-sky-400">O(n log n)</td>
                    <td className="p-2.5 text-sky-400">O(n log n)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-400 font-sans">Avg Time</td>
                    <td className="p-2.5 text-amber-400">O(n²)</td>
                    <td className="p-2.5 text-emerald-400">O(n log n)</td>
                    <td className="p-2.5 text-emerald-400">O(n log n)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-400 font-sans">Worst Time</td>
                    <td className="p-2.5 text-rose-400">O(n²)</td>
                    <td className="p-2.5 text-rose-400">O(n²)</td>
                    <td className="p-2.5 text-emerald-400">O(n log n)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-400 font-sans">Aux Space</td>
                    <td className="p-2.5 text-emerald-400">O(1)</td>
                    <td className="p-2.5 text-sky-400">O(log n)</td>
                    <td className="p-2.5 text-amber-400">O(n)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
