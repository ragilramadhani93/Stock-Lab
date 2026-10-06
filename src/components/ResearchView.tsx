import React, { useState } from 'react';
import {
  ContentType,
  Platform,
  ResearchOpportunity,
  StockAsset,
  TargetMarket
} from '../types';
import { OpportunityScoreCard } from './OpportunityScoreCard';
import {
  Sparkles,
  TrendingUp,
  Search,
  Zap,
  Sliders,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ImageIcon
} from 'lucide-react';

interface ResearchViewProps {
  opportunities: ResearchOpportunity[];
  onResearch: (params: {
    platform: Platform;
    contentType: ContentType;
    market: TargetMarket;
    numIdeas: number;
    seedKeyword?: string;
  }) => Promise<void>;
  onOneClickAsset: (opp: ResearchOpportunity, promptOnly?: boolean) => Promise<StockAsset>;
  onViewOpportunity: (opp: ResearchOpportunity) => void;
  isLoading: boolean;
  simpleMode: boolean;
  promptOnlyMode: boolean;
  setPromptOnlyMode: (val: boolean) => void;
}

export const ResearchView: React.FC<ResearchViewProps> = ({
  opportunities,
  onResearch,
  onOneClickAsset,
  onViewOpportunity,
  isLoading,
  promptOnlyMode
}) => {
  const [platform, setPlatform] = useState<Platform>('adobe_stock');
  const [contentType, setContentType] = useState<ContentType>('vector');
  const [market, setMarket] = useState<TargetMarket>('global');
  const [numIdeas, setNumIdeas] = useState<number>(5);
  const [seedKeyword, setSeedKeyword] = useState<string>('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleStartResearch = (e: React.FormEvent) => {
    e.preventDefault();
    onResearch({ platform, contentType, market, numIdeas, seedKeyword });
  };

  const handleSimpleFastTrack = (seed: string, type: ContentType = 'vector') => {
    setSeedKeyword(seed);
    setContentType(type);
    onResearch({
      platform: 'adobe_stock',
      contentType: type,
      market: 'global',
      numIdeas: 5,
      seedKeyword: seed
    });
  };

  const handleMakeAsset = async (opp: ResearchOpportunity, forcePromptOnly?: boolean) => {
    setProcessingId(opp.id);
    try {
      await onOneClickAsset(opp, forcePromptOnly !== undefined ? forcePromptOnly : promptOnlyMode);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner: Premium Studio Header */}
      <div className="relative rounded-3xl border border-slate-800/80 bg-gradient-to-b from-slate-900/90 via-[#0B101D] to-[#080C16] p-6 sm:p-8 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400">
            <Zap className="w-3.5 h-3.5" />
            <span>COMMERCIAL MICROSTOCK OPPORTUNITY LAB</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Riset Peluang Pasar &amp; Racik Prompt Siap Jual
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Temukan topik dengan permintaan tinggi, kompetisi rendah, dan celah pasar komersial. 
            Otomatis susun <strong className="text-white">Master Prompt</strong>, alokasi <strong className="text-indigo-300">Copy Space</strong> untuk pembeli iklan, serta metadata 5-lapis untuk Adobe Stock &amp; Shutterstock tanpa biaya token visual.
          </p>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="relative mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Rekomendasi Niche Berpeluang:</span>
          {[
            { label: 'Cybersecurity SOC HUD', query: 'cybersecurity dashboard', type: 'vector' as ContentType },
            { label: 'Clean Energy Smart Grid', query: 'clean energy transition', type: 'vector' as ContentType },
            { label: 'Fintech Diversity Analytics', query: 'financial technology analyst', type: 'photo' as ContentType },
            { label: 'Telehealth Diagnostics', query: 'telemedicine interface', type: 'vector' as ContentType },
            { label: 'Eco Packaging Mockup', query: 'sustainable packaging mockup', type: 'photo' as ContentType }
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSimpleFastTrack(preset.query, preset.type)}
              className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/90 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-slate-800 transition-all cursor-pointer shadow-sm active:scale-97"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Research Configuration Form */}
      <form onSubmit={handleStartResearch} className="rounded-2xl border border-slate-800/80 bg-[#0E1424]/80 p-5 sm:p-6 space-y-4 backdrop-blur-md shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">
              Parameter Scanner Peluang Pasar
            </h2>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Sinyal riil dari Google Trends &amp; Pola Pencarian Pembeli Stock</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Target Platform */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Platform</label>
            <select
              value={platform}
              onChange={e => setPlatform(e.target.value as Platform)}
              className="w-full text-xs font-medium rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="adobe_stock">Adobe Stock (Title ≤70 chars)</option>
              <option value="shutterstock">Shutterstock (Descriptive sentence)</option>
              <option value="istock">iStock / Getty Images</option>
              <option value="generic">Universal Master CSV</option>
            </select>
          </div>

          {/* Content Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Format Aset</label>
            <select
              value={contentType}
              onChange={e => setContentType(e.target.value as ContentType)}
              className="w-full text-xs font-medium rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="vector">Vector Graphic (Editable SVG paths)</option>
              <option value="photo">Commercial Stock Photo</option>
              <option value="illustration">Digital Flat Illustration</option>
              <option value="icon">Icon Set / Symbol Vector</option>
              <option value="background">Background / Abstract Texture</option>
              <option value="3d_style">3D-Style Render Concept</option>
              <option value="business">Business &amp; Finance</option>
              <option value="tech">Technology &amp; AI</option>
              <option value="healthcare">Healthcare &amp; Medicine</option>
              <option value="lifestyle">Modern Lifestyle &amp; Remote Work</option>
            </select>
          </div>

          {/* Target Market */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Target Geografi</label>
            <select
              value={market}
              onChange={e => setMarket(e.target.value as TargetMarket)}
              className="w-full text-xs font-medium rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="global">Global Worldwide</option>
              <option value="us">United States / North America</option>
              <option value="europe">Europe / EU ESG Focus</option>
              <option value="southeast_asia">Southeast Asia (ASEAN)</option>
              <option value="indonesia">Indonesia</option>
              <option value="japan">Japan</option>
            </select>
          </div>

          {/* Seed Keyword Input */}
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
            <label className="text-xs font-semibold text-slate-300">Kata Kunci / Topik (Opsional)</label>
            <input
              type="text"
              placeholder="e.g. Remote work, Fintech, AI"
              value={seedKeyword}
              onChange={e => setSeedKeyword(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Search Button */}
          <div className="space-y-1.5 flex flex-col justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-indigo-600/20 transition-all cursor-pointer disabled:opacity-60 active:scale-97"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scanning Peluang...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Riset Peluang Pasar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Discovered Opportunities List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">
              Peluang Pasar Siap Digarap ({opportunities.length})
            </h2>
            <span className="text-xs text-slate-400">
              Diurutkan berdasarkan skor 7-faktor komersial
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">
            Real search signals + AI gap detection
          </span>
        </div>

        {opportunities.length === 0 ? (
          <div className="rounded-2xl border border-slate-800/80 bg-[#0E1424]/60 p-12 text-center space-y-3">
            <Search className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">Belum Ada Peluang yang Diriset</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Tentukan parameter di atas dan klik &ldquo;Riset Peluang Pasar&rdquo; untuk menganalisis demand pencarian saat ini, celah kompetisi, dan topik berpotensi cuan tinggi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {opportunities.map((opp) => {
              const isWorking = processingId === opp.id;
              return (
                <div
                  key={opp.id}
                  className="rounded-2xl border border-slate-800/80 bg-[#0E1424]/90 p-5 sm:p-6 space-y-4 hover:border-slate-700/80 transition-all shadow-md backdrop-blur-sm"
                >
                  {/* Top Bar: Topic title, Platform badge, Trend type */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1">
                        <span className="font-bold text-indigo-400 uppercase tracking-wider">{opp.contentType}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="capitalize">{opp.platform.replace('_', ' ')}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="capitalize">{opp.market.replace('_', ' ')} Market</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="capitalize font-semibold text-emerald-400">{opp.trendType} Trend</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                        {opp.topic}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {opp.whyThisTopic}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {/* One Click Make Asset / Generate Prompt Button */}
                      <button
                        onClick={() => handleMakeAsset(opp, promptOnlyMode)}
                        disabled={isWorking}
                        className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 active:scale-97 ${
                          promptOnlyMode
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/20'
                            : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-indigo-600/20'
                        }`}
                        title={promptOnlyMode ? "Hasilkan Prompt & Metadata lengkap ($0 Biaya Token Gambar)" : "Hasilkan Gambar Lengkap dengan Metadata"}
                      >
                        {isWorking ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>{promptOnlyMode ? 'Menyusun Prompt...' : 'Memproses Aset...'}</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>{promptOnlyMode ? '⚡ BUAT PROMPT & METADATA' : 'PRODUKSI ASET'}</span>
                          </>
                        )}
                      </button>

                      {/* Optional direct button to generate image if in prompt mode */}
                      {promptOnlyMode && (
                        <button
                          onClick={() => handleMakeAsset(opp, false)}
                          disabled={isWorking}
                          className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer flex items-center gap-1"
                          title="Generate gambar visual langsung"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Visual</span>
                        </button>
                      )}

                      <button
                        onClick={() => onViewOpportunity(opp)}
                        className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
                      >
                        Detail Celah
                      </button>
                    </div>
                  </div>

                  {/* Body: Opportunity Score Card + Market Gap Analysis */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Score Card (5 cols) */}
                    <div className="lg:col-span-5">
                      <OpportunityScoreCard
                        score={opp.opportunityScore}
                        competitionScore={opp.competitionScore}
                        saturationRisk={opp.saturationRisk}
                        commercialPotential={opp.commercialPotential}
                        seasonalWindow={opp.seasonalWindow}
                      />
                    </div>

                    {/* Market Gap & Commercial Angle (7 cols) */}
                    <div className="lg:col-span-7 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                          Celah Pasar &amp; Strategi Kegunaan Komersial
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Copy Space: <strong className="text-indigo-300 capitalize">{opp.marketGap.recommendedCopySpace}</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {/* Overrepresented vs Missing */}
                        <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 space-y-1">
                          <span className="text-slate-400 font-semibold block text-[11px]">Sudah Terlalu Banyak (Jenuh):</span>
                          <p className="text-slate-400 text-xs leading-relaxed line-through">
                            {opp.marketGap.overrepresented}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                          <span className="text-emerald-400 font-semibold block text-[11px]">Celah Kosong (Diminati Pembeli):</span>
                          <p className="text-slate-200 text-xs leading-relaxed font-medium">
                            {opp.marketGap.missingAngle}
                          </p>
                        </div>
                      </div>

                      {/* Recommended Differentiation */}
                      <div className="text-xs space-y-1">
                        <span className="text-slate-400 font-semibold">Rekomendasi Diferensiasi:</span>
                        <p className="text-slate-200 text-xs leading-relaxed">
                          {opp.marketGap.recommendedDifferentiation}
                        </p>
                      </div>

                      {/* Buyer Use Cases & Keywords */}
                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-300">Target Buyer:</span>
                          <span className="text-slate-300">{opp.buyerUseCases.slice(0, 2).join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400">Keywords:</span>
                          <span className="font-mono text-indigo-300">+{opp.keywordClusters.length} kluster</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
