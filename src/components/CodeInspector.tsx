import React, { useState } from 'react';
import { AlgorithmType, SortStep } from '../types/sorting';
import { ALGORITHM_CODE_SNIPPETS } from '../algorithms/codeSnippets';
import { X, CheckCircle, ArrowRightLeft, Eye, Award } from 'lucide-react';

interface CodeInspectorProps {
  algorithm: AlgorithmType;
  currentStep: SortStep | null;
  onClose: () => void;
}

export const CodeInspector: React.FC<CodeInspectorProps> = ({
  algorithm,
  currentStep,
  onClose,
}) => {
  const [selectedLang, setSelectedLang] = useState<'javascript' | 'python'>('javascript');

  const snippets = ALGORITHM_CODE_SNIPPETS[algorithm] || ALGORITHM_CODE_SNIPPETS.bubble;
  const lines = snippets[selectedLang] || snippets.javascript;
  const activeLine = currentStep ? currentStep.codeLine : -1;

  const getActionBadge = () => {
    if (!currentStep) return null;
    switch (currentStep.action) {
      case 'compare':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Eye className="w-3 h-3" /> Comparing
          </span>
        );
      case 'swap':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/30">
            <ArrowRightLeft className="w-3 h-3" /> Swapping
          </span>
        );
      case 'mark_sorted':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle className="w-3 h-3" /> Element Fixed
          </span>
        );
      case 'finish':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <Award className="w-3 h-3" /> Complete!
          </span>
        );
      default:
        return null;
    }
  };

  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  return (
    <div
      className={`fixed top-24 right-3 sm:right-5 z-20 transition-all duration-200 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
        isMinimized ? 'w-64' : 'w-72 sm:w-88'
      } max-h-[calc(100vh-210px)] animate-fadeIn`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-200">Execution Logic</span>
          {!isMinimized && (
            <div className="flex items-center gap-1 bg-slate-800 rounded p-0.5 text-[10px] ml-1">
              <button
                onClick={() => setSelectedLang('javascript')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  selectedLang === 'javascript' ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                JS
              </button>
              <button
                onClick={() => setSelectedLang('python')}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  selectedLang === 'python' ? 'bg-sky-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                PY
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Expand inspector' : 'Minimize inspector'}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-[10px] font-mono px-1.5"
          >
            {isMinimized ? 'EXPAND' : 'MIN'}
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Real-time Step Description Banner */}
      <div className="p-2.5 bg-slate-800/40 border-b border-slate-800/80">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Current Operation</span>
          {getActionBadge()}
        </div>
        <p className="text-[11px] text-slate-200 font-mono leading-relaxed bg-slate-950/60 p-2 rounded-lg border border-slate-800/60">
          {currentStep ? currentStep.description : 'Press Play or Step Forward to begin execution...'}
        </p>
      </div>

      {/* Code Listing with Active Line Highlighter (Hidden when minimized) */}
      {!isMinimized && (
        <div className="flex-1 overflow-y-auto p-2.5 font-mono text-[11px] text-slate-300 space-y-0.5 bg-slate-950/80">
          {lines.map((line) => {
            const isHighlighted = line.lineNumber === activeLine;
            return (
              <div
                key={line.lineNumber}
                className={`flex items-start gap-2 px-1.5 py-0.5 rounded transition-colors ${
                  isHighlighted
                    ? 'bg-sky-500/25 border-l-2 border-sky-400 text-sky-100 font-semibold shadow-inner'
                    : 'hover:bg-slate-900/60'
                }`}
              >
                <span className="w-4 text-right text-slate-500 select-none text-[10px] pt-0.5">
                  {line.lineNumber}
                </span>
                <pre className="flex-1 overflow-x-auto whitespace-pre font-mono">
                  {line.text}
                </pre>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
