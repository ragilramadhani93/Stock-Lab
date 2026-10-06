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
  X,
  Download,
  FolderArchive,
  FileSpreadsheet,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ExportModalProps {
  assets: StockAsset[];
  opportunities: ResearchOpportunity[];
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  assets,
  opportunities,
  onClose
}) => {
  const [isZipping, setIsZipping] = useState(false);
  const readyAssets = assets.filter(a => a.status === 'READY');
  const highRiskAssets = assets.filter(a => a.qualityCheck.ipRisk === 'high');

  const downloadTextFile = (content: string, filename: string, mime: string = 'text/csv;charset=utf-8;') => {
    const blob = new Blob([content], { type: mime });
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
    } catch (err) {
      console.error('Error generating submission ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Microstock Submission Export Hub
              </h3>
              <span className="text-xs text-neutral-400">
                {readyAssets.length} verified ready assets out of {assets.length} total
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* IP Safety Safeguard Notice */}
        {highRiskAssets.length > 0 ? (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-semibold text-rose-300 block">
                Safety Block: {highRiskAssets.length} asset(s) flagged with HIGH IP Risk
              </span>
              <p className="text-rose-200/80 leading-relaxed text-[11px]">
                To safeguard your contributor accounts on Adobe Stock & Shutterstock from strikes, assets with potential trademarks or living artist references are excluded from production export.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-center gap-2.5 text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>All assets cleared IP compliance: Zero trademarks or protected brands.</span>
          </div>
        )}

        {/* Primary Action: Full ZIP Package */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h4 className="text-sm font-semibold text-white">Full Microstock Production Bundle (ZIP)</h4>
              <p className="text-xs text-neutral-400">
                Includes <code className="text-indigo-400">/assets</code>, <code className="text-indigo-400">/metadata</code> (Adobe & Shutterstock CSVs), and <code className="text-indigo-400">/reports</code>.
              </p>
            </div>
            <button
              onClick={handleDownloadZip}
              disabled={isZipping || readyAssets.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
            >
              {isZipping ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Packaging ZIP...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download ZIP Bundle</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Individual CSV Export Actions */}
        <div className="space-y-2.5">
          <span className="text-xs font-semibold text-neutral-400 block">Individual Platform CSVs & Reports</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {/* Prompt Pack CSV */}
            <div className="p-3 rounded-lg border border-indigo-500/30 bg-indigo-600/10 flex items-center justify-between sm:col-span-2">
              <div>
                <span className="font-semibold text-indigo-300 block">⚡ Prompts & Generators Catalog CSV</span>
                <span className="text-[11px] text-neutral-400 font-mono">Midjourney, Flux, SD commands + negative prompts + copy space directions</span>
              </div>
              <button
                onClick={() => downloadTextFile(generatePromptsCatalogCsv(assets), 'prompts_and_generators.csv')}
                className="p-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                title="Download Prompts CSV"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Adobe Stock CSV */}
            <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 flex items-center justify-between">
              <div>
                <span className="font-semibold text-neutral-200 block">Adobe Stock CSV</span>
                <span className="text-[11px] text-neutral-500 font-mono">Title ≤70 chars · Top 10 KW</span>
              </div>
              <button
                onClick={() => downloadTextFile(generateAdobeStockCsv(readyAssets), 'adobe_stock_metadata.csv')}
                className="p-2 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                title="Download Adobe CSV"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Shutterstock CSV */}
            <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 flex items-center justify-between">
              <div>
                <span className="font-semibold text-neutral-200 block">Shutterstock CSV</span>
                <span className="text-[11px] text-neutral-500 font-mono">Descriptive sentence · 50 KW</span>
              </div>
              <button
                onClick={() => downloadTextFile(generateShutterstockCsv(readyAssets), 'shutterstock_metadata.csv')}
                className="p-2 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                title="Download Shutterstock CSV"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Universal Master CSV */}
            <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 flex items-center justify-between">
              <div>
                <span className="font-semibold text-neutral-200 block">Master Metadata CSV</span>
                <span className="text-[11px] text-neutral-500 font-mono">Complete unified database</span>
              </div>
              <button
                onClick={() => downloadTextFile(generateMasterMetadataCsv(readyAssets), 'metadata_master.csv')}
                className="p-2 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                title="Download Master CSV"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Quality & Compliance Audit CSV */}
            <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 flex items-center justify-between">
              <div>
                <span className="font-semibold text-neutral-200 block">QC & Audit Report CSV</span>
                <span className="text-[11px] text-neutral-500 font-mono">IP risk & anatomy compliance</span>
              </div>
              <button
                onClick={() => downloadTextFile(generateQualityReportCsv(assets), 'quality_report.csv')}
                className="p-2 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                title="Download Quality Report CSV"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
