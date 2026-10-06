import React from 'react';
import { DollarSign, ShieldCheck, TrendingDown, X, Zap } from 'lucide-react';

interface CostTrackerModalProps {
  onClose: () => void;
  totalAssets: number;
  readyAssets: number;
}

export const CostTrackerModal: React.FC<CostTrackerModalProps> = ({
  onClose,
  totalAssets,
  readyAssets
}) => {
  const estimatedCost = (totalAssets * 0.0012).toFixed(4);
  const blindGenerationCost = (totalAssets * 0.04).toFixed(2);
  const costSavings = (Number(blindGenerationCost) - Number(estimatedCost)).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                AI Production Cost Control
              </h3>
              <span className="text-xs text-neutral-400">
                Pre-screening efficiency & token economy
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

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950 space-y-1">
            <span className="text-neutral-500 block">Actual Batch Cost</span>
            <span className="text-xl font-bold font-mono tabular-nums text-emerald-400 block">
              ${estimatedCost}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">Gemini 3.8 Flash SDK</span>
          </div>

          <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950 space-y-1">
            <span className="text-neutral-500 block">Blind Generation Cost</span>
            <span className="text-xl font-bold font-mono tabular-nums text-neutral-400 line-through block">
              ${blindGenerationCost}
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">Without opportunity filter</span>
          </div>
        </div>

        {/* Savings Card */}
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <TrendingDown className="w-4 h-4" />
            <span>Saved ${costSavings} by filtering before generation</span>
          </div>
          <p className="text-neutral-300 text-xs leading-relaxed">
            By analyzing demand, saturation risk, and commercial intent prior to asset rendering,
            you avoid wasting API budget on unmarketable or high-rejection stock submissions.
          </p>
        </div>

        {/* Conversion Metrics */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-neutral-400">
            <span>Assets Produced:</span>
            <span className="font-mono tabular-nums text-white font-semibold">{totalAssets}</span>
          </div>
          <div className="flex items-center justify-between text-neutral-400">
            <span>Passed QC & IP Cleared:</span>
            <span className="font-mono tabular-nums text-emerald-400 font-semibold">{readyAssets}</span>
          </div>
          <div className="flex items-center justify-between text-neutral-400">
            <span>QC Success Rate:</span>
            <span className="font-mono tabular-nums text-white font-semibold">
              {totalAssets > 0 ? Math.round((readyAssets / totalAssets) * 100) : 100}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
