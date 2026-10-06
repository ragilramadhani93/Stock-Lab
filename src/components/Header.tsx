import React from 'react';
import {
  Sparkles,
  Zap,
  FolderDown,
  Layers,
  Search,
  CheckCircle2,
  DollarSign,
  Rocket
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'research' | 'opportunities' | 'assets' | 'qc' | 'export';
  setActiveTab: (tab: 'research' | 'opportunities' | 'assets' | 'qc' | 'export') => void;
  onOpenBatch: () => void;
  onOpenCostTracker: () => void;
  onOpenExport: () => void;
  onOpenVercelDeploy: () => void;
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
  onOpenVercelDeploy,
  promptOnlyMode,
  setPromptOnlyMode,
  totalAssets,
  readyAssets
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090D18]/90 backdrop-blur-xl px-4 sm:px-6 py-3 shadow-sm shadow-black/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Zone 1: Logo & Branding */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-sm shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0B0F1C] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white block">
                Microstock Asset Lab
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                STUDIO PRO
              </span>
            </div>
            <span className="text-[11px] text-slate-400 block leading-tight">
              Research · Opportunity Scoring · Commercial Prompt Engine
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 shadow-inner">
          {[
            { id: 'research', label: 'Riset & Demand', icon: Search },
            { id: 'opportunities', label: 'Matriks Peluang', icon: Zap },
            { id: 'assets', label: `Koleksi Aset (${totalAssets})`, icon: Layers },
            { id: 'qc', label: 'QC & Audit IP', icon: CheckCircle2 },
            { id: 'export', label: `Export Hub (${readyAssets})`, icon: FolderDown }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mode Hemat Toggle (Cost Saver prompt-only) */}
          <button
            onClick={() => setPromptOnlyMode(!promptOnlyMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              promptOnlyMode
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 shadow-sm shadow-emerald-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
            title="Klik untuk mengubah: Mode Hemat Prompt (tanpa render gambar) vs Render Visual Langsung"
          >
            <span className={`w-2 h-2 rounded-full ${promptOnlyMode ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <span className="hidden sm:inline">{promptOnlyMode ? 'Mode Hemat: Prompt Saja' : 'Render Visual'}</span>
            <span className="sm:hidden">{promptOnlyMode ? 'Hemat' : 'Visual'}</span>
          </button>

          {/* Vercel Deploy Guide Button */}
          <button
            onClick={onOpenVercelDeploy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Buka panduan persiapan deploy ke Vercel"
          >
            <span className="text-[11px] font-bold">▲</span>
            <span className="hidden md:inline">Deploy Vercel</span>
          </button>

          {/* Cost Tracker Preview */}
          <button
            onClick={onOpenCostTracker}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono text-slate-300 bg-slate-900/80 border border-slate-800 rounded-xl hover:border-slate-700 hover:text-white transition-colors tabular-nums cursor-pointer"
            title="Lihat Telemetri Biaya & Penghematan Token"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>${promptOnlyMode ? '0.0003' : '0.024'}</span>
          </button>

          {/* Export Bundle Modal Trigger */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer whitespace-nowrap active:scale-97"
          >
            <FolderDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <nav className="flex lg:hidden items-center gap-1 mt-2.5 pt-2 border-t border-slate-800/80 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'research', label: 'Riset', icon: Search },
          { id: 'opportunities', label: 'Peluang', icon: Zap },
          { id: 'assets', label: `Aset (${totalAssets})`, icon: Layers },
          { id: 'qc', label: 'QC', icon: CheckCircle2 },
          { id: 'export', label: `Export (${readyAssets})`, icon: FolderDown }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1 font-semibold ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
