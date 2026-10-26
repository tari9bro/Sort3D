import React, { useState } from 'react';
import { CameraViewPreset, SoundInstrument } from '../types/sorting';
import { Language, TRANSLATIONS } from '../i18n/translations';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Camera,
  Music,
  Gauge,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface ControlsDockProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  currentStepIndex: number;
  totalSteps: number;
  onScrubStep: (step: number) => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  arraySize: number;
  onChangeArraySize: (size: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
  instrument: SoundInstrument;
  onChangeInstrument: (inst: SoundInstrument) => void;
  cameraPreset: CameraViewPreset;
  onSelectCameraPreset: (preset: CameraViewPreset) => void;
  isDockCollapsed: boolean;
  onToggleCollapse: () => void;
  language: Language;
}

export const ControlsDock: React.FC<ControlsDockProps> = ({
  isPlaying,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onReset,
  currentStepIndex,
  totalSteps,
  onScrubStep,
  speed,
  onChangeSpeed,
  arraySize,
  onChangeArraySize,
  isMuted,
  onToggleMute,
  volume,
  onChangeVolume,
  instrument,
  onChangeInstrument,
  cameraPreset,
  onSelectCameraPreset,
  isDockCollapsed,
  onToggleCollapse,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'playback' | 'audio' | 'camera'>('playback');
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const isRtl = language === 'ar';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        position: 'fixed',
        bottom: '4px',
        left: '50%',
        transform: `translateX(-50%) translateY(${isDockCollapsed ? 'calc(100% - 24px)' : '0'})`,
        maxWidth: 'min(980px, 96vw)',
        width: '100%',
        zIndex: 30,
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="flex flex-col items-center select-none"
    >
      {/* Collapse / Expand Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-700/80 rounded-t-xl text-[10px] font-semibold text-slate-300 hover:text-sky-300 hover:bg-slate-800 transition-colors shadow-lg cursor-pointer"
        title="Toggle HUD (Hotkey: H)"
      >
        {isDockCollapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
            <span>{t.controls.showControls} (H)</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
            <span>{t.controls.hideControls} (H)</span>
          </>
        )}
      </button>

      {/* Main Unified Solid Dock Card */}
      <div className="w-full bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl p-2.5 sm:p-3.5 text-slate-200">
        {/* Step Progress & Timeline Scrubber */}
        <div className="mb-2.5">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
            <span>{t.controls.timelineProgress}</span>
            <span>
              {totalSteps > 0
                ? `${Math.round(((currentStepIndex + 1) / totalSteps) * 100)}% (${currentStepIndex + 1} / ${totalSteps})`
                : 'Ready'}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(totalSteps - 1, 0)}
            value={currentStepIndex}
            onChange={(e) => onScrubStep(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 hover:accent-sky-300 transition-all"
          />
        </div>

        {/* Tab Navigation & Central Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Main Primary Transport Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={onReset}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={`${t.controls.reset} (R)`}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onStepBackward}
              disabled={currentStepIndex <= 0}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={`${t.controls.stepBackward} (←)`}
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePlay}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
              }`}
              title={`${isPlaying ? t.controls.pause : t.controls.play} (Space)`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>{t.controls.pause}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{t.controls.play}</span>
                </>
              )}
            </button>

            <button
              onClick={onStepForward}
              disabled={currentStepIndex >= totalSteps - 1}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={`${t.controls.stepForward} (→)`}
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Sub-Panel Switcher Pills */}
          <div className="flex items-center gap-1 bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('playback')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'playback' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>{t.controls.speed} & {t.controls.elements}</span>
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'audio' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>{t.controls.soundSynth}</span>
            </button>
            <button
              onClick={() => setActiveTab('camera')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'camera' ? 'bg-sky-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{t.controls.cameraViews}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Contextual Drawer Content */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80">
          {activeTab === 'playback' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 w-16 whitespace-nowrap">{t.controls.speed}:</span>
                <input
                  type="range"
                  min="0.2"
                  max="4.0"
                  step="0.1"
                  value={speed}
                  onChange={(e) => onChangeSpeed(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
                <span className="font-mono text-sky-400 w-10 text-right">{speed.toFixed(1)}x</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400 w-16 whitespace-nowrap">{t.controls.elements}:</span>
                <input
                  type="range"
                  min="6"
                  max="32"
                  step="1"
                  value={arraySize}
                  onChange={(e) => onChangeArraySize(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
                <span className="font-mono text-sky-400 w-10 text-right">{arraySize}</span>
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={onToggleMute}
                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                    isMuted
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                  title={isMuted ? t.controls.unmute : t.controls.mute}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                  disabled={isMuted}
                  className="w-24 sm:w-32 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 disabled:opacity-40"
                />
                <span className="font-mono text-slate-400 w-8">{Math.round(volume * 100)}%</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">{t.controls.instrument}:</span>
                {(['marimba', 'synth', 'bell', 'retro'] as SoundInstrument[]).map((inst) => (
                  <button
                    key={inst}
                    onClick={() => onChangeInstrument(inst)}
                    className={`px-2 py-1 rounded-lg text-xs capitalize transition-colors cursor-pointer ${
                      instrument === inst
                        ? 'bg-sky-600 text-white font-semibold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {inst}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'camera' && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 mr-1">{t.controls.cameraViews}:</span>
              {(['orbit', 'front', 'top', 'isometric', 'cinematic'] as CameraViewPreset[]).map((cam) => {
                const labels: Record<CameraViewPreset, string> = {
                  orbit: t.controls.orbit,
                  front: t.controls.front,
                  top: t.controls.top,
                  isometric: 'Isometric 45°',
                  cinematic: 'Cinematic',
                };
                return (
                  <button
                    key={cam}
                    onClick={() => onSelectCameraPreset(cam)}
                    className={`px-2.5 py-1 rounded-lg transition-colors font-medium cursor-pointer ${
                      cameraPreset === cam
                        ? 'bg-sky-600 text-white font-semibold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {labels[cam]}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Dedicated Pedagogical Teacher Footer Note */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-start sm:items-center gap-2 text-[11px] text-slate-400 leading-relaxed">
          <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5 sm:mt-0">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <p className="flex-1 font-sans">
            {t.footerText}
          </p>
        </div>
      </div>
    </div>
  );
};
