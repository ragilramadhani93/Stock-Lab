import React from 'react';
import {
  Sparkles,
  Zap,
  FolderDown,
  Layers,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  DollarSign
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'research' | 'opportunities' | 'assets' | 'qc' | 'export';
  setActiveTab: (tab: 'research' | 'opportunities' | 'assets' | 'qc' | 'export') => void;
  onOpenBatch: () => void;
  onOpenCostTracker: () => void;
  onOpenExport: () => void;
  simpleMode: boolean;
  setSimpleMode: (val: boolean) => void;
  promptOnlyMode: boolean;
  setPromptOnlyMode: (val: boolean) => void;
  totalAssets: number;
  readyAssets: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenBatch,
  onOpenCostTracker,
  onOpenExport,
  simpleMode,
  setSimpleMode,
  promptOnlyMode,
  setPromptOnlyMode,
  totalAssets,
  readyAssets
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-semibold tracking-tight text-white block leading-none">
              Microstock Asset Lab
            </span>
            <span className="text-xs text-neutral-400 mt-1 block">
              Commercial Research · Stock-Safe Engine · Adobe & Shutterstock Exporter
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-neutral-900/80 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => setActiveTab('research')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'research'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Research & Demand
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'opportunities'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Opportunity Matrix
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'assets'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Asset Studio ({totalAssets})
          </button>
          <button
            onClick={() => setActiveTab('qc')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'qc'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            QC & IP Compliance
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FolderDown className="w-3.5 h-3.5" />
            Export Hub ({readyAssets})
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          {/* Mode Hemat: Prompt Only Toggle */}
          <button
            onClick={() => setPromptOnlyMode(!promptOnlyMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              promptOnlyMode
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
            title="Mode Hemat: Output berupa Prompt & Metadata (Tanpa generate gambar untuk hemat biaya)"
          >
            <Zap className={`w-3.5 h-3.5 ${promptOnlyMode ? 'text-emerald-400 fill-current' : 'text-neutral-400'}`} />
            <span className="font-semibold">{promptOnlyMode ? 'Mode Hemat: Prompt Saja' : 'Render Gambar'}</span>
          </button>

          {/* Mode Toggle */}
          <button
            onClick={() => setSimpleMode(!simpleMode)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700 transition-colors"
            title="Toggle between Quick 1-Click Mode and Pro Studio Mode"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <span>{simpleMode ? 'Simple Mode' : 'Pro Studio'}</span>
          </button>

          {/* Cost Tracker */}
          <button
            onClick={onOpenCostTracker}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 rounded-lg hover:text-neutral-200 transition-colors tabular-nums"
            title="Estimated AI generation cost"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>${promptOnlyMode ? '0.0003' : '0.024'}</span>
          </button>

          {/* Batch Production Queue */}
          <button
            onClick={onOpenBatch}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            <span>Batch Queue</span>
          </button>

          {/* Export Bundle Modal Trigger */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors whitespace-nowrap"
          >
            <FolderDown className="w-3.5 h-3.5" />
            <span>Export CSV & ZIP</span>
          </button>
        </div>
      </div>
    </header>
  );
};
