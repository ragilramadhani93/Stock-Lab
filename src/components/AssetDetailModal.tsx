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
  Zap
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
  const [activePlatformTab, setActivePlatformTab] = useState<'prompt_pack' | 'adobe' | 'shutterstock' | 'layered' | 'svg'>('prompt_pack');
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

  // Default generator syntaxes fallback if not pre-populated
  const arParam = asset.promptDetails.aspectRatio.replace(':', ':');
  const mjSyntax = asset.generatorParams?.midjourney ||
    `/imagine prompt: ${asset.promptDetails.masterPrompt} --ar ${arParam} --v 6.1 --style raw --stylize 100 --no ${asset.promptDetails.negativePrompt}`;
  const fluxSyntax = asset.generatorParams?.flux ||
    `${asset.promptDetails.masterPrompt} [negative: ${asset.promptDetails.negativePrompt}]`;
  const sdSyntax = asset.generatorParams?.stableDiffusion ||
    `${asset.promptDetails.masterPrompt}\nNegative prompt: ${asset.promptDetails.negativePrompt}\nSteps: 30, Sampler: DPM++ 2M Karras, CFG scale: 7`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden my-8">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/50">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-neutral-400 font-semibold">{asset.filename}.{asset.format}</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {asset.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownload(asset)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .{asset.format.toUpperCase()}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
          {/* Left Column: Asset Preview (6 cols) */}
          <div className="lg:col-span-6 p-6 border-b lg:border-b-0 lg:border-r border-neutral-800 flex flex-col justify-between space-y-4 bg-neutral-950/40">
            <div className="space-y-3">
              <div className="relative aspect-video w-full rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden flex items-center justify-center shadow-inner">
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
                  <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-indigo-500/30 m-3 rounded-lg flex items-end justify-start p-2">
                    <span className="text-[10px] font-mono text-indigo-300 bg-neutral-950/90 px-2 py-0.5 rounded border border-indigo-500/40">
                      Copy Space: {asset.promptDetails.copySpace}
                    </span>
                  </div>
                )}
              </div>

              {/* View Control Buttons */}
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <button
                  onClick={() => setShowCopySpaceGuide(!showCopySpaceGuide)}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{showCopySpaceGuide ? 'Hide Copy Space Box' : 'Show Copy Space Box'}</span>
                </button>

                <div className="flex items-center gap-3">
                  <span>Aspect: <strong>{asset.promptDetails.aspectRatio}</strong></span>
                  <span>Format: <strong className="uppercase">{asset.format}</strong></span>
                </div>
              </div>
            </div>

            {/* Prompt & Technical Specifications */}
            <div className="space-y-3 pt-3 border-t border-neutral-800/80 text-xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="font-semibold text-neutral-300">Master Prompt</span>
                  <button
                    onClick={() => handleCopy(asset.promptDetails.masterPrompt, 'prompt')}
                    className="text-neutral-400 hover:text-indigo-400 flex items-center gap-1"
                  >
                    {copiedKey === 'prompt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'prompt' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-neutral-300 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/80 leading-relaxed font-mono text-[11px]">
                  {asset.promptDetails.masterPrompt}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-neutral-400 block">Negative Prompt (Stock-Safe Protection)</span>
                <p className="text-neutral-500 bg-neutral-950 p-2 rounded-lg border border-neutral-800/80 text-[11px] font-mono leading-relaxed">
                  {asset.promptDetails.negativePrompt}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Metadata & QC Suite (6 cols) */}
          <div className="lg:col-span-6 p-6 space-y-6">
            {/* Full QC Inspection Report Card */}
            <QCReportBadge qc={asset.qualityCheck} showDetails={true} />

            {/* Platform Metadata Converter Tabs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
                  <button
                    onClick={() => setActivePlatformTab('prompt_pack')}
                    className={`px-3 py-1 rounded font-medium transition-colors ${
                      activePlatformTab === 'prompt_pack'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    ⚡ Prompt Pack
                  </button>
                  <button
                    onClick={() => setActivePlatformTab('adobe')}
                    className={`px-3 py-1 rounded font-medium transition-colors ${
                      activePlatformTab === 'adobe'
                        ? 'bg-neutral-800 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Adobe Stock
                  </button>
                  <button
                    onClick={() => setActivePlatformTab('shutterstock')}
                    className={`px-3 py-1 rounded font-medium transition-colors ${
                      activePlatformTab === 'shutterstock'
                        ? 'bg-neutral-800 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Shutterstock
                  </button>
                  <button
                    onClick={() => setActivePlatformTab('layered')}
                    className={`px-3 py-1 rounded font-medium transition-colors ${
                      activePlatformTab === 'layered'
                        ? 'bg-neutral-800 text-white shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    Keywords
                  </button>
                </div>

                <button
                  onClick={() => onRegenerateMetadata(asset)}
                  className="text-xs text-neutral-400 hover:text-indigo-400 flex items-center gap-1"
                  title="Regenerate Layered Metadata with AI"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>
              </div>

              {/* Prompt Pack Tab Content (Copy syntax for Midjourney, Flux, SD) */}
              {activePlatformTab === 'prompt_pack' && (
                <div className="space-y-3 text-xs">
                  {/* Midjourney Command */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                        <span>Midjourney v6.1 Command</span>
                      </span>
                      <button
                        onClick={() => handleCopy(mjSyntax, 'mj')}
                        className="text-neutral-400 hover:text-indigo-400 flex items-center gap-1"
                      >
                        {copiedKey === 'mj' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'mj' ? 'Copied' : 'Salin Midjourney'}</span>
                      </button>
                    </div>
                    <pre className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 font-mono text-[11px] text-neutral-200 whitespace-pre-wrap leading-relaxed select-all">
                      {mjSyntax}
                    </pre>
                  </div>

                  {/* Flux.1 Prompt */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span className="font-semibold text-cyan-300">Flux.1 [dev / schnell] Prompt</span>
                      <button
                        onClick={() => handleCopy(fluxSyntax, 'flux')}
                        className="text-neutral-400 hover:text-cyan-400 flex items-center gap-1"
                      >
                        {copiedKey === 'flux' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'flux' ? 'Copied' : 'Salin Flux'}</span>
                      </button>
                    </div>
                    <pre className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 font-mono text-[11px] text-neutral-300 whitespace-pre-wrap leading-relaxed select-all">
                      {fluxSyntax}
                    </pre>
                  </div>

                  {/* Stable Diffusion / ComfyUI */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span className="font-semibold text-emerald-300">Stable Diffusion / Local GPU</span>
                      <button
                        onClick={() => handleCopy(sdSyntax, 'sd')}
                        className="text-neutral-400 hover:text-emerald-400 flex items-center gap-1"
                      >
                        {copiedKey === 'sd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'sd' ? 'Copied' : 'Salin SD'}</span>
                      </button>
                    </div>
                    <pre className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 font-mono text-[11px] text-neutral-300 whitespace-pre-wrap leading-relaxed select-all max-h-24 overflow-y-auto">
                      {sdSyntax}
                    </pre>
                  </div>
                </div>
              )}

              {/* Adobe Stock Tab Content */}
              {activePlatformTab === 'adobe' && (
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span className="font-semibold text-neutral-300">
                        Adobe Title <span className="font-mono text-neutral-500">({adobeData.title.length}/70 chars)</span>
                      </span>
                      <button
                        onClick={() => handleCopy(adobeData.title, 'adobe_title')}
                        className="text-neutral-400 hover:text-indigo-400 flex items-center gap-1"
                      >
                        {copiedKey === 'adobe_title' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'adobe_title' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 font-medium text-neutral-200">
                      {adobeData.title}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 space-y-0.5">
                      <span className="text-neutral-500 block">Category</span>
                      <span className="font-semibold text-neutral-200">{adobeData.category}</span>
                    </div>
                    <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 space-y-0.5">
                      <span className="text-neutral-500 block">Generative AI Flag</span>
                      <span className="font-semibold text-emerald-400">{adobeData.aiGenerated}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span className="font-semibold text-neutral-300">
                        Adobe Keywords <span className="font-mono text-neutral-500">({asset.metadata.keywords.length} total · Top 10 critical)</span>
                      </span>
                      <button
                        onClick={() => handleCopy(adobeData.keywords, 'adobe_kw')}
                        className="text-neutral-400 hover:text-indigo-400 flex items-center gap-1"
                      >
                        {copiedKey === 'adobe_kw' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'adobe_kw' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                      {asset.metadata.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded text-[11px] ${
                            i < 10
                              ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-medium'
                              : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                          }`}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Shutterstock Tab Content */}
              {activePlatformTab === 'shutterstock' && (
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span className="font-semibold text-neutral-300">Shutterstock Description Sentence</span>
                      <button
                        onClick={() => handleCopy(shutterData.description, 'shutter_desc')}
                        className="text-neutral-400 hover:text-indigo-400 flex items-center gap-1"
                      >
                        {copiedKey === 'shutter_desc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'shutter_desc' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 text-neutral-200 leading-relaxed">
                      {shutterData.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 space-y-0.5">
                      <span className="text-neutral-500 block">Primary Category</span>
                      <span className="font-semibold text-neutral-200">{shutterData.category}</span>
                    </div>
                    <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 space-y-0.5">
                      <span className="text-neutral-500 block">Illustration / Vector</span>
                      <span className="font-semibold text-indigo-400">{shutterData.illustration}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span className="font-semibold text-neutral-300">
                        Shutterstock Keywords <span className="font-mono text-neutral-500">({asset.metadata.keywords.length}/50)</span>
                      </span>
                      <button
                        onClick={() => handleCopy(shutterData.keywords, 'shutter_kw')}
                        className="text-neutral-400 hover:text-indigo-400 flex items-center gap-1"
                      >
                        {copiedKey === 'shutter_kw' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'shutter_kw' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                      {asset.metadata.keywords.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[11px] bg-neutral-900 text-neutral-300 border border-neutral-800">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Layered Keywords Tab Content */}
              {activePlatformTab === 'layered' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span className="font-semibold text-neutral-300">5-Layer Search Intent Breakdown</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      Validation Score: {asset.metadata.keyword_quality_score}/100
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { layer: 'Primary (Literal Content)', words: asset.metadata.layeredKeywords.primary, color: 'text-indigo-400' },
                      { layer: 'Secondary (Environment & Objects)', words: asset.metadata.layeredKeywords.secondary, color: 'text-cyan-400' },
                      { layer: 'Intent (Buyer Search Intent)', words: asset.metadata.layeredKeywords.intent, color: 'text-emerald-400' },
                      { layer: 'Concept (Business Meaning)', words: asset.metadata.layeredKeywords.concept, color: 'text-amber-400' },
                      { layer: 'Usage (Commercial Utility)', words: asset.metadata.layeredKeywords.usage, color: 'text-purple-400' }
                    ].map((row, idx) => (
                      <div key={idx} className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800 space-y-1">
                        <span className={`text-[11px] font-semibold ${row.color}`}>{row.layer}</span>
                        <div className="flex flex-wrap gap-1">
                          {row.words.map((w, wi) => (
                            <span key={wi} className="px-1.5 py-0.5 rounded text-[11px] bg-neutral-900 text-neutral-300 border border-neutral-800">
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SVG Code Inspector Tab */}
              {activePlatformTab === 'svg' && asset.vectorSvg && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span className="font-semibold text-neutral-300">Scalable Vector Code (No embedded PNGs)</span>
                    <button
                      onClick={() => handleCopy(asset.vectorSvg!, 'svg_code')}
                      className="text-neutral-400 hover:text-indigo-400 flex items-center gap-1"
                    >
                      {copiedKey === 'svg_code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'svg_code' ? 'Copied SVG' : 'Copy Raw SVG'}</span>
                    </button>
                  </div>
                  <pre className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 font-mono text-[11px] text-neutral-300 max-h-48 overflow-y-auto leading-relaxed">
                    {asset.vectorSvg}
                  </pre>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onCreateVariation(asset)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-950 hover:bg-neutral-800 text-neutral-200 text-xs font-medium transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Create Variations</span>
                </button>

                {asset.isPromptOnly && onRenderImage && (
                  <button
                    onClick={handleRender}
                    disabled={isRendering}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-indigo-500/30 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 text-xs font-semibold transition-colors disabled:opacity-50"
                    title="Render gambar visual penuh (opsional)"
                  >
                    {isRendering ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        <span>Rendering...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Render Gambar</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <button
                onClick={() => onDownload(asset)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{asset.isPromptOnly ? 'Download Prompt Dossier (.SVG)' : 'Download Asset'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
