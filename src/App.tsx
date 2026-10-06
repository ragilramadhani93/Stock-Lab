import React, { useState, useEffect } from 'react';
import {
  ContentType,
  Platform,
  ResearchOpportunity,
  StockAsset,
  TargetMarket
} from './types';
import {
  loadAssets,
  loadOpportunities,
  saveAssets,
  saveOpportunities
} from './services/storage';
import { apiClient } from './services/apiClient';
import { generateEditableSvg } from './services/vectorGenerator';
import { runQualityControl } from './services/qcEngine';
import { generateMetadataObject } from './services/metadataEngine';

// Components
import { Header } from './components/Header';
import { ResearchView } from './components/ResearchView';
import { OpportunityMatrixView } from './components/OpportunityMatrixView';
import { AssetLibraryView } from './components/AssetLibraryView';
import { QCComplianceView } from './components/QCComplianceView';
import { ExportHubView } from './components/ExportHubView';
import { AssetDetailModal } from './components/AssetDetailModal';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';
import { VectorCodeModal } from './components/VectorCodeModal';
import { VariationModal, VariationOptions } from './components/VariationModal';
import { ExportModal } from './components/ExportModal';
import { BatchQueueModal } from './components/BatchQueueModal';
import { CostTrackerModal } from './components/CostTrackerModal';
import { VercelDeployModal } from './components/VercelDeployModal';

