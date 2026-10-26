import React from 'react';
import {
  AlgorithmType,
  ArrayPreset,
} from '../types/sorting';
import { ALGORITHM_METADATA } from '../algorithms/codeSnippets';
import { Code, Shuffle, HelpCircle, Edit3, Globe } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface TopBarProps {
  currentAlgorithm: AlgorithmType;
  onSelectAlgorithm: (algo: AlgorithmType) => void;
  currentPreset: ArrayPreset;
  onSelectPreset: (preset: ArrayPreset) => void;
  comparisonsCount: number;
  swapsCount: number;
  currentStepIndex: number;
  totalSteps: number;
  onOpenCustomModal: () => void;
  onOpenInfoModal: () => void;
  onOpenDeployModal: () => void;
  showCodeInspector: boolean;
  onToggleCodeInspector: () => void;
  isSorted: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentAlgorithm,
  onSelectAlgorithm,
  currentPreset,
  onSelectPreset,
  comparisonsCount,
  swapsCount,
  currentStepIndex,
  totalSteps,
  onOpenCustomModal,
  onOpenInfoModal,
  onOpenDeployModal,
  showCodeInspector,
  onToggleCodeInspector,
  isSorted,
}) => {
  const meta = ALGORITHM_METADATA[currentAlgorithm];

  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-2.5 sm:p-4 flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2.5 w-full">
        {/* Left: Brand & Algorithm Selector */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-5 bg-gradient-to-b from-sky-400 to-indigo-500 rounded-full" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold tracking-widest text-sky-400 uppercase">SORT3D</span>
                <span className="text-[9px] text-slate-400 border border-slate-700 rounded px-1 font-mono">alg0.dev</span>
              </div>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-800 mx-0.5" />

          {/* Algorithm Dropdown */}
          <select
            value={currentAlgorithm}
            onChange={(e) => onSelectAlgorithm(e.target.value as AlgorithmType)}
            className="bg-slate-800 text-slate-100 font-medium text-xs sm:text-sm rounded-lg px-2 py-1 border border-slate-700 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="bubble">Bubble Sort (Featured)</option>
            <option value="quick">Quick Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="heap">Heap Sort</option>
            <option value="cocktail">Cocktail Shaker Sort</option>
          </select>

          {/* Learn / Info modal trigger */}
          <button
            onClick={onOpenInfoModal}
            title="Algorithm Theory & Mechanics"
            className="p-1 text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Complexity Badges (visible on desktop) */}
        <div className="hidden xl:flex items-center gap-2 pointer-events-auto bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs shadow-xl">
          <span className="text-slate-400">Time:</span>
          <span className="font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40" title="Best Case">
            {meta.timeBest}
          </span>
          <span className="font-mono text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40" title="Average Case">
            {meta.timeAvg}
          </span>
          <span className="font-mono text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-800/40" title="Worst Case">
            {meta.timeWorst}
          </span>
          <div className="h-3 w-px bg-slate-800 mx-0.5" />
          <span className="text-slate-400">Space:</span>
          <span className="font-mono text-sky-400 bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-800/40">
            {meta.spaceWorst}
          </span>
          <div className="h-3 w-px bg-slate-800 mx-0.5" />
          <span className="text-slate-400">Stable:</span>
          <span className={`font-mono px-1.5 py-0.5 rounded border ${meta.stable ? 'text-teal-400 bg-teal-950/40 border-teal-800/40' : 'text-slate-400 bg-slate-800 border-slate-700'}`}>
            {meta.stable ? 'Yes' : 'No'}
          </span>
        </div>

        {/* Right: Live Metrics, PWA Install & Code Toggle */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* GitHub Pages Deploy Guide button */}
          <button
            onClick={onOpenDeployModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white font-medium text-xs border border-slate-700 transition-colors shadow-sm cursor-pointer"
            title="Deploy to GitHub Pages (Free Public Link)"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">GitHub Pages</span>
          </button>

          {/* PWA Install / Offline Button */}
          <PWAInstallButton />

          {/* Real-time counters */}
          <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs shadow-xl font-mono">
            <div>
              <span className="text-slate-500 uppercase text-[9px] block">Compares</span>
              <span className="text-amber-400 font-bold">{comparisonsCount}</span>
            </div>
            <div className="h-3.5 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 uppercase text-[9px] block">Swaps</span>
              <span className="text-pink-400 font-bold">{swapsCount}</span>
            </div>
            <div className="h-3.5 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 uppercase text-[9px] block">Step</span>
              <span className="text-slate-200">
                {currentStepIndex + 1}/{Math.max(totalSteps, 1)}
              </span>
            </div>
            {isSorted && (
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                SORTED
              </span>
            )}
          </div>

          {/* Toggle Code Inspector button */}
          <button
            onClick={onToggleCodeInspector}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-xl border transition-all ${
              showCodeInspector
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Code & Logic</span>
          </button>
        </div>
      </div>

      {/* Preset bar */}
      <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 border border-slate-800 rounded-xl p-1.5 self-start text-xs shadow-lg max-w-full overflow-x-auto">
        <span className="text-slate-400 px-1.5 font-medium flex items-center gap-1 whitespace-nowrap">
          <Shuffle className="w-3 h-3 text-slate-500" /> Array:
        </span>
        {(['random', 'reversed', 'nearly_sorted', 'few_unique', 'already_sorted'] as ArrayPreset[]).map((p) => {
          const labels: Record<ArrayPreset, string> = {
            random: 'Random',
            reversed: 'Reversed (Worst)',
            nearly_sorted: 'Nearly Sorted',
            few_unique: 'Few Unique',
            already_sorted: 'Already Sorted (Best)',
          };
          return (
            <button
              key={p}
              onClick={() => onSelectPreset(p)}
              className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                currentPreset === p
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {labels[p]}
            </button>
          );
        })}

        <button
          onClick={onOpenCustomModal}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          title="Enter custom array values"
        >
          <Edit3 className="w-3 h-3 text-sky-400" />
          <span>Custom...</span>
        </button>
      </div>
    </header>
  );
};
