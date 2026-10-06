import React, { useState } from 'react';
import { ResearchOpportunity, StockAsset } from '../types';
import { OpportunityScoreCard } from './OpportunityScoreCard';
import {
  Sparkles,
  TrendingUp,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Eye,
  Info
} from 'lucide-react';

interface OpportunityMatrixViewProps {
  opportunities: ResearchOpportunity[];
  onOneClickAsset: (opp: ResearchOpportunity, promptOnly?: boolean) => Promise<StockAsset>;
  onInspectOpportunity: (opp: ResearchOpportunity) => void;
}

export const OpportunityMatrixView: React.FC<OpportunityMatrixViewProps> = ({
  opportunities,
  onOneClickAsset,
  onInspectOpportunity
}) => {
  const [filterTrend, setFilterTrend] = useState<string>('ALL');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'score' | 'demand' | 'competition'>('score');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filtered = opportunities
    .filter(opp => {
      const matchTrend = filterTrend === 'ALL' || opp.trendType === filterTrend;
      const matchRisk = filterRisk === 'ALL' || opp.saturationRisk === filterRisk;
      return matchTrend && matchRisk;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.opportunityScore.total - a.opportunityScore.total;
      if (sortBy === 'demand') return b.opportunityScore.demand - a.opportunityScore.demand;
      return a.competitionScore - b.competitionScore;
    });

  const handleMakeAsset = async (opp: ResearchOpportunity, promptOnly: boolean = true) => {
    setProcessingId(opp.id);
    try {
      await onOneClickAsset(opp, promptOnly);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Opportunity Matrix & Demand Signals</h2>
            <span className="text-xs font-mono text-neutral-400 tabular-nums">
              ({opportunities.length} evaluated)
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Multivariate ranking based on search volume, commercial utility, and market saturation risk.
          </p>
        </div>

        {/* Filters and Sorters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterTrend}
            onChange={e => setFilterTrend(e.target.value)}
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-neutral-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Trend Types</option>
            <option value="evergreen">Evergreen Demand</option>
            <option value="emerging">Emerging Trend</option>
            <option value="gap">Market Gap</option>
            <option value="seasonal">Seasonal Demand</option>
          </select>

          <select
            value={filterRisk}
            onChange={e => setFilterRisk(e.target.value)}
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-neutral-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Saturation Risks</option>
            <option value="low">Low Saturation Risk</option>
            <option value="medium">Medium Saturation Risk</option>
            <option value="high">High Saturation Risk</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-neutral-300 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="score">Sort by Opportunity Score</option>
            <option value="demand">Sort by Buyer Demand</option>
            <option value="competition">Sort by Low Competition</option>
          </select>
        </div>
      </div>

      {/* Grid of Opportunity Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-12 text-center text-xs text-neutral-500">
          No opportunities match the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(opp => {
            const isWorking = processingId === opp.id;
            return (
              <div
                key={opp.id}
                className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span className="font-semibold text-indigo-400 uppercase tracking-wider">{opp.contentType}</span>
                    <span className="capitalize text-emerald-400 font-medium">{opp.trendType}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2">
                    {opp.topic}
                  </h3>

                  <OpportunityScoreCard
                    score={opp.opportunityScore}
                    competitionScore={opp.competitionScore}
                    saturationRisk={opp.saturationRisk}
                    commercialPotential={opp.commercialPotential}
                    compact={true}
                  />

                  {/* Market Gap snippet */}
                  <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-2.5 space-y-1 text-xs">
                    <span className="text-neutral-400 font-medium text-[11px] block">Commercial Gap:</span>
                    <p className="text-neutral-300 text-[11px] line-clamp-2 leading-relaxed">
                      {opp.marketGap.missingAngle}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onInspectOpportunity(opp)}
                    className="p-2 rounded-lg border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                    title="Inspect Opportunity Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleMakeAsset(opp, true)}
                    disabled={isWorking}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors disabled:opacity-50"
                    title="Buat Prompt Pack & Metadata ($0 Biaya Gambar)"
                  >
                    {isWorking ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Menyusun Prompt...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>BUAT PROMPT PACK</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
