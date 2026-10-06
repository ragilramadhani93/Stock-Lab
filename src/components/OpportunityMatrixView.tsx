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
  Info,
  Zap
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Matriks Peluang &amp; Sinyal Pasar</h2>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              ({opportunities.length} topik dievaluasi)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Peringkat multivariat berdasarkan volume pencarian riil, kegunaan komersial, dan risiko kejenuhan.
          </p>
        </div>

        {/* Filters and Sorters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterTrend}
            onChange={e => setFilterTrend(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">Semua Tipe Trend</option>
            <option value="evergreen">Evergreen Demand</option>
            <option value="emerging">Emerging Trend</option>
            <option value="gap">Market Gap</option>
            <option value="seasonal">Seasonal Demand</option>
          </select>

          <select
            value={filterRisk}
            onChange={e => setFilterRisk(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">Semua Risiko Saturasi</option>
            <option value="low">Low Saturation Risk</option>
            <option value="medium">Medium Saturation Risk</option>
            <option value="high">High Saturation Risk</option>
          </select>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-slate-300 focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer"
          >
            <option value="score">Urutkan: Skor Peluang</option>
            <option value="demand">Urutkan: Demand Pembeli</option>
            <option value="competition">Urutkan: Kompetisi Terendah</option>
          </select>
        </div>
      </div>

      {/* Opportunities Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/80 bg-[#0E1424]/60 p-12 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">Tidak ada topik yang sesuai filter</h3>
          <p className="text-xs text-slate-500">
            Coba ubah filter trend atau risiko saturasi di atas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(opp => {
            const isWorking = processingId === opp.id;
            return (
              <div
                key={opp.id}
                className="rounded-2xl border border-slate-800/80 bg-[#0E1424]/90 p-5 space-y-4 hover:border-slate-700/80 transition-all flex flex-col justify-between shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {opp.trendType.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Kompetisi: <strong className="text-white">{opp.competitionScore}/100</strong>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{opp.topic}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{opp.whyThisTopic}</p>
                  </div>

                  <OpportunityScoreCard
                    score={opp.opportunityScore}
                    competitionScore={opp.competitionScore}
                    saturationRisk={opp.saturationRisk}
                    commercialPotential={opp.commercialPotential}
                    compact
                  />

                  {/* Market Gap Mini Card */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1.5">
                    <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Celah Komersial:</span>
                    </div>
                    <p className="text-slate-300 text-xs line-clamp-2">
                      {opp.marketGap.missingAngle}
                    </p>
                  </div>
                </div>

                {/* Card footer actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onInspectOpportunity(opp)}
                    className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>Detail Strategi</span>
                  </button>

                  <button
                    onClick={() => handleMakeAsset(opp, true)}
                    disabled={isWorking}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isWorking ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Menyusun Prompt...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Buat Prompt Dossier</span>
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
