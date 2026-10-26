import React, { useState, useRef, useEffect } from 'react';
import {
  AlgorithmType,
  ArrayPreset,
} from '../types/sorting';
import { ALGORITHM_METADATA } from '../algorithms/codeSnippets';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { Code, Shuffle, HelpCircle, Edit3, Languages, ChevronDown, Check } from 'lucide-react';
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
  showCodeInspector: boolean;
  onToggleCodeInspector: () => void;
  isSorted: boolean;
  language: Language;
  onChangeLanguage: (lang: Language) => void;
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
  showCodeInspector,
  onToggleCodeInspector,
  isSorted,
  language,
  onChangeLanguage,
}) => {
  const meta = ALGORITHM_METADATA[currentAlgorithm];
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isRtl = language === 'ar';

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState<boolean>(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languageOptions: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇩🇿' },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-2 sm:p-3.5 flex flex-col gap-2" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="flex flex-wrap items-center justify-between gap-2 w-full">
        {/* Left: Teacher Branding & Algorithm Selector */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-5 bg-gradient-to-b from-sky-400 to-indigo-500 rounded-full" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold tracking-wider text-sky-400 uppercase">SORT3D</span>
                <span className="text-[10px] text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-800/40 rounded px-1.5 py-0.5">
                  {t.teacherName}
                </span>
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
            <option value="bubble">{t.algorithms.bubble}</option>
            <option value="quick">{t.algorithms.quick}</option>
            <option value="merge">{t.algorithms.merge}</option>
            <option value="insertion">{t.algorithms.insertion}</option>
            <option value="selection">{t.algorithms.selection}</option>
            <option value="heap">{t.algorithms.heap}</option>
            <option value="cocktail">{t.algorithms.cocktail}</option>
          </select>

          {/* Learn / Info modal trigger */}
          <button
            onClick={onOpenInfoModal}
            title={t.codeAndLogic}
            className="p-1 text-slate-400 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Complexity Badges (visible on large screens) */}
        <div className="hidden xl:flex items-center gap-2 pointer-events-auto bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs shadow-xl">
          <span className="text-slate-400">{t.complexity.time}</span>
          <span className="font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40" title="Best">
            {meta.timeBest}
          </span>
          <span className="font-mono text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40" title="Average">
            {meta.timeAvg}
          </span>
          <span className="font-mono text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-800/40" title="Worst">
            {meta.timeWorst}
          </span>
          <div className="h-3 w-px bg-slate-800 mx-0.5" />
          <span className="text-slate-400">{t.complexity.space}</span>
          <span className="font-mono text-sky-400 bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-800/40">
            {meta.spaceWorst}
          </span>
          <div className="h-3 w-px bg-slate-800 mx-0.5" />
          <span className="text-slate-400">{t.complexity.stable}</span>
          <span className={`font-mono px-1.5 py-0.5 rounded border ${meta.stable ? 'text-teal-400 bg-teal-950/40 border-teal-800/40' : 'text-slate-400 bg-slate-800 border-slate-700'}`}>
            {meta.stable ? t.complexity.yes : t.complexity.no}
          </span>
        </div>

        {/* Right: Language Selector, PWA Install & Code Toggle */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* Language Selector Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white font-medium text-xs border border-slate-700 transition-colors shadow-sm cursor-pointer"
              title="Change Language / Changer la langue / تغيير اللغة"
            >
              <Languages className="w-3.5 h-3.5 text-sky-400" />
              <span className="uppercase font-bold">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangDropdownOpen && (
              <div
                className={`absolute top-full mt-1.5 ${isRtl ? 'left-0' : 'right-0'} z-50 w-36 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1 text-xs`}
              >
                {languageOptions.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => {
                      onChangeLanguage(opt.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-800 transition-colors cursor-pointer ${
                      language === opt.code ? 'text-sky-300 font-bold bg-sky-950/30' : 'text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{opt.flag}</span>
                      <span>{opt.label}</span>
                    </span>
                    {language === opt.code && <Check className="w-3.5 h-3.5 text-sky-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PWA Install / Offline Button */}
          <PWAInstallButton />

          {/* Real-time counters */}
          <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs shadow-xl font-mono">
            <div>
              <span className="text-slate-500 uppercase text-[9px] block">{t.compares}</span>
              <span className="text-amber-400 font-bold">{comparisonsCount}</span>
            </div>
            <div className="h-3.5 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 uppercase text-[9px] block">{t.swaps}</span>
              <span className="text-pink-400 font-bold">{swapsCount}</span>
            </div>
            <div className="h-3.5 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 uppercase text-[9px] block">{t.step}</span>
              <span className="text-slate-200">
                {currentStepIndex + 1}/{Math.max(totalSteps, 1)}
              </span>
            </div>
            {isSorted && (
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                {t.sorted}
              </span>
            )}
          </div>

          {/* Toggle Code Inspector button */}
          <button
            onClick={onToggleCodeInspector}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
              showCodeInspector
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.codeAndLogic}</span>
          </button>
        </div>
      </div>

      {/* Preset bar */}
      <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 border border-slate-800 rounded-xl p-1.5 self-start text-xs shadow-lg max-w-full overflow-x-auto">
        <span className="text-slate-400 px-1.5 font-medium flex items-center gap-1 whitespace-nowrap">
          <Shuffle className="w-3 h-3 text-slate-500" /> {t.array}
        </span>
        {(['random', 'reversed', 'nearly_sorted', 'few_unique', 'already_sorted'] as ArrayPreset[]).map((p) => {
          return (
            <button
              key={p}
              onClick={() => onSelectPreset(p)}
              className={`px-2.5 py-1 rounded-lg transition-all text-xs font-medium whitespace-nowrap cursor-pointer ${
                currentPreset === p
                  ? 'bg-sky-600 text-white font-semibold shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {t.presets[p]}
            </button>
          );
        })}

        <button
          onClick={onOpenCustomModal}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-sky-300 hover:bg-slate-800 transition-colors border-l border-slate-800 pl-2 cursor-pointer whitespace-nowrap"
        >
          <Edit3 className="w-3 h-3" />
          <span>{t.presets.custom}</span>
        </button>
      </div>
    </header>
  );
};
