import React, { useState } from 'react';
import { CameraViewPreset, SoundInstrument } from '../types/sorting';
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
  Sliders,
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
}) => {
  const [activeTab, setActiveTab] = useState<'playback' | 'audio' | 'camera' | 'settings'>('playback');

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '50%',
        transform: `translateX(-50%) translateY(${isDockCollapsed ? 'calc(100% - 28px)' : '0'})`,
        maxWidth: 'min(940px, 95vw)',
        width: '100%',
        zIndex: 30,
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="flex flex-col items-center select-none"
    >
      {/* Collapse / Expand Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-700/80 rounded-t-xl text-[11px] font-semibold text-slate-300 hover:text-sky-300 hover:bg-slate-800 transition-colors shadow-lg cursor-pointer"
        title="Toggle HUD (Hotkey: H)"
      >
        {isDockCollapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
            <span>Show Controls (H)</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
            <span>Hide Controls (H)</span>
          </>
        )}
      </button>

      {/* Main Unified Solid Dock Card */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 sm:p-4 text-slate-200">
        {/* Step Progress & Timeline Scrubber */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
            <span>TIMELINE PROGRESS</span>
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
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 hover:accent-sky-300 transition-all"
          />
        </div>

        {/* Tab Navigation & Central Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Main Primary Transport Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onReset}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Reset array (R)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onStepBackward}
              disabled={currentStepIndex <= 0}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Step Backward (Left Arrow)"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={onTogglePlay}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
              }`}
              title="Play / Pause (Space)"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              onClick={onStepForward}
              disabled={currentStepIndex >= totalSteps - 1}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Step Forward (Right Arrow)"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Sub-Panel Switcher Pills */}
          <div className="flex items-center gap-1 bg-slate-950 rounded-xl p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('playback')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium ${
                activeTab === 'playback' ? 'bg-slate-800 text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>Speed & Size</span>
            </button>

            <button
              onClick={() => setActiveTab('audio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium ${
                activeTab === 'audio' ? 'bg-slate-800 text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Sound Synthesizer</span>
            </button>

            <button
              onClick={() => setActiveTab('camera')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium ${
                activeTab === 'camera' ? 'bg-slate-800 text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera Views</span>
            </button>
          </div>
        </div>

        {/* Tab Panel Content */}
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          {activeTab === 'playback' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Speed multiplier */}
              <div className="flex items-center gap-3">
                <span className="text-slate-400 w-16 font-medium">Speed:</span>
                <input
                  type="range"
                  min={0.2}
                  max={5}
                  step={0.1}
                  value={speed}
                  onChange={(e) => onChangeSpeed(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
                <span className="font-mono text-sky-300 w-10 text-right">{speed.toFixed(1)}x</span>
              </div>

              {/* Array size */}
              <div className="flex items-center gap-3">
                <span className="text-slate-400 w-16 font-medium">Elements:</span>
                <input
                  type="range"
                  min={6}
                  max={36}
                  step={1}
                  value={arraySize}
                  onChange={(e) => onChangeArraySize(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
                <span className="font-mono text-sky-300 w-10 text-right">{arraySize}</span>
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={onToggleMute}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                    isMuted
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-sky-400" />}
                  <span>{isMuted ? 'Muted' : 'Audio ON'}</span>
                </button>

                {/* Volume slider */}
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  disabled={isMuted}
                  onChange={(e) => onChangeVolume(Number(e.target.value))}
                  className="w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400 disabled:opacity-40"
                  title="Volume"
                />
              </div>

              {/* Instrument selection */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Timbre:</span>
                {(['marimba', 'cosmic', 'arcade', 'crystal'] as SoundInstrument[]).map((inst) => {
                  const names: Record<SoundInstrument, string> = {
                    marimba: 'Marimba FM',
                    cosmic: 'Cosmic Sine',
                    arcade: '8-Bit Arcade',
                    crystal: 'Crystal Glass',
                  };
                  return (
                    <button
                      key={inst}
                      onClick={() => onChangeInstrument(inst)}
                      className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                        instrument === inst
                          ? 'bg-sky-600 text-white font-semibold'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {names[inst]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'camera' && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 mr-1">Camera Presets:</span>
              {(['orbit', 'front', 'top', 'isometric', 'cinematic'] as CameraViewPreset[]).map((cam) => {
                const labels: Record<CameraViewPreset, string> = {
                  orbit: 'Perspective Orbit',
                  front: 'Front Elevation',
                  top: 'Overhead Runway',
                  isometric: 'Isometric 45°',
                  cinematic: 'Cinematic Low Angle',
                };
                return (
                  <button
                    key={cam}
                    onClick={() => onSelectCameraPreset(cam)}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
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
      </div>
    </div>
  );
};
