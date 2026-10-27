/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  AlgorithmType,
  ArrayPreset,
  CameraViewPreset,
  SortStep,
  SoundInstrument,
} from './types/sorting';
import { generateSortSteps } from './algorithms/allAlgorithms';
import { soundEngine } from './audio/soundEngine';
import { SortingScene } from './three/SortingScene';
import { TopBar } from './components/TopBar';
import { ControlsDock } from './components/ControlsDock';
import { CodeInspector } from './components/CodeInspector';
import { CustomArrayModal } from './components/CustomArrayModal';
import { AlgorithmInfoModal } from './components/AlgorithmInfoModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Language } from './i18n/translations';
import confetti from 'canvas-confetti';

function createArrayByPreset(preset: ArrayPreset, size: number): number[] {
  switch (preset) {
    case 'reversed': {
      // Descending numbers (Bubble sort worst case)
      const res: number[] = [];
      const step = 85 / Math.max(size - 1, 1);
      for (let i = 0; i < size; i++) {
        res.push(Math.round(95 - i * step));
      }
      return res;
    }
    case 'nearly_sorted': {
      const res: number[] = [];
      const step = 85 / Math.max(size - 1, 1);
      for (let i = 0; i < size; i++) {
        res.push(Math.round(10 + i * step));
      }
      // Swap 2 random adjacent pairs
      for (let k = 0; k < 2; k++) {
        const swapIdx = Math.floor(Math.random() * (size - 1));
        const tmp = res[swapIdx];
        res[swapIdx] = res[swapIdx + 1];
        res[swapIdx + 1] = tmp;
      }
      return res;
    }
    case 'few_unique': {
      const uniques = [18, 38, 62, 88];
      const res: number[] = [];
      for (let i = 0; i < size; i++) {
        res.push(uniques[Math.floor(Math.random() * uniques.length)]);
      }
      return res;
    }
    case 'already_sorted': {
      const res: number[] = [];
      const step = 85 / Math.max(size - 1, 1);
      for (let i = 0; i < size; i++) {
        res.push(Math.round(10 + i * step));
      }
      return res;
    }
    case 'random':
    default: {
      const res: number[] = [];
      for (let i = 0; i < size; i++) {
        res.push(Math.floor(Math.random() * 85) + 12);
      }
      return res;
    }
  }
}

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SortingScene | null>(null);

  // Core algorithm state
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('bubble');
  const [arrayPreset, setArrayPreset] = useState<ArrayPreset>('random');
  const [arraySize, setArraySize] = useState<number>(14);
  const [initialArray, setInitialArray] = useState<number[]>(() =>
    createArrayByPreset('random', 14)
  );
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.2);

  // Sound state
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.35);
  const [instrument, setInstrument] = useState<SoundInstrument>('marimba');

  // Camera & UI layout
  const [cameraPreset, setCameraPreset] = useState<CameraViewPreset>('orbit');
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [showCodeInspector, setShowCodeInspector] = useState<boolean>(true);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  // Language state: English ('en'), French ('fr'), Arabic ('ar')
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('sort3d_lang');
    return saved === 'fr' || saved === 'ar' ? saved : 'en';
  });

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('sort3d_lang', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Reference to step interval
  const playTimerRef = useRef<number | null>(null);

  // 1. Initialize Three.js scene once
  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new SortingScene(mountRef.current);
    sceneRef.current = scene;

    return () => {
      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  // 2. Whenever array or algorithm changes, re-generate steps and re-render 3D scene
  useEffect(() => {
    const newSteps = generateSortSteps(algorithm, initialArray);
    setSteps(newSteps);
    setCurrentStepIndex(-1);
    setIsPlaying(false);

    if (sceneRef.current) {
      sceneRef.current.setArray(initialArray);
    }
  }, [algorithm, initialArray]);

  // Compute live metrics
  const comparisonsCount = steps
    .slice(0, currentStepIndex + 1)
    .filter((s) => s.action === 'compare').length;

  const swapsCount = steps
    .slice(0, currentStepIndex + 1)
    .filter((s) => s.action === 'swap').length;

  const currentStep = currentStepIndex >= 0 && currentStepIndex < steps.length ? steps[currentStepIndex] : null;
  const isSorted = currentStepIndex >= steps.length - 1 && steps.length > 0;

  // Sound triggering helper
  const playStepSound = useCallback(
    (step: SortStep, totalElements: number) => {
      if (isMuted) return;
      const maxVal = Math.max(...step.arrayState, 100);

      switch (step.action) {
        case 'compare':
          if (step.indices.length >= 2) {
            soundEngine.playCompare(
              step.indices[0],
              step.values[0],
              step.indices[1],
              step.values[1],
              totalElements,
              maxVal
            );
          } else if (step.indices.length === 1) {
            soundEngine.playSorted(step.indices[0], step.values[0], totalElements, maxVal);
          }
          break;
        case 'swap':
          if (step.indices.length >= 2) {
            soundEngine.playSwap(
              step.indices[0],
              step.values[0],
              step.indices[1],
              step.values[1],
              totalElements,
              maxVal
            );
          }
          break;
        case 'mark_sorted':
          if (step.indices.length >= 1) {
            soundEngine.playSorted(step.indices[0], step.values[0], totalElements, maxVal);
          }
          break;
        case 'finish':
          soundEngine.playCompletionFanfare(step.arrayState, () => {
            // Trigger celebratory confetti burst!
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.65 },
              colors: ['#38bdf8', '#34d399', '#f59e0b', '#ec4899', '#6366f1'],
            });
          });
          break;
      }
    },
    [isMuted]
  );

  // Apply a specific step index to the 3D scene
  const applyStepByIndex = useCallback(
    (index: number, triggerAudio = true) => {
      if (!sceneRef.current) return;

      if (index < 0) {
        // Reset to initial state
        sceneRef.current.setArray(initialArray);
        return;
      }

      const step = steps[index];
      if (!step) return;

      sceneRef.current.applyStep(
        step.action,
        step.indices,
        step.arrayState,
        step.sortedIndices,
        step.pivotIndex
      );

      if (triggerAudio) {
        playStepSound(step, initialArray.length);
      }
    },
    [steps, initialArray, playStepSound]
  );

  // Step Forward
  const handleStepForward = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      const next = currentStepIndex + 1;
      setCurrentStepIndex(next);
      applyStepByIndex(next, true);
    } else {
      setIsPlaying(false);
    }
  }, [currentStepIndex, steps.length, applyStepByIndex]);

  // Step Backward
  const handleStepBackward = useCallback(() => {
    if (currentStepIndex > 0) {
      const prev = currentStepIndex - 1;
      setCurrentStepIndex(prev);
      applyStepByIndex(prev, false);
    } else if (currentStepIndex === 0) {
      setCurrentStepIndex(-1);
      applyStepByIndex(-1, false);
    }
  }, [currentStepIndex, applyStepByIndex]);

  // Scrub timeline
  const handleScrub = useCallback(
    (targetStep: number) => {
      setIsPlaying(false);
      setCurrentStepIndex(targetStep);
      applyStepByIndex(targetStep, false);
    },
    [applyStepByIndex]
  );

  // Reset
  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    applyStepByIndex(-1, false);
  }, [applyStepByIndex]);

  // Main playback loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(30, Math.floor(450 / speed));
      playTimerRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          const next = prev + 1;
          applyStepByIndex(next, true);
          return next;
        });
      }, intervalMs);
    } else {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
        playTimerRef.current = null;
      }
    }

    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, [isPlaying, speed, steps.length, applyStepByIndex]);

  // Preset Selection
  const handleSelectPreset = (preset: ArrayPreset) => {
    setArrayPreset(preset);
    const newArr = createArrayByPreset(preset, arraySize);
    setInitialArray(newArr);
  };

  // Size change
  const handleChangeArraySize = (size: number) => {
    setArraySize(size);
    const newArr = createArrayByPreset(arrayPreset, size);
    setInitialArray(newArr);
  };

  // Custom Array submit
  const handleCustomArraySubmit = (numbers: number[]) => {
    setArraySize(numbers.length);
    setInitialArray(numbers);
  };

  // Sound settings
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  const handleChangeVolume = (vol: number) => {
    setVolume(vol);
    soundEngine.setVolume(vol);
  };

  const handleChangeInstrument = (inst: SoundInstrument) => {
    setInstrument(inst);
    soundEngine.setInstrument(inst);
  };

  // Camera preset
  const handleSelectCamera = (preset: CameraViewPreset) => {
    setCameraPreset(preset);
    if (sceneRef.current) {
      sceneRef.current.setCameraPreset(preset);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input/textarea or modal is open
      if (
        isCustomModalOpen ||
        isInfoModalOpen ||
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStepBackward();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setIsDockCollapsed((c) => !c);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStepForward, handleStepBackward, handleReset]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {/* 1. Full-bleed Three.js 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 2. Top Navigation Bar */}
      <TopBar
        currentAlgorithm={algorithm}
        onSelectAlgorithm={(algo) => setAlgorithm(algo)}
        currentPreset={arrayPreset}
        onSelectPreset={handleSelectPreset}
        comparisonsCount={comparisonsCount}
        swapsCount={swapsCount}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
        showCodeInspector={showCodeInspector}
        onToggleCodeInspector={() => setShowCodeInspector((v) => !v)}
        isSorted={isSorted}
        language={language}
        onChangeLanguage={handleLanguageChange}
      />

      {/* 3. Code & Algorithm Logic Inspector */}
      {showCodeInspector && (
        <CodeInspector
          algorithm={algorithm}
          currentStep={currentStep}
          language={language}
          onClose={() => setShowCodeInspector(false)}
        />
      )}

      {/* 4. Unified Ergonomic Bottom Control Dock with Teacher Educational Footer */}
      <ControlsDock
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onStepForward={handleStepForward}
        onStepBackward={handleStepBackward}
        onReset={handleReset}
        currentStepIndex={Math.max(currentStepIndex, 0)}
        totalSteps={steps.length}
        onScrubStep={handleScrub}
        speed={speed}
        onChangeSpeed={setSpeed}
        arraySize={arraySize}
        onChangeArraySize={handleChangeArraySize}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        volume={volume}
        onChangeVolume={handleChangeVolume}
        instrument={instrument}
        onChangeInstrument={handleChangeInstrument}
        cameraPreset={cameraPreset}
        onSelectCameraPreset={handleSelectCamera}
        isDockCollapsed={isDockCollapsed}
        onToggleCollapse={() => setIsDockCollapsed((c) => !c)}
        language={language}
      />

      {/* 5. Custom Array Modal */}
      <CustomArrayModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmit={handleCustomArraySubmit}
        currentArray={initialArray}
      />

      {/* 6. Deep Dive Theory Modal */}
      <AlgorithmInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        currentAlgorithm={algorithm}
      />

      {/* 7. Offline Connectivity Status Indicator */}
      <OfflineIndicator language={language} />
    </div>
  );
}
