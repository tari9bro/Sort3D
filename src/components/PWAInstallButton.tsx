import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Share2, X, Check } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, don't show prompt
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold text-xs transition-all shadow-md hover:shadow-sky-500/20 active:scale-95"
        title="Install Sort3D for full offline access"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-medium text-xs border border-slate-700 transition-colors"
          title="Install on iOS Home Screen"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install PWA</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-sky-400" />
                  Install on iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <p>
                    Tap the <strong>Share</strong> button at the bottom of Safari.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <p>
                    Scroll down and choose <strong>Add to Home Screen</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <p>
                    Launch Sort3D from your home screen for full standalone 3D offline use!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-xs font-semibold text-slate-200 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback standalone install badge
  return (
    <button
      onClick={() => {
        alert('Sort3D works 100% offline! To install, click the Install or Add to Home Screen button in your browser address bar.');
      }}
      className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700/60 transition-colors"
      title="Works Offline — Installable PWA"
    >
      <Check className="w-3.5 h-3.5 text-emerald-400" />
      <span>Offline Ready</span>
    </button>
  );
};
