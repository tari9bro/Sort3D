import React, { useState } from 'react';
import { X, Globe, Check, Copy, ExternalLink, Sparkles, Terminal, ArrowRight } from 'lucide-react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const gitPushCommands = `git init
git add .
git commit -m "Deploy Sort3D to GitHub Pages"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-none overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 text-slate-100 my-8 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-sky-500/20 border border-emerald-500/40 rounded-2xl text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-100">Deploy to GitHub Pages</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Free Public Link
                </span>
              </div>
              <p className="text-xs text-slate-400">Host your 3D sorting visualizer online with a public URL for everyone to see</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="my-5 space-y-4 text-xs sm:text-sm">
          {/* Quick Summary Card */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-950/40 via-sky-950/30 to-slate-900 border border-emerald-500/30 rounded-2xl">
            <div className="flex items-center gap-2 text-white font-semibold text-xs mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Everything is already configured!
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The project is set up with relative paths (<code className="text-sky-300 font-mono">base: './'</code>), <code className="text-sky-300 font-mono">.nojekyll</code>, SPA fallback (<code className="text-sky-300 font-mono">404.html</code>), and a ready-to-run GitHub Actions workflow (<code className="text-sky-300 font-mono">.github/workflows/deploy.yml</code>).
            </p>
          </div>

          {/* Step 1 */}
          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-200 text-xs">
                <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[10px] font-mono">
                  1
                </span>
                <span>Push this code to a GitHub Repository</span>
              </div>
              <button
                onClick={() => copyCode(gitPushCommands, 1)}
                className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] transition-colors"
              >
                {copiedIndex === 1 ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Commands</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-slate-900 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800/80">
              {gitPushCommands}
            </pre>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-200 text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-mono">
                2
              </span>
              <span>Enable GitHub Pages in Repository Settings</span>
            </div>
            <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1 pl-1">
              <li>Open your repository on <strong>GitHub.com</strong></li>
              <li>Click <strong>Settings</strong> tab at the top</li>
              <li>In the left sidebar, click <strong>Pages</strong></li>
              <li>Under <strong>Build and deployment &gt; Source</strong>, choose:
                <div className="my-1.5 p-2 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Select: GitHub Actions
                </div>
              </li>
            </ol>
          </div>

          {/* Step 3: Public Link URL format */}
          <div className="p-3.5 bg-slate-950/40 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-mono block">Your Public Live Website URL</span>
              <span className="text-xs sm:text-sm font-mono text-sky-300 font-bold">
                https://&lt;your-username&gt;.github.io/&lt;repo-name&gt;/
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-xs">
              <Globe className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
