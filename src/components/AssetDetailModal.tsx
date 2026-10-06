import React, { useState } from 'react';
import { Platform, StockAsset } from '../types';
import { QCReportBadge } from './QCReportBadge';
import {
  formatAdobeStockMetadata,
  formatShutterstockMetadata
} from '../config/platformRules';
import {
  X,
  Download,
  Copy,
  Sparkles,
  CheckCircle2,
  FileCode,
  Layers,
  ShieldCheck,
  RefreshCw,
  Check,
  Zap,
  Terminal,
  ImageIcon
} from 'lucide-react';

interface AssetDetailModalProps {
  asset: StockAsset | null;
  onClose: () => void;
  onDownload: (asset: StockAsset) => void;
  onCreateVariation: (asset: StockAsset) => void;
  onRegenerateMetadata: (asset: StockAsset) => void;
  onRenderImage?: (asset: StockAsset) => Promise<void>;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  onDownload,
  onCreateVariation,
  onRegenerateMetadata,
  onRenderImage
}) => {
  const [activePlatformTab, setActivePlatformTab] = useState<'prompt_pack' | 'adobe' | 'shutterstock' | 'layered' | 'qc'>('prompt_pack');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showCopySpaceGuide, setShowCopySpaceGuide] = useState(true);
  const [isRendering, setIsRendering] = useState(false);

  if (!asset) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRender = async () => {
    if (!onRenderImage) return;
    setIsRendering(true);
    try {
      await onRenderImage(asset);
    } finally {
      setIsRendering(false);
    }
  };

  const adobeData = formatAdobeStockMetadata(asset.metadata);
  const shutterData = formatShutterstockMetadata(asset.metadata);

  const arParam = asset.promptDetails.aspectRatio;
  const mjSyntax = asset.generatorParams?.midjourney ||
    `/imagine prompt: ${asset.promptDetails.masterPrompt} --ar ${arParam} --v 6.1 --style raw --stylize 100 --no ${asset.promptDetails.negativePrompt}`;
  const fluxSyntax = asset.generatorParams?.flux ||
    `${asset.promptDetails.masterPrompt} [negative: ${asset.promptDetails.negativePrompt}]`;
  const sdSyntax = asset.generatorParams?.stableDiffusion ||
    `${asset.promptDetails.masterPrompt}\nNegative prompt: ${asset.promptDetails.negativePrompt}\nSteps: 30, Sampler: DPM++ 2M Karras, CFG scale: 7`;
  const dalleSyntax = asset.generatorParams?.dallE || asset.promptDetails.masterPrompt;

  const isPromptOnly = asset.isPromptOnly || asset.status === 'PROMPT_READY';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-800 bg-[#0E1424] shadow-2xl overflow-hidden my-8 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/70">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-slate-300 font-semibold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              {asset.filename}.{asset.format}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {asset.status}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Skor Peluang: <strong className="text-white font-mono">{asset.metadata.opportunity_score}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownload(asset)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .{asset.format.toUpperCase()}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
          {/* Left Column: Asset Preview & Quick Actions (5 cols) */}
          <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col justify-between space-y-4 bg-slate-950/50">
            <div className="space-y-4">
              <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shadow-inner">
                {asset.vectorSvg ? (
                  <div
                    className="w-full h-full p-2 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: asset.vectorSvg }}
                  />
                ) : (
                  <img
                    src={asset.dataUrl}
                    alt={asset.title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}

                {/* Optional Copy Space Guide Visualizer */}
                {showCopySpaceGuide && (
                  <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-indigo-500/40 m-3 rounded-xl flex items-end justify-start p-2">
                    <span className="text-[10px] font-mono text-indigo-300 bg-slate-950/90 px-2 py-0.5 rounded border border-indigo-500/40">
                      Copy Space: {asset.promptDetails.copySpace}
                    </span>
                  </div>
                )}
              </div>

              {/* View Control Buttons */}
              <div className="flex items-center justify-between text-xs text-slate-400">
                <button
                  onClick={() => setShowCopySpaceGuide(!showCopySpaceGuide)}
                  className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{showCopySpaceGuide ? 'Sembunyikan Garis Copy Space' : 'Tampilkan Garis Copy Space'}</span>
                </button>

                <span className="font-mono text-slate-500 text-[11px]">
                  Rasio: {asset.promptDetails.aspectRatio}
                </span>
              </div>

              {/* Asset Title & Description */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <h3 className="text-sm font-bold text-white leading-snug">
                  {asset.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {asset.metadata.description}
                </p>
              </div>

              {/* Technical Specifications Chips */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2">
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">KATEGORI STOCK</span>
                  <span className="text-slate-200 capitalize font-medium">{asset.metadata.category}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">AI GENERATED FLAG</span>
                  <span className="text-emerald-400 font-semibold">Yes (Generative AI)</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">MODEL / PROPERTY</span>
                  <span className="text-slate-300">
                    {asset.metadata.people_present ? 'Model Release N/A' : 'No People / Objects'}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">IP RISK AUDIT</span>
                  <span className="text-emerald-400 font-semibold">Clean / Commercial Safe</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions for Left Col */}
            <div className="space-y-2 pt-4 border-t border-slate-800/80">
              {isPromptOnly && onRenderImage && (
                <button
                  onClick={handleRender}
                  disabled={isRendering}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all cursor-pointer"
                >
                  {isRendering ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-cyan-300/30 border-t-cyan-300 rounded-full animate-spin" />
                      <span>Merender Preview Visual...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Render Preview Visual (SVG)</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => onCreateVariation(asset)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Buat Variasi Rasio (16:9 / 9:16 / 1:1)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Platform Metadata & Prompt Packs (7 cols) */}
          <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-4">
            {/* Segmented Platform Tabs */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              {[
                { id: 'prompt_pack', label: '⚡ Prompt AI Model', icon: Zap },
                { id: 'adobe', label: 'Adobe Stock CSV', icon: FileCode },
                { id: 'shutterstock', label: 'Shutterstock CSV', icon: FileCode },
                { id: 'layered', label: `Keywords (${asset.metadata.keywords.length})`, icon: Layers },
                { id: 'qc', label: 'Audit QC & IP', icon: ShieldCheck }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activePlatformTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePlatformTab(tab.id as any)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT 1: PROMPT PACK & AI GENERATOR SYNTAXES */}
            {activePlatformTab === 'prompt_pack' && (
              <div className="space-y-4 text-xs">
                {/* Master Prompt Card */}
                <div className="rounded-xl border border-indigo-500/30 bg-slate-950/80 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-indigo-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      MASTER PROMPT (STOCK-SAFE COMMERCIAL)
                    </span>
                    <button
                      onClick={() => handleCopy(asset.promptDetails.masterPrompt, 'master_prompt')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedKey === 'master_prompt' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'master_prompt' ? 'Tersalin' : 'Salin Master Prompt'}</span>
                    </button>
                  </div>
                  <p className="text-slate-200 font-mono text-xs leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800 select-all">
                    {asset.promptDetails.masterPrompt}
                  </p>
                </div>

                {/* Negative Prompt Card */}
                <div className="rounded-xl border border-rose-500/20 bg-slate-950/80 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-rose-400 font-semibold uppercase tracking-wider text-[11px]">
                      NEGATIVE PROMPT (PENOLAKAN CACAT &amp; TRADEMARK)
                    </span>
                    <button
                      onClick={() => handleCopy(asset.promptDetails.negativePrompt, 'negative_prompt')}
                      className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedKey === 'negative_prompt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Salin Negative</span>
                    </button>
                  </div>
                  <p className="text-slate-400 font-mono text-[11px] leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    {asset.promptDetails.negativePrompt}
                  </p>
                </div>

                {/* Multi-Model Generator Syntaxes */}
                <div className="space-y-2">
                  <span className="text-slate-400 font-semibold uppercase text-[11px] block">
                    Sintaks Siap Pakai per Model AI:
                  </span>
                  
                  {/* Midjourney v6.1 */}
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                        Midjourney v6.1
                      </span>
                      <button
                        onClick={() => handleCopy(mjSyntax, 'mj_syntax')}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'mj_syntax' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Salin /imagine</span>
                      </button>
                    </div>
                    <p className="text-slate-300 font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-800 truncate">
                      {mjSyntax}
                    </p>
                  </div>

                  {/* FLUX.1 */}
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        FLUX.1 [dev/schnell]
                      </span>
                      <button
                        onClick={() => handleCopy(fluxSyntax, 'flux_syntax')}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'flux_syntax' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Salin Prompt Flux</span>
                      </button>
                    </div>
                    <p className="text-slate-300 font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-800 truncate">
                      {fluxSyntax}
                    </p>
                  </div>

                  {/* Stable Diffusion */}
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        Stable Diffusion XL (WebUI / ComfyUI)
                      </span>
                      <button
                        onClick={() => handleCopy(sdSyntax, 'sd_syntax')}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'sd_syntax' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Salin SD Parameters</span>
                      </button>
                    </div>
                    <p className="text-slate-300 font-mono text-[11px] bg-slate-950 p-2 rounded border border-slate-800 truncate">
                      {sdSyntax}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: ADOBE STOCK */}
            {activePlatformTab === 'adobe' && (
              <div className="space-y-4 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Format Judul Adobe Stock (Maks 70 Karakter)</span>
                      <span className="text-white font-semibold text-sm">{adobeData.title}</span>
                    </div>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      {adobeData.title.length}/70 chars
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-slate-400 block text-[11px]">Keywords Diurutkan Berdasarkan Relevansi (Koma-Dipisah)</span>
                    <p className="text-slate-300 font-mono text-[11px] leading-relaxed bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 max-h-24 overflow-y-auto">
                      {adobeData.keywords}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block">KATEGORI ID</span>
                      <span className="text-white font-mono font-semibold">{adobeData.category}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block">RELEASES</span>
                      <span className="text-slate-300 font-mono">{adobeData.releases || 'None required'}</span>
                    </div>
                  </div>
                </div>

                {/* 1-Click Adobe CSV Line Copy */}
                <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/5 flex items-center justify-between">
                  <span className="text-slate-300 text-[11px]">
                    Salin satu baris utuh sesuai spesifikasi Adobe Stock CSV Upload:
                  </span>
                  <button
                    onClick={() => {
                      const line = `"${adobeData.filename}","${adobeData.title}","${adobeData.keywords}","${adobeData.category}","${adobeData.releases}"`;
                      handleCopy(line, 'adobe_csv_line');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'adobe_csv_line' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'adobe_csv_line' ? 'Tersalin' : 'Salin Baris CSV'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: SHUTTERSTOCK */}
            {activePlatformTab === 'shutterstock' && (
              <div className="space-y-4 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Deskripsi Lengkap (Kalimat Faktual Komersial)</span>
                    <span className="text-white font-semibold">{shutterData.description}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <span className="text-slate-400 block text-[11px]">Keywords (Maksimal 50 kata)</span>
                    <p className="text-slate-300 font-mono text-[11px] leading-relaxed bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 max-h-24 overflow-y-auto">
                      {shutterData.keywords}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block">KATEGORI SHUTTERSTOCK</span>
                      <span className="text-white font-medium">{shutterData.category}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-500 block">STATUS EDITORIAL / COMMERCIAL</span>
                      <span className="text-slate-300 font-medium">{shutterData.editorial === 'yes' ? 'Editorial' : 'Commercial'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
                  <span className="text-slate-300 text-[11px]">
                    Salin satu baris utuh format Shutterstock:
                  </span>
                  <button
                    onClick={() => {
                      const line = `"${shutterData.filename}","${shutterData.description}","${shutterData.keywords}","${shutterData.category}","","${shutterData.editorial}"`;
                      handleCopy(line, 'shutter_line');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  >
                    {copiedKey === 'shutter_line' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'shutter_line' ? 'Tersalin' : 'Salin Shutterstock CSV'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: LAYERED KEYWORDS */}
            {activePlatformTab === 'layered' && (
              <div className="space-y-3 text-xs max-h-[380px] overflow-y-auto pr-1">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-slate-400">Total {asset.metadata.keywords.length} Kata Kunci Terverifikasi</span>
                  <button
                    onClick={() => onRegenerateMetadata(asset)}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate Keywords</span>
                  </button>
                </div>

                {/* Primary */}
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1.5">
                  <span className="font-semibold text-indigo-400 text-[11px] block">
                    1. Primary Subjects ({asset.metadata.layeredKeywords.primary.length}) - Objek Utama:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {asset.metadata.layeredKeywords.primary.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px]">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Secondary */}
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1.5">
                  <span className="font-semibold text-slate-300 text-[11px] block">
                    2. Secondary Context ({asset.metadata.layeredKeywords.secondary.length}) - Lingkungan &amp; Objek:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {asset.metadata.layeredKeywords.secondary.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Intent */}
                <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1.5">
                  <span className="font-semibold text-emerald-400 text-[11px] block">
                    3. Buyer Search Intent ({asset.metadata.layeredKeywords.intent.length}) - Tujuan Pembeli Iklan:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {asset.metadata.layeredKeywords.intent.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px]">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Concept */}
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1.5">
                  <span className="font-semibold text-slate-300 text-[11px] block">
                    4. Conceptual &amp; Metaphor ({asset.metadata.layeredKeywords.concept.length}) - Makna Bisnis:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {asset.metadata.layeredKeywords.concept.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Usage */}
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/50 space-y-1.5">
                  <span className="font-semibold text-slate-300 text-[11px] block">
                    5. Commercial Licensing Usage ({asset.metadata.layeredKeywords.usage.length}) - Media Kampanye:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {asset.metadata.layeredKeywords.usage.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 5: QC & AUDIT */}
            {activePlatformTab === 'qc' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="font-semibold text-white">Status Kelulusan Quality Control</span>
                    <QCReportBadge qc={asset.qualityCheck} showDetails />
                  </div>

                  <div className="space-y-2">
                    {/* People anatomy */}
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Anatomi Manusia &amp; Ekstremitas:</span>
                      <span className="text-emerald-400 font-semibold">
                        {asset.qualityCheck.peopleQC.defectsDetected.length === 0 ? 'Normal / Bebas Cacat' : asset.qualityCheck.peopleQC.defectsDetected.join(', ')}
                      </span>
                    </div>

                    {/* Typography */}
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Tipografi / Text Embedded:</span>
                      <span className="text-emerald-400 font-semibold">
                        {asset.qualityCheck.typographyQC.hasText ? 'Terdapat Teks' : 'Bersih (Bebas Teks Misspelled)'}
                      </span>
                    </div>

                    {/* Similarity */}
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Deteksi Duplikasi (Anti-Spam):</span>
                      <span className="text-emerald-400 font-semibold">
                        {asset.qualityCheck.similarityQC.highestSimilarityPct > 0 ? `${asset.qualityCheck.similarityQC.highestSimilarityPct}% Similar` : '100% Unik & Orisinil'}
                      </span>
                    </div>

                    {/* IP Risk */}
                    <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-300">Trademark &amp; Hak Cipta Artis:</span>
                      <span className="text-emerald-400 font-semibold">100% Bebas Pelanggaran Merek</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-slate-300 text-xs">
                  <strong className="text-emerald-400">Siap Submit:</strong> Aset ini mematuhi pedoman Adobe Stock Contributor &amp; Shutterstock Contributor Terms tanpa risiko penolakan alasan Intellectual Property atau Artificial Intelligence Quality Artifacts.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
