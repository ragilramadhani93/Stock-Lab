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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Konsol Audit Kepatuhan &amp; Kontrol Kualitas</h2>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              ({assets.length} aset diaudit)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Verifikasi otomatis anatomi manusia, tipografi bebas cacat, deteksi duplikasi, dan audit risiko merek dagang.
          </p>
        </div>

        {/* IP Filter */}
        <select
          value={filterRisk}
          onChange={e => setFilterRisk(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="ALL">Semua Level Risiko</option>
          <option value="low">Risiko IP Rendah (Aman)</option>
          <option value="medium">Perlu Review Manual</option>
          <option value="high">Risiko Tinggi (Diblokir)</option>
        </select>
      </div>

      {/* Compliance Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl border border-slate-800/80 bg-[#0E1424]/90 space-y-1">
          <span className="text-slate-400 block text-[11px]">Lulus QC Penuh</span>
          <span className="text-2xl font-extrabold font-mono tabular-nums text-emerald-400 block">{passCount}</span>
          <span className="text-[11px] text-slate-500">Siap kirim ke Adobe/SS</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800/80 bg-[#0E1424]/90 space-y-1">
          <span className="text-slate-400 block text-[11px]">Perlu Review / Peringatan</span>
          <span className="text-2xl font-extrabold font-mono tabular-nums text-amber-400 block">{warningCount}</span>
          <span className="text-[11px] text-slate-500">Rekomendasi minor</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800/80 bg-[#0E1424]/90 space-y-1">
          <span className="text-slate-400 block text-[11px]">Risiko Pelanggaran IP</span>
          <span className={`text-2xl font-extrabold font-mono tabular-nums block ${highRiskCount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
            {highRiskCount}
          </span>
          <span className="text-[11px] text-slate-500">Proteksi trademark</span>
        </div>

        <div className="p-4 rounded-2xl border border-slate-800/80 bg-[#0E1424]/90 space-y-1">
          <span className="text-slate-400 block text-[11px]">Rata-rata Skor Kualitas</span>
          <span className="text-2xl font-extrabold font-mono tabular-nums text-white block">
            {assets.length > 0 ? Math.round(assets.reduce((acc, a) => acc + a.qualityCheck.score, 0) / assets.length) : 0}/100
          </span>
          <span className="text-[11px] text-slate-500">Standar komersial</span>
        </div>
      </div>

      {/* Asset Audit List */}
      <div className="space-y-3">
        {filtered.map(asset => (
          <div
            key={asset.id}
            onClick={() => onSelectAsset(asset)}
            className="rounded-2xl border border-slate-800/80 bg-[#0E1424]/90 p-4 hover:border-slate-700/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer shadow-md"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400 font-semibold">{asset.filename}</span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-300 capitalize">{asset.metadata.category}</span>
              </div>
              <h4 className="text-sm font-bold text-white leading-snug">{asset.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-1">{asset.promptDetails.masterPrompt}</p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <QCReportBadge qc={asset.qualityCheck} showDetails />
                <span className="text-[10px] text-slate-500 font-mono block mt-1">
                  Skor: {asset.qualityCheck.score}/100
                </span>
              </div>

              <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => onSelectAsset(asset)}
                  className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors"
                  title="Lihat Detail Audit"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDownloadAsset(asset)}
                  className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-colors"
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
