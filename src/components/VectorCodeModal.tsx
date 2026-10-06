import React, { useState } from 'react';
import { StockAsset } from '../types';
import { Check, Copy, Download, FileCode, X } from 'lucide-react';

interface VectorCodeModalProps {
  asset: StockAsset | null;
  onClose: () => void;
  onDownload: (asset: StockAsset) => void;
}

export const VectorCodeModal: React.FC<VectorCodeModalProps> = ({
  asset,
  onClose,
  onDownload
}) => {
  const [copied, setCopied] = useState(false);

  if (!asset || !asset.vectorSvg) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(asset.vectorSvg!);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Editable Vector SVG Code Inspector
              </h3>
              <span className="text-xs text-neutral-400">
                Pristine geometric paths · Scalable dimensions · Zero embedded raster data
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Vector SVG Mini Render */}
        <div className="h-32 w-full rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center p-2 overflow-hidden">
          <div
            className="w-full h-full flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: asset.vectorSvg }}
          />
        </div>

        {/* Code Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Raw SVG 1.1 Valid Markup</span>
            <button
              onClick={handleCopy}
              className="hover:text-indigo-400 flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy SVG Code'}</span>
            </button>
          </div>
          <pre className="h-64 rounded-xl border border-neutral-800 bg-neutral-950 p-4 font-mono text-[11px] text-neutral-300 overflow-y-auto leading-relaxed select-all">
            {asset.vectorSvg}
          </pre>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
          <span className="text-neutral-500 font-mono">
            Size: {(new Blob([asset.vectorSvg]).size / 1024).toFixed(1)} KB
          </span>
          <button
            onClick={() => onDownload(asset)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Standalone .SVG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
