import React, { useState } from 'react';
import { ResearchOpportunity, StockAsset } from '../types';
import {
  generateAdobeStockCsv,
  generateMasterMetadataCsv,
  generatePromptsCatalogCsv,
  generateQualityReportCsv,
  generateResearchReportCsv,
  generateShutterstockCsv
} from '../services/csvExporter';
import { createMicrostockZipPackage } from '../services/zipExporter';
import {
  FolderArchive,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  ExternalLink
} from 'lucide-react';

interface ExportHubViewProps {
  assets: StockAsset[];
  opportunities: ResearchOpportunity[];
}

export const ExportHubView: React.FC<ExportHubViewProps> = ({
  assets,
  opportunities
}) => {
  const [activeTab, setActiveTab] = useState<'prompts' | 'adobe' | 'shutterstock' | 'master' | 'audit'>('prompts');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const readyAssets = assets.filter(a => a.status === 'READY' || a.status === 'PROMPT_READY');

  const downloadTextFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zipBlob = await createMicrostockZipPackage(readyAssets, opportunities);
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `microstock_submission_bundle_${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsZipping(false);
    }
  };

  const promptsCsv = generatePromptsCatalogCsv(assets);
  const adobeCsv = generateAdobeStockCsv(readyAssets);
  const shutterCsv = generateShutterstockCsv(readyAssets);
  const masterCsv = generateMasterMetadataCsv(readyAssets);
  const auditCsv = generateQualityReportCsv(assets);

  const getCurrentCsv = () => {
    switch (activeTab) {
      case 'prompts': return promptsCsv;
      case 'adobe': return adobeCsv;
      case 'shutterstock': return shutterCsv;
      case 'master': return masterCsv;
      case 'audit': return auditCsv;
    }
  };

  const handleCopyCurrent = () => {
    navigator.clipboard.writeText(getCurrentCsv());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Export Hub &amp; Submission Packager</h2>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              ({readyAssets.length} aset siap kirim / {assets.length} total)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Unduh CSV standar RFC 4180 siap upload ke Adobe Stock Contributor Portal &amp; Shutterstock CSV Batch.
          </p>
        </div>

        {/* Master 1-Click ZIP Download */}
        <button
          onClick={handleDownloadZip}
          disabled={isZipping || readyAssets.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-50 active:scale-97"
        >
          {isZipping ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Mengompresi Paket ZIP...</span>
            </>
          ) : (
            <>
              <FolderArchive className="w-4 h-4" />
              <span>Download Paket ZIP Lengkap</span>
            </>
          )}
        </button>
      </div>

      {/* CSV Tabs and Live Preview Panel */}
      <div className="rounded-2xl border border-slate-800/80 bg-[#0E1424]/90 overflow-hidden shadow-lg">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950/80 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1">
            {[
              { id: 'prompts', label: '⚡ Master Prompts CSV' },
              { id: 'adobe', label: 'Adobe Stock CSV' },
              { id: 'shutterstock', label: 'Shutterstock CSV' },
              { id: 'master', label: 'Master Universal CSV' },
              { id: 'audit', label: 'Laporan Audit Kualitas' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCurrent}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin CSV</span>
                </>
              )}
            </button>

            <button
              onClick={() => downloadTextFile(getCurrentCsv(), `${activeTab}_metadata_${Date.now()}.csv`)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File CSV</span>
            </button>
          </div>
        </div>

        {/* Live Code / CSV Viewer */}
        <div className="p-4 bg-slate-950 overflow-x-auto">
          <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre font-light select-all">
            {getCurrentCsv()}
          </pre>
        </div>
      </div>
    </div>
  );
};
