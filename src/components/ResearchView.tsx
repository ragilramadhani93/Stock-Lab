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
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Zap,
  Globe2,
  Sliders,
  AlertCircle
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
  simpleMode,
  promptOnlyMode,
  setPromptOnlyMode
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
      {/* Top Banner & Strategy Kicker */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 md:p-8 backdrop-blur-sm">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <Zap className="w-4 h-4" />
            <span>COMMERCIAL MICROSTOCK OPPORTUNITY ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Discover High-Demand Stock Assets Before Producing Them
          </h1>
          <p className="text-sm text-neutral-400 leading-relaxed">
            Eliminate low-selling generic stock. Microstock Asset Lab evaluates 7 core commercial metrics,
            identifies market gaps, plans designated negative copy space, and filters out trademark risks before generation.
          </p>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mt-6 pt-5 border-t border-neutral-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-500 font-medium">Trending Niches:</span>
          {[
            { label: 'Cybersecurity SOC HUD', query: 'cybersecurity dashboard', type: 'vector' as ContentType },
            { label: 'Renewable Smart Grid', query: 'clean energy transition', type: 'vector' as ContentType },
            { label: 'Fintech Diversity Analytics', query: 'financial technology analyst', type: 'photo' as ContentType },
            { label: 'Telehealth Diagnostics', query: 'telemedicine interface', type: 'vector' as ContentType },
            { label: 'Eco Packaging Mockup', query: 'sustainable packaging mockup', type: 'photo' as ContentType }
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSimpleFastTrack(preset.query, preset.type)}
              className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Research Configuration Form */}
      <form onSubmit={handleStartResearch} className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-neutral-200">
              {simpleMode ? 'Quick Opportunity Search' : 'Professional Market Scanner'}
            </h2>
          </div>
          <span className="text-xs text-neutral-500">
            Grounded in public demand & commercial utility signals
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Target Platform */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-400">Target Platform</label>
            <select
              value={platform}
              onChange={e => setPlatform(e.target.value as Platform)}
              className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="adobe_stock">Adobe Stock (Max 70 chars title)</option>
              <option value="shutterstock">Shutterstock (Descriptive sentence)</option>
              <option value="istock">iStock / Getty Images</option>
              <option value="generic">Universal Master CSV</option>
            </select>
          </div>

          {/* Content Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-400">Asset Type</label>
            <select
              value={contentType}
              onChange={e => setContentType(e.target.value as ContentType)}
              className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="vector">Vector Graphic (Editable SVG paths)</option>
              <option value="photo">Commercial Stock Photo</option>
              <option value="illustration">Digital Flat Illustration</option>
              <option value="icon">Icon Set / Symbol Vector</option>
              <option value="background">Background / Abstract Texture</option>
              <option value="3d_style">3D-Style Render Concept</option>
              <option value="business">Business Concept</option>
              <option value="tech">Technology & AI</option>
              <option value="finance">Finance & Banking</option>
              <option value="healthcare">Healthcare & Medicine</option>
              <option value="lifestyle">Lifestyle & Workplace</option>
            </select>
          </div>

          {/* Target Market */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-400">Target Geography</label>
            <select
              value={market}
              onChange={e => setMarket(e.target.value as TargetMarket)}
              className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
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
            <label className="text-xs font-medium text-neutral-400">Seed Keyword (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Remote work cybersecurity"
              value={seedKeyword}
              onChange={e => setSeedKeyword(e.target.value)}
              className="w-full text-xs rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Number of ideas & Search Button */}
          <div className="space-y-1.5 flex flex-col justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-semibold shadow-sm transition-colors disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scanning Market...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Research Opportunities</span>
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
            <h2 className="text-base font-semibold text-white">
              Commercial Opportunities ({opportunities.length})
            </h2>
            <span className="text-xs text-neutral-400">
              Ranked by 7-Factor Weighted Score
            </span>
          </div>
          <span className="text-xs text-neutral-500">
            Real search signals + AI gap detection
          </span>
        </div>

        {opportunities.length === 0 ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-12 text-center space-y-3">
            <Search className="w-8 h-8 text-neutral-600 mx-auto" />
            <h3 className="text-sm font-semibold text-neutral-300">No Opportunities Researched Yet</h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Select your parameters and click &ldquo;Research Opportunities&rdquo; to analyze current search demand,
              market gaps, and commercial stock viability.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {opportunities.map((opp) => {
              const isWorking = processingId === opp.id;
              return (
                <div
                  key={opp.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4 hover:border-neutral-700 transition-colors"
                >
                  {/* Top Bar: Topic title, Platform badge, Trend type */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                        <span className="font-semibold text-indigo-400 uppercase tracking-wider">{opp.contentType}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{opp.platform.replace('_', ' ')}</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{opp.market.replace('_', ' ')} Market</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize text-emerald-400">{opp.trendType} Trend</span>
                      </div>
                      <h3 className="text-base font-semibold text-white leading-snug">
                        {opp.topic}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {/* One Click Make Asset / Generate Prompt Button */}
                      <button
                        onClick={() => handleMakeAsset(opp, promptOnlyMode)}
                        disabled={isWorking}
                        className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50 ${
                          promptOnlyMode
                            ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                        title={promptOnlyMode ? "Hasilkan Prompt & Metadata lengkap ($0 Biaya Gambar)" : "Hasilkan Gambar Lengkap dengan Metadata"}
                      >
                        {isWorking ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>{promptOnlyMode ? 'Menyusun Prompt...' : 'Building Asset...'}</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            <span>{promptOnlyMode ? 'BUAT PROMPT & METADATA' : 'MAKE THIS ASSET'}</span>
                          </>
                        )}
                      </button>

                      {/* Optional direct button to generate image if in prompt mode */}
                      {promptOnlyMode && (
                        <button
                          onClick={() => handleMakeAsset(opp, false)}
                          disabled={isWorking}
                          className="px-2.5 py-2 text-xs font-medium rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                          title="Generate gambar langsung (dengan render)"
                        >
                          Render Gambar
                        </button>
                      )}

                      <button
                        onClick={() => onViewOpportunity(opp)}
                        className="px-3 py-2 text-xs font-medium rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors"
                      >
                        Inspect Gap
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
                    <div className="lg:col-span-7 rounded-xl border border-neutral-800 bg-neutral-950/40 p-4 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                          Market Gap & Commercial Utility Strategy
                        </span>
                        <span className="text-[11px] text-neutral-500 font-mono">
                          Copy Space: <strong className="text-neutral-300 capitalize">{opp.marketGap.recommendedCopySpace}</strong>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {/* Overrepresented vs Missing */}
                        <div className="p-2.5 rounded-lg border border-neutral-800/80 bg-neutral-900/50 space-y-1">
                          <span className="text-neutral-500 font-medium block">Overrepresented in Stock:</span>
                          <p className="text-neutral-300 text-[11px] leading-relaxed line-through text-neutral-400">
                            {opp.marketGap.overrepresented}
                          </p>
                        </div>

                        <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 space-y-1">
                          <span className="text-emerald-400 font-medium block">Missing Angle (High Buyer Intent):</span>
                          <p className="text-neutral-200 text-[11px] leading-relaxed">
                            {opp.marketGap.missingAngle}
                          </p>
                        </div>
                      </div>

                      {/* Recommended Differentiation */}
                      <div className="text-xs space-y-1">
                        <span className="text-neutral-400 font-medium">Recommended Differentiation:</span>
                        <p className="text-neutral-300 text-[11px] leading-relaxed">
                          {opp.marketGap.recommendedDifferentiation}
                        </p>
                      </div>

                      {/* Buyer Use Cases & Keywords */}
                      <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-400">
                        <div className="flex items-center gap-1.5">
                          <span>Primary Use Cases:</span>
                          <span className="text-neutral-300">{opp.buyerUseCases.slice(0, 2).join(' · ')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>Clusters:</span>
                          <span className="text-indigo-300">{opp.keywordClusters.slice(0, 3).join(', ')}</span>
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
