import React from 'react';
import { OpportunityScoreBreakdown } from '../types';

interface OpportunityScoreCardProps {
  score: OpportunityScoreBreakdown;
  competitionScore: number;
  saturationRisk: 'low' | 'medium' | 'high';
  commercialPotential: 'low' | 'medium' | 'high';
  seasonalWindow?: string;
  compact?: boolean;
}

export const OpportunityScoreCard: React.FC<OpportunityScoreCardProps> = ({
  score,
  competitionScore,
  saturationRisk,
  commercialPotential,
  seasonalWindow,
  compact = false
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 85) return 'text-emerald-400';
    if (val >= 70) return 'text-indigo-400';
    if (val >= 55) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBg = (val: number) => {
    if (val >= 85) return 'bg-gradient-to-r from-emerald-500 to-teal-400';
    if (val >= 70) return 'bg-gradient-to-r from-indigo-500 to-cyan-400';
    if (val >= 55) return 'bg-gradient-to-r from-amber-500 to-amber-400';
    return 'bg-gradient-to-r from-rose-500 to-rose-400';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-extrabold font-mono tabular-nums ${getScoreColor(score.total)}`}>
            {score.total}
          </span>
          <span className="text-xs text-slate-500 font-mono">/100</span>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>Demand {score.demand}%</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Commercial {score.commercialUsefulness}%</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Saturasi: <strong className="text-slate-200 capitalize font-medium">{saturationRisk}</strong></span>
        </div>
      </div>
    );
  }

  const breakdownMetrics = [
    { label: 'Demand Pasar', value: score.demand, weight: '25%' },
    { label: 'Commercial Utility', value: score.commercialUsefulness, weight: '20%' },
    { label: 'Keyword Opportunity', value: score.keywordOpportunity, weight: '15%' },
    { label: 'Trend Momentum', value: score.trendMomentum, weight: '15%' },
    { label: 'Evergreen Potential', value: score.evergreenPotential, weight: '10%' },
    { label: 'Diferensiasi', value: score.differentiationPotential, weight: '10%' },
    { label: 'Production Ease', value: score.productionEase, weight: '5%' }
  ];

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-4">
      {/* Top Score strip */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div>
          <span className="text-xs font-semibold text-slate-400 block">Opportunity Score</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className={`text-3xl font-extrabold font-mono tabular-nums ${getScoreColor(score.total)}`}>
              {score.total}
            </span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
          </div>
        </div>
        <div className="text-right space-y-1">
          <div className="text-xs text-slate-400 flex items-center justify-end gap-1.5">
            <span>Potensi Cuan:</span>
            <span className={`font-bold capitalize px-1.5 py-0.5 rounded text-[11px] ${
              commercialPotential === 'high' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {commercialPotential}
            </span>
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-end gap-1.5">
            <span>Risiko Saturasi:</span>
            <span className={`font-semibold capitalize text-[11px] ${saturationRisk === 'low' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {saturationRisk}
            </span>
          </div>
        </div>
      </div>

      {/* 7-Factor Weighted Breakdown Bars */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Breakdown 7-Faktor Pembobotan:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
          {breakdownMetrics.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-300">
                  {item.label} <span className="text-slate-500 font-mono">({item.weight})</span>
                </span>
                <span className="text-slate-200 font-mono tabular-nums font-semibold">{item.value}/100</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getScoreBg(item.value)}`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Competition & Seasonal Window footer */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <span>Skor Kompetisi:</span>
          <span className="font-mono tabular-nums text-slate-200 font-semibold">{competitionScore}/100</span>
          <span className="text-slate-500 font-mono text-[11px]">(makin kecil makin baik)</span>
        </div>
        {seasonalWindow && (
          <div className="flex items-center gap-1.5">
            <span>Musim:</span>
            <span className="text-indigo-300 font-medium">{seasonalWindow}</span>
          </div>
        )}
      </div>
    </div>
  );
};
