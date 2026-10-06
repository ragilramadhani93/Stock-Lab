import React, { useState } from 'react';
import { AssetStatus, ContentType, StockAsset } from '../types';
import { AssetCard } from './AssetCard';
import {
  Layers,
  Search,
  Filter,
  Download,
  FolderDown,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Zap
} from 'lucide-react';

interface AssetLibraryViewProps {
  assets: StockAsset[];
  onSelectAsset: (asset: StockAsset) => void;
  onDownloadAsset: (asset: StockAsset) => void;
  onCreateVariation: (asset: StockAsset) => void;
  onInspectVector: (asset: StockAsset) => void;
  onOpenExport: () => void;
  onRenderImage?: (asset: StockAsset) => void;
}

export const AssetLibraryView: React.FC<AssetLibraryViewProps> = ({
  assets,
  onSelectAsset,
  onDownloadAsset,
  onCreateVariation,
  onInspectVector,
  onOpenExport,
  onRenderImage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AssetStatus | 'PROMPT_ONLY'>('ALL');
  const [formatFilter, setFormatFilter] = useState<'ALL' | 'svg' | 'jpg' | 'png'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredAssets = assets.filter(asset => {
    const matchesSearch =
      asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.metadata.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesStatus = true;
    if (statusFilter === 'PROMPT_ONLY') {
      matchesStatus = Boolean(asset.isPromptOnly || asset.status === 'PROMPT_READY');
    } else if (statusFilter !== 'ALL') {
      matchesStatus = asset.status === statusFilter;
    }

    const matchesFormat = formatFilter === 'ALL' || asset.format === formatFilter;

    return matchesSearch && matchesStatus && matchesFormat;
  });

  const readyCount = assets.filter(a => a.status === 'READY' || a.status === 'PROMPT_READY').length;
  const promptCount = assets.filter(a => a.isPromptOnly || a.status === 'PROMPT_READY').length;
  const qcCount = assets.filter(a => a.status === 'QC').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Koleksi Aset &amp; Prompt Studio</h2>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              ({assets.length} total · {readyCount} siap kirim)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Katalog aset komersial lengkap dengan master prompt, sintaks AI, metadata 5-lapis, dan verifikasi kepatuhan.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-900 rounded-xl p-0.5 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              title="Data Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer active:scale-97"
          >
            <FolderDown className="w-3.5 h-3.5" />
            <span>Export Paket CSV ({readyCount})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0E1424]/80 p-3 rounded-2xl border border-slate-800/80">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari berdasarkan judul, filename, atau kata kunci..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-800 bg-slate-950/80 pl-9 pr-3.5 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status filter pills */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${statusFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Semua ({assets.length})
            </button>
            <button
              onClick={() => setStatusFilter('PROMPT_ONLY')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 ${statusFilter === 'PROMPT_ONLY' ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Zap className="w-3 h-3 text-indigo-400" />
              <span>Prompt Packs ({promptCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('READY')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${statusFilter === 'READY' ? 'bg-emerald-600/20 text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Ready ({readyCount})
            </button>
            <button
              onClick={() => setStatusFilter('QC')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${statusFilter === 'QC' ? 'bg-amber-600/20 text-amber-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Review ({qcCount})
            </button>
          </div>

          {/* Format selector */}
          <select
            value={formatFilter}
            onChange={e => setFormatFilter(e.target.value as any)}
            className="text-xs rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">Semua Format</option>
            <option value="svg">Vector SVG</option>
            <option value="jpg">Photo JPG</option>
            <option value="png">Raster PNG</option>
          </select>
        </div>
      </div>

      {/* Asset Grid View */}
      {viewMode === 'grid' ? (
        filteredAssets.length === 0 ? (
          <div className="rounded-2xl border border-slate-800/80 bg-[#0E1424]/60 p-12 text-center space-y-3">
            <Layers className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">Tidak ada aset yang cocok</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Coba sesuaikan kata kunci pencarian atau filter, atau buat prompt/aset baru di tab Riset.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAssets.map(asset => (
              <AssetCard
                key={asset.id}
                asset={asset}
                onSelect={onSelectAsset}
                onDownload={onDownloadAsset}
                onCreateVariation={onCreateVariation}
                onInspectVector={onInspectVector}
                onRenderImage={onRenderImage}
              />
            ))}
          </div>
        )
      ) : (
        /* High-Density Data Table View */
        <div className="rounded-2xl border border-slate-800/80 bg-[#0E1424]/80 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Asset Info</th>
                  <th className="py-3 px-4 font-semibold">Tipe</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Skor Opp</th>
                  <th className="py-3 px-4 font-semibold">QC Score</th>
                  <th className="py-3 px-4 font-semibold">Keywords</th>
                  <th className="py-3 px-4 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredAssets.map(asset => {
                  const isPrompt = asset.isPromptOnly || asset.status === 'PROMPT_READY';
                  return (
                    <tr
                      key={asset.id}
                      onClick={() => onSelectAsset(asset)}
                      className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white line-clamp-1">{asset.title}</div>
                        <div className="font-mono text-[11px] text-slate-500">{asset.filename}.{asset.format}</div>
                      </td>
                      <td className="py-3 px-4 capitalize text-slate-300">
                        {isPrompt ? (
                          <span className="text-indigo-400 font-semibold flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Prompt Pack
                          </span>
                        ) : (
                          asset.contentType
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          asset.status === 'READY' || asset.status === 'PROMPT_READY'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-200">
                        {asset.metadata.opportunity_score}
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                        {asset.qualityCheck.score}/100
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {asset.metadata.keywords.length} tags
                      </td>
                      <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectAsset(asset)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                            title="Inspect Details"
                          >
                            <FileCode className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDownloadAsset(asset)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                            title="Download File"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
