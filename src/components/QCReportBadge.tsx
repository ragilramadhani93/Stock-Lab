import React from 'react';
import { QualityCheckResult } from '../types';
import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck } from 'lucide-react';

interface QCReportBadgeProps {
  qc: QualityCheckResult;
  showDetails?: boolean;
}

export const QCReportBadge: React.FC<QCReportBadgeProps> = ({ qc, showDetails = false }) => {
  const getStatusColor = () => {
    if (qc.status === 'pass') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (qc.status === 'warning') return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const getStatusIcon = () => {
    if (qc.status === 'pass') return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    if (qc.status === 'warning') return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
  };

  if (!showDetails) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border font-medium ${getStatusColor()}`}>
          {getStatusIcon()}
          <span>QC {qc.status.toUpperCase()}</span>
        </span>
        <span className="text-neutral-400 font-mono tabular-nums font-medium">
          {qc.score}/100
        </span>
        <span aria-hidden="true" className="text-neutral-600">·</span>
        <span className={`capitalize font-medium ${qc.ipRisk === 'high' ? 'text-rose-400' : 'text-neutral-300'}`}>
          IP Risk: {qc.ipRisk}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-3.5 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          {qc.ipRisk === 'high' ? (
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          )}
          <span className="font-semibold text-neutral-200 text-sm">
            Commercial Quality & Compliance Audit
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded border text-xs font-semibold ${getStatusColor()}`}>
            {qc.status.toUpperCase()}
          </span>
          <span className="text-sm font-bold font-mono tabular-nums text-neutral-200">
            {qc.score}/100
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* People Anatomy QC */}
        <div className="p-2.5 rounded-lg border border-neutral-800/80 bg-neutral-950/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 font-medium">Human Anatomy Check</span>
            <span className={`font-semibold capitalize ${qc.peopleQC.status === 'pass' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {qc.peopleQC.status}
            </span>
          </div>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            {qc.peopleQC.checked
              ? (qc.peopleQC.defectsDetected.length > 0 ? qc.peopleQC.defectsDetected.join(', ') : 'Hands, fingers, facial structure verified clear of visual artifacts.')
              : 'No human subjects present. Anatomy inspection skipped.'}
          </p>
        </div>

        {/* Typography & Text QC */}
        <div className="p-2.5 rounded-lg border border-neutral-800/80 bg-neutral-950/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 font-medium">Typography & Copy Space</span>
            <span className={`font-semibold capitalize ${qc.typographyQC.status === 'pass' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {qc.typographyQC.status}
            </span>
          </div>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            {qc.typographyQC.recommendations}
          </p>
        </div>

        {/* Duplicate & Anti-Spam Similarity QC */}
        <div className="p-2.5 rounded-lg border border-neutral-800/80 bg-neutral-950/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 font-medium">Catalog Duplicate Check</span>
            <span className="font-mono tabular-nums text-neutral-300 font-semibold">
              {qc.similarityQC.highestSimilarityPct}% similar
            </span>
          </div>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            {qc.similarityQC.warningMessage || 'Safe from stock platform spam filters. Well differentiated from catalog.'}
          </p>
        </div>

        {/* IP & Trademark Risk */}
        <div className="p-2.5 rounded-lg border border-neutral-800/80 bg-neutral-950/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400 font-medium">IP & Trademark Risk</span>
            <span className={`font-semibold uppercase ${qc.ipRisk === 'low' ? 'text-emerald-400' : qc.ipRisk === 'medium' ? 'text-amber-400' : 'text-rose-400'}`}>
              {qc.ipRisk} Risk
            </span>
          </div>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            {qc.ipRiskReason || 'Zero protected trademarks, logos, living artist names, or copyrighted elements detected.'}
          </p>
        </div>
      </div>

      {/* Releases Required Bar */}
      <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
        <div className="flex items-center gap-1.5">
          <span>Model Release:</span>
          <span className="font-semibold text-neutral-300">{qc.modelRelease}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Property Release:</span>
          <span className="font-semibold text-neutral-300">{qc.propertyRelease}</span>
        </div>
      </div>
    </div>
  );
};
