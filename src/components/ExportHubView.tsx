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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Export Hub & Submission Packager</h2>
            <span className="text-xs font-mono text-neutral-400 tabular-nums">
              ({readyAssets.length} prompt/asset packs ready / {assets.length} total)
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Produce certified RFC 4180 CSV metadata files formatted precisely to Adobe Stock and Shutterstock specifications.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping || readyAssets.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
        >
          {isZipping ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Packaging ZIP...</span>
            </>
          ) : (
            <>
              <FolderArchive className="w-4 h-4" />
              <span>Download Complete ZIP Bundle ({readyAssets.length} Assets)</span>
            </>
          )}
        </button>
      </div>

      {/* 5 Platform Export Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        {[
          { id: 'prompts', name: '⚡ Prompt Pack CSV', desc: 'Midjourney, Flux, SD commands + negative prompt & copy space', fn: () => downloadTextFile(promptsCsv, 'prompts_and_generators.csv') },
          { id: 'adobe', name: 'Adobe Stock CSV', desc: 'Title ≤70 chars · First 10 priority keywords · Generative AI flagged', fn: () => downloadTextFile(adobeCsv, 'adobe_stock_metadata.csv') },
          { id: 'shutterstock', name: 'Shutterstock CSV', desc: 'Descriptive natural English sentence · 7-50 keywords · Vector flagged', fn: () => downloadTextFile(shutterCsv, 'shutterstock_metadata.csv') },
          { id: 'master', name: 'Master Metadata CSV', desc: 'Full unified schema with layered keywords & opportunity scores', fn: () => downloadTextFile(masterCsv, 'metadata_master.csv') },
          { id: 'audit', name: 'Compliance Audit CSV', desc: 'People anatomy, typography, similarity %, IP risk evaluation', fn: () => downloadTextFile(auditCsv, 'quality_audit_report.csv') }
        ].map(card => (
          <div
            key={card.id}
            className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
              activeTab === card.id
                ? 'border-indigo-500/50 bg-indigo-600/10'
                : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'
            }`}
          >
            <div className="space-y-1">
              <h4 className="font-semibold text-white">{card.name}</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">{card.desc}</p>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/80">
              <button
                onClick={() => setActiveTab(card.id as any)}
                className={`flex-1 py-1.5 rounded text-[11px] font-medium transition-colors ${
                  activeTab === card.id ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:text-white'
                }`}
              >
                Preview CSV
              </button>
              <button
                onClick={card.fn}
                className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                title="Download CSV"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CSV Live Preview Window */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-xs">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-white capitalize">{activeTab} Metadata CSV Preview</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCurrent}
              className="text-neutral-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied CSV' : 'Copy CSV'}</span>
            </button>
            <button
              onClick={() => {
                if (activeTab === 'adobe') downloadTextFile(adobeCsv, 'adobe_stock_metadata.csv');
                else if (activeTab === 'shutterstock') downloadTextFile(shutterCsv, 'shutterstock_metadata.csv');
                else if (activeTab === 'master') downloadTextFile(masterCsv, 'metadata_master.csv');
                else downloadTextFile(auditCsv, 'quality_audit_report.csv');
              }}
              className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-medium transition-colors"
            >
              Download
            </button>
          </div>
        </div>

        <pre className="h-64 rounded-lg border border-neutral-800 bg-neutral-950 p-4 font-mono text-[11px] text-neutral-300 overflow-x-auto overflow-y-auto leading-relaxed select-all">
          {getCurrentCsv()}
        </pre>
      </div>
    </div>
  );
};
