import React, { useState } from 'react';
import { Lock, ShieldCheck, Pause, Play, Trash2, Download, RefreshCw, Eye, CheckCircle2, AlertOctagon, FileText } from 'lucide-react';
import { Memory, PreferenceGraph } from '../types';

interface TrustControlViewProps {
  isCapturePaused: boolean;
  setIsCapturePaused: React.Dispatch<React.SetStateAction<boolean>>;
  memories: Memory[];
  onClearAllMemories: () => void;
  graph: PreferenceGraph;
}

export const TrustControlView: React.FC<TrustControlViewProps> = ({
  isCapturePaused,
  setIsCapturePaused,
  memories,
  onClearAllMemories,
  graph,
}) => {
  const [sources, setSources] = useState({
    location: true,
    voice: true,
    photos: true,
    decisions: true,
  });

  const [confirmClear, setConfirmClear] = useState(false);

  const toggleSource = (key: keyof typeof sources) => {
    setSources((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ memories, graph }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `recall_memory_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Absolute User Ownership & Privacy</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Trust & Memory Controls
        </h2>
        <p className="text-xs sm:text-sm text-stone-300">
          You own every memory, decision, and preference. You can pause capture at any time, delete individual items instantly, or export your personal graph.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pause & Source Toggle Controls */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg space-y-5">
          <div className="border-b border-stone-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Pause className="w-4 h-4 text-amber-400" />
              Capture State & Sources
            </h3>
            <p className="text-xs text-stone-400">Control when and what inputs contribute to your MemoryOS</p>
          </div>

          {/* Master Pause Switch */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white text-xs block">Master Memory Capture</span>
              <span className="text-[11px] text-stone-400">
                {isCapturePaused ? 'Currently PAUSED. No new memories logged.' : 'Currently ACTIVE. Evaluating experiences.'}
              </span>
            </div>

            <button
              onClick={() => setIsCapturePaused(!isCapturePaused)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isCapturePaused
                  ? 'bg-emerald-500 text-stone-950 hover:bg-emerald-400'
                  : 'bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900'
              }`}
            >
              {isCapturePaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isCapturePaused ? 'Resume Capture' : 'Pause Capture'}</span>
            </button>
          </div>

          {/* Granular Source Permission Switches */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-stone-300 block">Contribution Sources:</span>

            {[
              { key: 'location', label: '📍 Location Context (Costco, Airport, Beach)', desc: 'Activates location triggers' },
              { key: 'voice', label: '🎙 Voice & Audio Notes', desc: 'Converts quick verbal notes to memories' },
              { key: 'photos', label: '🖼 Photo & Receipt Memory', desc: 'Reads tags & receipt notes' },
              { key: 'decisions', label: '🤔 Decision & Choice Logs', desc: 'Stores reasoning for choices' },
            ].map((src) => {
              const k = src.key as keyof typeof sources;
              const isEnabled = sources[k];

              return (
                <div key={k} className="p-3 rounded-xl bg-stone-950 border border-stone-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-stone-200 block">{src.label}</span>
                    <span className="text-[10px] text-stone-500">{src.desc}</span>
                  </div>

                  <button
                    onClick={() => toggleSource(k)}
                    className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                      isEnabled ? 'bg-amber-500' : 'bg-stone-800'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-stone-950 transition-transform ${
                        isEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Ownership & Export */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-lg space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-stone-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Data Portability & Deletion
              </h3>
              <p className="text-xs text-stone-400">Download or purge your data at any time</p>
            </div>

            <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2 text-xs text-stone-300">
              <div className="flex items-center justify-between">
                <span>Total Memories Stored:</span>
                <strong className="text-white">{memories.length} entries</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Memory Graph Size:</span>
                <strong className="text-white">{JSON.stringify(graph).length} bytes</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Storage Protocol:</span>
                <strong className="text-emerald-400">Local Session + Server Proxy</strong>
              </div>
            </div>

            {/* Export JSON Button */}
            <button
              onClick={handleExportData}
              className="w-full py-2.5 px-4 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export MemoryOS Graph (JSON)</span>
            </button>
          </div>

          {/* Danger Zone: Clear All */}
          <div className="pt-4 border-t border-rose-950/60 space-y-2">
            <span className="text-xs font-semibold text-rose-400 block">Danger Zone</span>

            {confirmClear ? (
              <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-xl space-y-2">
                <p className="text-xs text-rose-200 font-medium">Are you sure you want to permanently clear all memories?</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClearAllMemories();
                      setConfirmClear(false);
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg"
                  >
                    Yes, Delete Everything
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="w-full py-2 px-4 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/50 text-rose-300 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All MemoryOS Data</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
