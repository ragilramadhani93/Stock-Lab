import React from 'react';
import { ResearchOpportunity } from '../types';
import { OpportunityScoreCard } from './OpportunityScoreCard';
import {
  X,
  Sparkles,
  TrendingUp,
  Globe2,
  FileCheck,
  Search,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface OpportunityDetailModalProps {
  opportunity: ResearchOpportunity | null;
  onClose: () => void;
  onMakeAsset: (opp: ResearchOpportunity) => void;
  isProcessing: boolean;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  onClose,
  onMakeAsset,
  isProcessing
}) => {
  if (!opportunity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl p-6 space-y-6 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
              <span className="font-semibold text-indigo-400 uppercase">{opportunity.contentType}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{opportunity.platform.replace('_', ' ')}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize text-emerald-400">{opportunity.trendType}</span>
            </div>
            <h3 className="text-lg font-bold text-white leading-tight">
              {opportunity.topic}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Opportunity Score Breakdown */}
        <OpportunityScoreCard
          score={opportunity.opportunityScore}
          competitionScore={opportunity.competitionScore}
          saturationRisk={opportunity.saturationRisk}
          commercialPotential={opportunity.commercialPotential}
          seasonalWindow={opportunity.seasonalWindow}
        />

        {/* Commercial Market Gap Audit */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-3.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-200 text-sm flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Stock Market Gap & Differentiation Audit
            </span>
            <span className="text-neutral-500 font-mono">
              Copy Space: <strong className="text-indigo-300 capitalize">{opportunity.marketGap.recommendedCopySpace}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-neutral-800/80 bg-neutral-900/50 space-y-1">
              <span className="text-neutral-500 font-medium block">What is Overrepresented in Stock:</span>
              <p className="text-neutral-300 text-[11px] leading-relaxed line-through text-neutral-400">
                {opportunity.marketGap.overrepresented}
              </p>
            </div>

            <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 space-y-1">
              <span className="text-emerald-400 font-medium block">What is Missing (High Buyer Need):</span>
              <p className="text-neutral-200 text-[11px] leading-relaxed font-medium">
                {opportunity.marketGap.missingAngle}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-neutral-400 font-medium">Strategic Production Recommendation:</span>
            <p className="text-neutral-300 text-[11px] leading-relaxed">
              {opportunity.marketGap.recommendedDifferentiation}
            </p>
          </div>
        </div>

        {/* Demand Signals: Real Data vs AI Estimation */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2.5 text-xs">
          <span className="font-semibold text-neutral-200 block">
            Audited Demand Signals & Data Sources
          </span>
          <div className="space-y-2">
            {opportunity.signalSources.map((sig, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2 rounded border border-neutral-800/80 bg-neutral-900/40">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase mt-0.5 ${
                  sig.type === 'real_public'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}>
                  {sig.type === 'real_public' ? 'REAL SIGNAL' : 'AI ESTIMATION'}
                </span>
                <div>
                  <span className="font-semibold text-neutral-200 block">{sig.name}</span>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">{sig.signal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buyer Use Cases & Keyword Clusters */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 space-y-1.5">
            <span className="font-semibold text-neutral-300 block">Commercial Buyer Use Cases</span>
            <ul className="list-disc list-inside space-y-1 text-neutral-400 text-[11px]">
              {opportunity.buyerUseCases.map((use, i) => (
                <li key={i}>{use}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 space-y-1.5">
            <span className="font-semibold text-neutral-300 block">Core Keyword Clusters</span>
            <div className="flex flex-wrap gap-1 pt-1">
              {opportunity.keywordClusters.map((kw, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-[11px] bg-neutral-900 text-indigo-300 border border-neutral-800 font-mono">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-neutral-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-xs font-medium transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onMakeAsset(opportunity);
              onClose();
            }}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Buat Prompt Pack &amp; Metadata</span>
          </button>
        </div>
      </div>
    </div>
  );
};