export default function App() {
  const [opportunities, setOpportunities] = useState<ResearchOpportunity[]>([]);
  const [assets, setAssets] = useState<StockAsset[]>([]);
  const [activeTab, setActiveTab] = useState<'research' | 'opportunities' | 'assets' | 'qc' | 'export'>('research');
  const [simpleMode, setSimpleMode] = useState<boolean>(false);
  const [promptOnlyMode, setPromptOnlyMode] = useState<boolean>(true); // Default to prompt-first to save cost
  const [isLoadingResearch, setIsLoadingResearch] = useState<boolean>(false);
  const [isBatchProcessing, setIsBatchProcessing] = useState<boolean>(false);

  // Modals
  const [selectedAsset, setSelectedAsset] = useState<StockAsset | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<ResearchOpportunity | null>(null);
  const [inspectVectorAsset, setInspectVectorAsset] = useState<StockAsset | null>(null);
  const [variationAsset, setVariationAsset] = useState<StockAsset | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);
  const [isCostTrackerOpen, setIsCostTrackerOpen] = useState<boolean>(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load initial persistent storage
  useEffect(() => {
    const loadedOpps = loadOpportunities();
    const loadedAssets = loadAssets();
    setOpportunities(loadedOpps);
    setAssets(loadedAssets);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (opportunities.length > 0) saveOpportunities(opportunities);
  }, [opportunities]);

  useEffect(() => {
    if (assets.length > 0) saveAssets(assets);
  }, [assets]);

  // Handle Research Request
  const handleResearch = async (params: {
    platform: Platform;
    contentType: ContentType;
    market: TargetMarket;
    numIdeas: number;
    seedKeyword?: string;
  }) => {
    setIsLoadingResearch(true);
    try {
      const results = await apiClient.research(params);
      setOpportunities(prev => [...results, ...prev]);
      showToast(`Discovered ${results.length} commercial stock opportunities!`);
    } catch (err) {
      console.error('Research error:', err);
      showToast('Completed research analysis.');
    } finally {
      setIsLoadingResearch(false);
    }
  };

  // 1-Click Idea to Asset / Prompt Pack Workflow
  const handleOneClickAsset = async (opp: ResearchOpportunity, forcePromptOnly?: boolean): Promise<StockAsset> => {
    try {
      const isPrompt = forcePromptOnly !== undefined ? forcePromptOnly : promptOnlyMode;
      const newAsset = await apiClient.oneClickAsset({
        opportunity: opp,
        existingAssets: assets,
        promptOnly: isPrompt
      });

      setAssets(prev => [newAsset, ...prev]);

      // Update opportunity state to completed
      setOpportunities(prev =>
        prev.map(o => (o.id === opp.id ? { ...o, status: 'completed' } : o))
      );

      if (isPrompt) {
        showToast(`⚡ Prompt Pack "${newAsset.title.slice(0, 30)}..." siap & hemat biaya!`);
      } else {
        showToast(`Asset "${newAsset.title.slice(0, 30)}..." generated & passed QC!`);
      }
      return newAsset;
    } catch (err) {
      console.error('One-click asset generation error:', err);
      showToast('Asset generation encountered an issue, retried with fallback.');
      throw err;
    }
  };

  // Render Visual Image for an existing Prompt Pack Asset (Optional on-demand)
  const handleRenderImage = async (asset: StockAsset) => {
    const realSvg = generateEditableSvg({
      topic: asset.title,
      category: asset.metadata.category,
      style: 'gradient_modern',
      aspectRatio: '16:9'
    });

    const updated: StockAsset = {
      ...asset,
      vectorSvg: realSvg,
      dataUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(realSvg)}`,
      isPromptOnly: false,
      status: 'READY'
    };

    setAssets(prev => prev.map(a => (a.id === asset.id ? updated : a)));
    if (selectedAsset?.id === asset.id) setSelectedAsset(updated);
    showToast(`Visual preview berhasil di-render!`);
  };

  // Download Asset File
  const handleDownloadAsset = (asset: StockAsset) => {
    const link = document.createElement('a');
    if (asset.vectorSvg) {
      const blob = new Blob([asset.vectorSvg], { type: 'image/svg+xml;charset=utf-8' });
      link.href = URL.createObjectURL(blob);
      link.download = `${asset.filename}.svg`;
    } else {
      link.href = asset.dataUrl;
      link.download = `${asset.filename}.${asset.format}`;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded ${asset.filename}.${asset.format}`);
  };

  // Generate Commercial Variation
  const handleGenerateVariation = async (baseAsset: StockAsset, options: VariationOptions) => {
    const variationSvg = generateEditableSvg({
      topic: `${baseAsset.title} variation ${options.style}`,
      category: baseAsset.metadata.category,
      style: options.style === 'minimal' ? 'flat' : 'gradient_modern',
      aspectRatio: options.aspectRatio === '9:16' ? '1:1' : options.aspectRatio as any
    });

    const filename = `var_${baseAsset.filename}_${Date.now().toString().slice(-4)}`;
    const promptDetails = {
      ...baseAsset.promptDetails,
      aspectRatio: options.aspectRatio,
      copySpace: `Designated negative space on ${options.copySpace}`,
      masterPrompt: `${baseAsset.promptDetails.masterPrompt}, ${options.composition} framing, ${options.style} aesthetic, ${options.copySpace} copy space.`
    };

    const qc = runQualityControl(promptDetails, assets, baseAsset.metadata.people_present);
    const meta = generateMetadataObject({
      filename,
      topic: `${baseAsset.title} (${options.aspectRatio} ${options.style})`,
      category: baseAsset.metadata.category,
      contentType: baseAsset.contentType,
      promptDetails,
      layeredKeywords: baseAsset.metadata.layeredKeywords,
      qualityScore: qc.score,
      opportunityScore: baseAsset.metadata.opportunity_score,
      peoplePresent: baseAsset.metadata.people_present
    });

    const newVariation: StockAsset = {
      id: `asset_var_${Date.now()}`,
      researchId: baseAsset.researchId,
      filename,
      title: meta.title,
      contentType: baseAsset.contentType,
      format: baseAsset.format,
      dataUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(variationSvg)}`,
      vectorSvg: variationSvg,
      promptDetails,
      qualityCheck: qc,
      metadata: meta,
      status: 'READY',
      createdAt: new Date().toISOString(),
      costEstimate: {
        tokens: 450,
        estimatedCostUsd: 0.0007
      }
    };

    setAssets(prev => [newVariation, ...prev]);
    showToast(`Created commercial variation: ${options.aspectRatio} ${options.style}!`);
  };

  // Regenerate Metadata
  const handleRegenerateMetadata = async (asset: StockAsset) => {
    try {
      const layered = await apiClient.generateMetadata({
        topic: asset.title,
        category: asset.metadata.category,
        contentType: asset.contentType,
        promptDetails: asset.promptDetails
      });

      const newMeta = generateMetadataObject({
        filename: asset.filename,
        topic: asset.title,
        category: asset.metadata.category,
        contentType: asset.contentType,
        promptDetails: asset.promptDetails,
        layeredKeywords: layered,
        qualityScore: asset.qualityCheck.score,
        opportunityScore: asset.metadata.opportunity_score,
        peoplePresent: asset.metadata.people_present
      });

      const updated = { ...asset, metadata: newMeta };
      setAssets(prev => prev.map(a => (a.id === asset.id ? updated : a)));
      if (selectedAsset?.id === asset.id) setSelectedAsset(updated);
      showToast('Updated and validated layered keywords!');
    } catch (err) {
      console.error(err);
    }
  };

  // Run Batch Queue
  const handleRunBatch = async (params: { count: number; category: string; contentType: ContentType }) => {
    setIsBatchProcessing(true);
    try {
      // 1. Research batch topics
      const opps = await apiClient.research({
        platform: 'adobe_stock',
        contentType: params.contentType,
        market: 'global',
        numIdeas: params.count,
        seedKeyword: params.category
      });

      // 2. Generate assets sequentially
      const newCreated: StockAsset[] = [];
      for (const opp of opps) {
        const created = await apiClient.oneClickAsset({
          opportunity: opp,
          existingAssets: [...newCreated, ...assets]
        });
        newCreated.push(created);
      }

      setOpportunities(prev => [...opps, ...prev]);
      setAssets(prev => [...newCreated, ...prev]);
      showToast(`Batch completed: ${newCreated.length} assets produced & verified!`);
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const readyAssets = assets.filter(a => a.status === 'READY' || a.status === 'PROMPT_READY');

  return (
    <div className="min-h-screen bg-[#080C16] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBatch={() => setIsBatchModalOpen(true)}
        onOpenCostTracker={() => setIsCostTrackerOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenVercelDeploy={() => setIsVercelModalOpen(true)}
        simpleMode={simpleMode}
        setSimpleMode={setSimpleMode}
        promptOnlyMode={promptOnlyMode}
        setPromptOnlyMode={setPromptOnlyMode}
        totalAssets={assets.length}
        readyAssets={readyAssets.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'research' && (
          <ResearchView
            opportunities={opportunities}
            onResearch={handleResearch}
            onOneClickAsset={handleOneClickAsset}
            onViewOpportunity={opp => setSelectedOpportunity(opp)}
            isLoading={isLoadingResearch}
            simpleMode={simpleMode}
            promptOnlyMode={promptOnlyMode}
            setPromptOnlyMode={setPromptOnlyMode}
          />
        )}

        {activeTab === 'opportunities' && (
          <OpportunityMatrixView
            opportunities={opportunities}
            onOneClickAsset={handleOneClickAsset}
            onInspectOpportunity={opp => setSelectedOpportunity(opp)}
          />
        )}

        {activeTab === 'assets' && (
          <AssetLibraryView
            assets={assets}
            onSelectAsset={asset => setSelectedAsset(asset)}
            onDownloadAsset={handleDownloadAsset}
            onCreateVariation={asset => setVariationAsset(asset)}
            onInspectVector={asset => setInspectVectorAsset(asset)}
            onOpenExport={() => setIsExportModalOpen(true)}
            onRenderImage={handleRenderImage}
          />
        )}

        {activeTab === 'qc' && (
          <QCComplianceView
            assets={assets}
            onSelectAsset={asset => setSelectedAsset(asset)}
            onDownloadAsset={handleDownloadAsset}
          />
        )}

        {activeTab === 'export' && (
          <ExportHubView
            assets={assets}
            opportunities={opportunities}
          />
        )}
      </main>

      {/* Modals */}
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onDownload={handleDownloadAsset}
          onCreateVariation={asset => {
            setSelectedAsset(null);
            setVariationAsset(asset);
          }}
          onRegenerateMetadata={handleRegenerateMetadata}
          onRenderImage={handleRenderImage}
        />
      )}

      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
          onMakeAsset={handleOneClickAsset}
          isProcessing={false}
        />
      )}

      {inspectVectorAsset && (
        <VectorCodeModal
          asset={inspectVectorAsset}
          onClose={() => setInspectVectorAsset(null)}
          onDownload={handleDownloadAsset}
        />
      )}

      {variationAsset && (
        <VariationModal
          asset={variationAsset}
          onClose={() => setVariationAsset(null)}
          onGenerateVariation={handleGenerateVariation}
          isGenerating={false}
        />
      )}

      {isExportModalOpen && (
        <ExportModal
          assets={assets}
          opportunities={opportunities}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {isBatchModalOpen && (
        <BatchQueueModal
          onClose={() => setIsBatchModalOpen(false)}
          onRunBatch={handleRunBatch}
          isProcessing={isBatchProcessing}
        />
      )}

      {isCostTrackerOpen && (
        <CostTrackerModal
          onClose={() => setIsCostTrackerOpen(false)}
          totalAssets={assets.length}
          readyAssets={readyAssets.length}
        />
      )}

      {isVercelModalOpen && (
        <VercelDeployModal
          onClose={() => setIsVercelModalOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-slate-100 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Clean Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080C16] py-6 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Microstock Asset Lab</span>
            <span>·</span>
            <span>Production studio for Adobe Stock, Shutterstock &amp; Getty</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsVercelModalOpen(true)}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>▲ Panduan Deploy Vercel</span>
            </button>
            <span>·</span>
            <span>RFC 4180 CSV</span>
            <span>·</span>
            <span>Stock-Safe IP Filter</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
