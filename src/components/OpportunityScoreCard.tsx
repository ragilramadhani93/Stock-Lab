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
    if (val >= 85) return 'bg-emerald-500';
    if (val >= 70) return 'bg-indigo-500';
    if (val >= 55) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold font-mono tabular-nums ${getScoreColor(score.total)}`}>
            {score.total}
          </span>
          <span className="text-xs text-neutral-500 font-mono">/100</span>
        </div>
        <div className="text-xs text-neutral-400 flex items-center gap-2">
          <span>Demand {score.demand}%</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>Commercial {score.commercialUsefulness}%</span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span>Saturation: <strong className="text-neutral-200 capitalize font-medium">{saturationRisk}</strong></span>
        </div>
      </div>
    );
  }

  const breakdownMetrics = [
    { label: 'Demand', value: score.demand, weight: '25%' },
    { label: 'Commercial Utility', value: score.commercialUsefulness, weight: '20%' },
    { label: 'Keyword Opportunity', value: score.keywordOpportunity, weight: '15%' },
    { label: 'Trend Momentum', value: score.trendMomentum, weight: '15%' },
    { label: 'Evergreen Potential', value: score.evergreenPotential, weight: '10%' },
    { label: 'Differentiation', value: score.differentiationPotential, weight: '10%' },
    { label: 'Production Ease', value: score.productionEase, weight: '5%' }
  ];

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
        <div>
          <span className="text-xs font-medium text-neutral-400 block">Opportunity Score</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className={`text-3xl font-extrabold font-mono tabular-nums ${getScoreColor(score.total)}`}>
              {score.total}
            </span>
            <span className="text-xs text-neutral-500 font-mono">/ 100</span>
          </div>
        </div>
        <div className="text-right space-y-1">
          <div className="text-xs text-neutral-400 flex items-center justify-end gap-1.5">
            <span>Commercial Potential:</span>
            <span className={`font-semibold capitalize ${commercialPotential === 'high' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {commercialPotential}
            </span>
          </div>
          <div className="text-xs text-neutral-400 flex items-center justify-end gap-1.5">
            <span>Saturation Risk:</span>
            <span className={`font-medium capitalize ${saturationRisk === 'low' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {saturationRisk}
            </span>
          </div>
        </div>
      </div>

      {/* 7-Factor Weighted Breakdown Bars */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-neutral-400 block">Weighted Framework Analysis</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
          {breakdownMetrics.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">{item.label} <span className="text-neutral-600 font-mono">({item.weight})</span></span>
                <span className="text-neutral-200 font-mono tabular-nums font-medium">{item.value}/100</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
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
      <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-1.5">
          <span>Competition Score:</span>
          <span className="font-mono tabular-nums text-neutral-200 font-medium">{competitionScore}/100</span>
          <span className="text-neutral-500 font-mono">(lower is better)</span>
        </div>
        {seasonalWindow && (
          <div className="flex items-center gap-1.5">
            <span>Seasonal Window:</span>
            <span className="text-indigo-300 font-medium">{seasonalWindow}</span>
          </div>
        )}
      </div>
    </div>
  );
};
