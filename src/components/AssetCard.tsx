import React from 'react';
import { StockAsset } from '../types';
import { QCReportBadge } from './QCReportBadge';
import {
  Download,
  Eye,
  Copy,
  Sparkles,
  ShieldAlert,
  FileCode,
  Check
} from 'lucide-react';
import { formatAdobeStockMetadata } from '../config/platformRules';

interface AssetCardProps {
  asset: StockAsset;
  onSelect: (asset: StockAsset) => void;
  onDownload: (asset: StockAsset) => void;
  onCreateVariation: (asset: StockAsset) => void;
  onInspectVector?: (asset: StockAsset) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  onSelect,
  onDownload,
  onCreateVariation,
  onInspectVector
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyAdobe = (e: React.MouseEvent) => {
    e.stopPropagation();
    const formatted = formatAdobeStockMetadata(asset.metadata);
    const line = `"${formatted.filename}","${formatted.title}","${formatted.keywords}","${formatted.category}","${formatted.releases}"`;
    navigator.clipboard.writeText(line);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = () => {
    if (asset.isPromptOnly || asset.status === 'PROMPT_READY') {
      return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">⚡ PROMPT PACK</span>;
    }
    switch (asset.status) {
      case 'READY':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">READY</span>;
      case 'QC':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">NEEDS REVIEW</span>;
      case 'REJECTED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">REJECTED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-neutral-800 text-neutral-300">{asset.status}</span>;
    }
  };

  return (
    <div
      onClick={() => onSelect(asset)}
      className="group rounded-xl border border-neutral-800 bg-neutral-900/60 overflow-hidden hover:border-neutral-700 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
    >
      {/* Asset Preview Container */}
      <div className="relative aspect-video w-full bg-neutral-950 overflow-hidden flex items-center justify-center border-b border-neutral-800/80">
        {asset.vectorSvg ? (
          <div
            className="w-full h-full flex items-center justify-center p-2"
            dangerouslySetInnerHTML={{ __html: asset.vectorSvg }}
          />
        ) : (
          <img
            src={asset.dataUrl}
            alt={asset.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Top Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {getStatusBadge()}
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-neutral-950/80 text-neutral-300 border border-neutral-800">
              .{asset.format.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-neutral-950/80 px-2 py-0.5 rounded border border-neutral-800 text-[11px] font-mono tabular-nums text-neutral-200 pointer-events-auto">
            <span>Opp: {asset.metadata.opportunity_score}</span>
          </div>
        </div>

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-auto">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(asset); }}
            className="p-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-700 transition-colors"
            title="Inspect Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDownload(asset); }}
            className="p-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-700 transition-colors"
            title="Download Asset File"
          >
            <Download className="w-4 h-4" />
          </button>
          {asset.format === 'svg' && onInspectVector && (
            <button
              onClick={(e) => { e.stopPropagation(); onInspectVector(asset); }}
              className="p-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 border border-neutral-700 transition-colors"
              title="Inspect SVG Code"
            >
              <FileCode className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onCreateVariation(asset); }}
            className="p-2 rounded-lg bg-neutral-900 text-indigo-400 hover:bg-neutral-800 border border-neutral-700 transition-colors"
            title="Create Commercial Variations"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span className="font-mono text-neutral-500 truncate max-w-[160px]">{asset.filename}</span>
            <span className="capitalize">{asset.metadata.category}</span>
          </div>
          <h4 className="text-xs font-semibold text-neutral-200 line-clamp-1 group-hover:text-white transition-colors">
            {asset.title}
          </h4>
        </div>

        {/* QC & Compliance Strip */}
        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between">
          <QCReportBadge qc={asset.qualityCheck} />
          
          <button
            onClick={handleCopyAdobe}
            className="text-[11px] text-neutral-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
            title="Copy Adobe Stock CSV line"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Adobe CSV</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
