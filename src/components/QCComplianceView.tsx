import React, { useState } from 'react';
import { StockAsset } from '../types';
import { QCReportBadge } from './QCReportBadge';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Download
} from 'lucide-react';

interface QCComplianceViewProps {
  assets: StockAsset[];
  onSelectAsset: (asset: StockAsset) => void;
  onDownloadAsset: (asset: StockAsset) => void;
}

export const QCComplianceView: React.FC<QCComplianceViewProps> = ({
  assets,
  onSelectAsset,
  onDownloadAsset
}) => {
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  const passCount = assets.filter(a => a.qualityCheck.status === 'pass').length;
  const warningCount = assets.filter(a => a.qualityCheck.status === 'warning').length;
  const failCount = assets.filter(a => a.qualityCheck.status === 'fail').length;
  const highRiskCount = assets.filter(a => a.qualityCheck.ipRisk === 'high').length;

  const filtered = assets.filter(a => {
    if (filterRisk === 'ALL') return true;
    return a.qualityCheck.ipRisk === filterRisk;
  });

  return (
    <div className="space-y-6">
      {/* Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Quality & Compliance Audit Console</h2>
            <span className="text-xs font-mono text-neutral-400 tabular-nums">
              ({assets.length} assets audited)
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Automated verification of anatomy, typography, duplicate similarity, and trademark risks.
          </p>
        </div>

        {/* IP Filter */}
        <select
          value={filterRisk}
          onChange={e => setFilterRisk(e.target.value)}
          className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">All Risk Levels</option>
          <option value="low">Low IP Risk (Safe)</option>
          <option value="medium">Medium Review</option>
          <option value="high">High IP Risk (Blocked)</option>
        </select>
      </div>

      {/* Compliance Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-1">
          <span className="text-neutral-500 block">Passed Full QC</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400 block">{passCount}</span>
          <span className="text-[11px] text-neutral-500">Ready for submission</span>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-1">
          <span className="text-neutral-500 block">Needs Review / Warnings</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-amber-400 block">{warningCount}</span>
          <span className="text-[11px] text-neutral-500">Minor recommendations</span>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-1">
          <span className="text-neutral-500 block">High IP Risk (Blocked)</span>
          <span className={`text-2xl font-bold font-mono tabular-nums block ${highRiskCount > 0 ? 'text-rose-400' : 'text-neutral-400'}`}>
            {highRiskCount}
          </span>
          <span className="text-[11px] text-neutral-500">Trademark prevention</span>
        </div>

        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-1">
          <span className="text-neutral-500 block">Avg Quality Score</span>
          <span className="text-2xl font-bold font-mono tabular-nums text-white block">
            {assets.length > 0 ? Math.round(assets.reduce((acc, a) => acc + a.qualityCheck.score, 0) / assets.length) : 0}/100
          </span>
          <span className="text-[11px] text-neutral-500">Commercial grade</span>
        </div>
      </div>

      {/* Asset Audit List */}
      <div className="space-y-3">
        {filtered.map(asset => (
          <div
            key={asset.id}
            onClick={() => onSelectAsset(asset)}
            className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-neutral-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-10 rounded bg-neutral-950 border border-neutral-800 overflow-hidden flex items-center justify-center shrink-0">
                {asset.vectorSvg ? (
                  <div
                    className="w-full h-full p-1"
                    dangerouslySetInnerHTML={{ __html: asset.vectorSvg }}
                  />
                ) : (
                  <img
                    src={asset.dataUrl}
                    alt={asset.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-neutral-200 line-clamp-1">{asset.title}</h4>
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
                  <span>{asset.filename}.{asset.format}</span>
                  <span aria-hidden="true">·</span>
                  <span>{asset.metadata.category}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <QCReportBadge qc={asset.qualityCheck} showDetails={false} />

              <div className="flex items-center gap-1.5">
                <button
                  onClick={(e) => { e.stopPropagation(); onSelectAsset(asset); }}
                  className="p-1.5 rounded-lg border border-neutral-800 hover:bg-neutral-800 text-neutral-300 transition-colors"
                  title="View Audit Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDownloadAsset(asset); }}
                  className="p-1.5 rounded-lg border border-neutral-800 hover:bg-neutral-800 text-neutral-300 transition-colors"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
