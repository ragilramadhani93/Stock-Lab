import React, { useState } from 'react';
import { StockAsset } from '../types';
import { QCReportBadge } from './QCReportBadge';
import {
  Download,
  Eye,
  Copy,
  Sparkles,
  FileCode,
  Check,
  Zap,
  Terminal,
  Image as ImageIcon
} from 'lucide-react';
import { formatAdobeStockMetadata } from '../config/platformRules';

interface AssetCardProps {
  asset: StockAsset;
  onSelect: (asset: StockAsset) => void;
  onDownload: (asset: StockAsset) => void;
  onCreateVariation: (asset: StockAsset) => void;
  onInspectVector?: (asset: StockAsset) => void;
  onRenderImage?: (asset: StockAsset) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  onSelect,
  onDownload,
  onCreateVariation,
  onInspectVector,
  onRenderImage
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, key: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyAdobe = (e: React.MouseEvent) => {
    e.stopPropagation();
    const formatted = formatAdobeStockMetadata(asset.metadata);
    const line = `"${formatted.filename}","${formatted.title}","${formatted.keywords}","${formatted.category}","${formatted.releases}"`;
    navigator.clipboard.writeText(line);
    setCopiedKey('adobe_csv');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isPromptOnly = asset.isPromptOnly || asset.status === 'PROMPT_READY';
  const mjSyntax = asset.generatorParams?.midjourney ||
    `/imagine prompt: ${asset.promptDetails.masterPrompt} --ar ${asset.promptDetails.aspectRatio} --v 6.1 --style raw --stylize 100 --no ${asset.promptDetails.negativePrompt}`;

  return (
    <div
      onClick={() => onSelect(asset)}
      className="group rounded-2xl border border-slate-800/80 bg-[#0E1424]/90 hover:border-slate-700 hover:shadow-xl hover:shadow-black/50 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden backdrop-blur-sm"
    >
      {/* Top Banner / Visual / Prompt Preview */}
      {isPromptOnly ? (
        <div className="p-4 bg-gradient-to-br from-slate-950 via-[#0A0F1D] to-[#0E162A] border-b border-slate-800/80 space-y-3">
          {/* Header Strip inside prompt card */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                <Zap className="w-3 h-3 text-indigo-400" />
                Prompt Dossier
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                {asset.promptDetails.aspectRatio}
              </span>
            </div>

            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Opp: {asset.metadata.opportunity_score}
            </span>
          </div>

          {/* Master Prompt Code Snippet */}
          <div className="relative group/prompt rounded-xl bg-slate-950/90 border border-slate-800 p-3 space-y-1.5 font-mono text-xs">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-sans font-semibold">
              <span className="text-indigo-400 font-mono">MASTER PROMPT:</span>
              <span className="text-slate-400">{asset.promptDetails.copySpace}</span>
            </div>
            <p className="text-slate-200 text-xs font-sans leading-relaxed line-clamp-3">
              &ldquo;{asset.promptDetails.masterPrompt}&rdquo;
            </p>

            {/* Quick 1-Click Copy Prompt Button */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/60 font-sans">
              <button
                onClick={(e) => handleCopy(e, asset.promptDetails.masterPrompt, 'prompt')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition-all shadow-sm cursor-pointer"
              >
                {copiedKey === 'prompt' ? (
                  <>
                    <Check className="w-3 h-3 text-white" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Salin Prompt</span>
                  </>
                )}
              </button>

              <button
                onClick={(e) => handleCopy(e, mjSyntax, 'mj')}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[10px] font-mono transition-colors cursor-pointer"
                title="Salin sintaks lengkap untuk Midjourney v6.1"
              >
                {copiedKey === 'mj' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied MJ</span>
                  </>
                ) : (
                  <>
                    <Terminal className="w-3 h-3 text-indigo-400" />
                    <span>/imagine MJ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex items-center justify-center border-b border-slate-800/80">
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
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                READY
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-950/80 text-slate-300 border border-slate-800">
                .{asset.format.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800 text-[11px] font-mono tabular-nums text-slate-200 pointer-events-auto">
              <span>Opp: {asset.metadata.opportunity_score}</span>
            </div>
          </div>

          {/* Hover Quick Action Buttons */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-auto">
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(asset); }}
              className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 transition-colors shadow-md cursor-pointer"
              title="Inspect Details & Metadata"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDownload(asset); }}
              className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 transition-colors shadow-md cursor-pointer"
              title="Download Asset File"
            >
              <Download className="w-4 h-4" />
            </button>
            {asset.format === 'svg' && onInspectVector && (
              <button
                onClick={(e) => { e.stopPropagation(); onInspectVector(asset); }}
                className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 border border-slate-700 transition-colors shadow-md cursor-pointer"
                title="Inspect SVG Code"
              >
                <FileCode className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onCreateVariation(asset); }}
              className="p-2 rounded-xl bg-slate-900 text-indigo-400 hover:bg-slate-800 border border-slate-700 transition-colors shadow-md cursor-pointer"
              title="Create Commercial Variations"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Card Body */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-mono text-slate-500 truncate max-w-[160px]">{asset.filename}</span>
            <span className="capitalize text-slate-400">{asset.metadata.category}</span>
          </div>
          <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
            {asset.title}
          </h4>
          <p className="text-[11px] text-slate-400 line-clamp-1">
            {asset.metadata.description}
          </p>
        </div>

        {/* Action Strip: QC & Adobe CSV line */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <QCReportBadge qc={asset.qualityCheck} />
          
          <div className="flex items-center gap-2">
            {isPromptOnly && onRenderImage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRenderImage(asset);
                }}
                className="text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                title="Render visual preview SVG"
              >
                <ImageIcon className="w-3 h-3 text-cyan-400" />
                <span className="hidden sm:inline">Render</span>
              </button>
            )}

            <button
              onClick={handleCopyAdobe}
              className="text-[11px] text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors cursor-pointer"
              title="Salin baris CSV format Adobe Stock"
            >
              {copiedKey === 'adobe_csv' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">CSV OK</span>
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
    </div>
  );
};
