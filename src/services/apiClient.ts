import {
  ContentType,
  LayeredKeywords,
  MarketGap,
  Platform,
  PromptDetails,
  ResearchOpportunity,
  StockAsset,
  TargetMarket
} from '../types';
import {
  handleGenerateMetadata,
  handleGeneratePrompt,
  handleOneClickAsset,
  handleResearch
} from '../server/geminiBackend';

/**
 * Universal client API service with direct server route support and fallback
 */
export const apiClient = {
  async research(params: {
    platform: Platform;
    contentType: ContentType;
    market: TargetMarket;
    numIdeas: number;
    seedKeyword?: string;
  }): Promise<ResearchOpportunity[]> {
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to local server handler
    }
    return await handleResearch(params);
  },

  async generatePrompt(params: {
    topic: string;
    contentType: ContentType;
    marketGap: MarketGap;
    aspectRatio: '1:1' | '16:9' | '4:3' | '3:4' | '9:16';
    platform: Platform;
  }): Promise<PromptDetails> {
    try {
      const res = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return await handleGeneratePrompt(params);
  },

  async generateMetadata(params: {
    topic: string;
    category: string;
    contentType: ContentType;
    promptDetails: PromptDetails;
  }): Promise<LayeredKeywords> {
    try {
      const res = await fetch('/api/generate-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return await handleGenerateMetadata(params);
  },

  async oneClickAsset(params: {
    opportunity: ResearchOpportunity;
    existingAssets?: StockAsset[];
    promptOnly?: boolean;
  }): Promise<StockAsset> {
    try {
      const res = await fetch('/api/one-click-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return await handleOneClickAsset(params);
  }
};
