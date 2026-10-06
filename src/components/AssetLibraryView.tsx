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
  FileCode
} from 'lucide-react';

interface AssetLibraryViewProps {
  assets: StockAsset[];
  onSelectAsset: (asset: StockAsset) => void;
  onDownloadAsset: (asset: StockAsset) => void;
  onCreateVariation: (asset: StockAsset) => void;
  onInspectVector: (asset: StockAsset) => void;
  onOpenExport: () => void;
  onBatchAction?: (selectedIds: string[], action: 'export' | 'delete' | 'qc') => void;
}

export const AssetLibraryView: React.FC<AssetLibraryViewProps> = ({
  assets,
  onSelectAsset,
  onDownloadAsset,
  onCreateVariation,
  onInspectVector,
  onOpenExport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AssetStatus>('ALL');
  const [formatFilter, setFormatFilter] = useState<'ALL' | 'svg' | 'jpg' | 'png'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredAssets = assets.filter(asset => {
    const matchesSearch =
      asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.metadata.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || asset.status === statusFilter;
    const matchesFormat = formatFilter === 'ALL' || asset.format === formatFilter;

    return matchesSearch && matchesStatus && matchesFormat;
  });

  const readyCount = assets.filter(a => a.status === 'READY').length;
  const qcCount = assets.filter(a => a.status === 'QC').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Stock Asset Studio</h2>
            <span className="text-xs font-mono text-neutral-400 tabular-nums">
              ({assets.length} total · {readyCount} ready for submission)
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Complete commercial assets with multi-layer keywords, QC audits, and platform metadata.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View mode toggle */}
          <div className="flex items-center bg-neutral-900 rounded-lg p-0.5 border border-neutral-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition-colors ${viewMode === 'grid' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition-colors ${viewMode === 'table' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
              title="Data Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <FolderDown className="w-3.5 h-3.5" />
            <span>Export Ready Assets ({readyCount})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search assets by title, keyword, or filename..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-950 pl-8 pr-3 py-1.5 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${statusFilter === 'ALL' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              All ({assets.length})
            </button>
            <button
              onClick={() => setStatusFilter('READY')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${statusFilter === 'READY' ? 'bg-emerald-600/20 text-emerald-400' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              Ready ({readyCount})
            </button>
            <button
              onClick={() => setStatusFilter('QC')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${statusFilter === 'QC' ? 'bg-amber-600/20 text-amber-400' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              Review ({qcCount})
            </button>
          </div>

          {/* Format selector */}
          <select
            value={formatFilter}
            onChange={e => setFormatFilter(e.target.value as any)}
            className="text-xs rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-neutral-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Formats</option>
            <option value="svg">Vector SVG</option>
            <option value="jpg">Photo JPG</option>
            <option value="png">Raster PNG</option>
          </select>
        </div>
      </div>

      {/* Asset Grid View */}
      {viewMode === 'grid' ? (
        filteredAssets.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-12 text-center space-y-3">
            <Layers className="w-8 h-8 text-neutral-600 mx-auto" />
            <h3 className="text-sm font-semibold text-neutral-300">No matching assets found</h3>
            <p className="text-xs text-neutral-500">
              Try adjusting your search terms or filter criteria, or generate a new asset from the Research tab.
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
              />
            ))}
          </div>
        )
      ) : (
        /* High-Density Data Table View */
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-2.5 px-4 font-medium">Asset</th>
                <th className="py-2.5 px-4 font-medium">Format</th>
                <th className="py-2.5 px-4 font-medium">Category</th>
                <th className="py-2.5 px-4 font-medium text-right">Opp. Score</th>
                <th className="py-2.5 px-4 font-medium text-right">QC Score</th>
                <th className="py-2.5 px-4 font-medium">IP Risk</th>
                <th className="py-2.5 px-4 font-medium">Status</th>
                <th className="py-2.5 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {filteredAssets.map(asset => (
                <tr
                  key={asset.id}
                  onClick={() => onSelectAsset(asset)}
                  className="hover:bg-neutral-800/40 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-12 h-8 rounded bg-neutral-950 border border-neutral-800 overflow-hidden flex items-center justify-center shrink-0">
                      {asset.vectorSvg ? (
                        <div
                          className="w-full h-full p-0.5"
                          dangerouslySetInnerHTML={{ __html: asset.vectorSvg }}
                        />
                      ) : (
                        <img
                          src={asset.dataUrl}
                          alt={asset.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-200 block truncate max-w-xs">{asset.title}</span>
                      <span className="font-mono text-[11px] text-neutral-500">{asset.filename}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 uppercase font-mono text-[11px] text-neutral-300">
                    {asset.format}
                  </td>
                  <td className="py-3 px-4 text-neutral-300">
                    {asset.metadata.category}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-neutral-200">
                    {asset.metadata.opportunity_score}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-emerald-400">
                    {asset.qualityCheck.score}
                  </td>
                  <td className="py-3 px-4 uppercase font-medium">
                    <span className={asset.qualityCheck.ipRisk === 'low' ? 'text-emerald-400' : 'text-rose-400'}>
                      {asset.qualityCheck.ipRisk}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      asset.status === 'READY'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); onDownloadAsset(asset); }}
                        className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                        title="Download Asset"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
