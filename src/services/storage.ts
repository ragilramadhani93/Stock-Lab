import { ResearchOpportunity, StockAsset } from '../types';
import { generateEditableSvg } from './vectorGenerator';
import { runQualityControl } from './qcEngine';
import { generateMetadataObject } from './metadataEngine';

const STORAGE_KEYS = {
  OPPORTUNITIES: 'microstock_opportunities_v1',
  ASSETS: 'microstock_assets_v1',
  SETTINGS: 'microstock_settings_v1'
};

export function loadOpportunities(): ResearchOpportunity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load opportunities from localStorage', err);
  }
  return getInitialOpportunities();
}

export function saveOpportunities(opps: ResearchOpportunity[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opps));
  } catch (err) {
    console.error('Failed to save opportunities', err);
  }
}

export function loadAssets(): StockAsset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSETS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load assets from localStorage', err);
  }
  return getInitialAssets();
}

export function saveAssets(assets: StockAsset[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  } catch (err) {
    console.error('Failed to save assets', err);
  }
}

function getInitialOpportunities(): ResearchOpportunity[] {
  return [
    {
      id: 'opp_init_1',
      topic: 'AI cybersecurity threat telemetry dashboard with blank marketing copy space',
      seedKeyword: 'cybersecurity',
      platform: 'adobe_stock',
      contentType: 'vector',
      market: 'global',
      opportunityScore: {
        demand: 92,
        commercialUsefulness: 96,
        keywordOpportunity: 88,
        trendMomentum: 94,
        evergreenPotential: 86,
        differentiationPotential: 84,
        productionEase: 90,
        total: 90
      },
      competitionScore: 42,
      saturationRisk: 'low',
      commercialPotential: 'high',
      trendType: 'emerging',
      seasonalWindow: 'All Year / Evergreen',
      recommendedAssetType: 'Vector / Editable Graphic',
      recommendedComposition: 'Modern dark glassmorphism dashboard with 40% copy space on left',
      marketGap: {
        overrepresented: 'Generic padlocks and green Matrix text streams',
        missingAngle: 'Realistic high-end SOC monitoring HUD with blank title card for branding',
        recommendedDifferentiation: 'Emphasize cloud network nodes and neutral copy space',
        recommendedCopySpace: 'left'
      },
      buyerUseCases: [
        'Fintech cloud security landing page hero',
        'Enterprise SaaS investor pitch deck',
        'Cybersecurity incident response whitepaper header'
      ],
      keywordClusters: ['cybersecurity', 'threat intelligence', 'cloud network', 'dashboard', 'fintech'],
      whyThisTopic: 'Continuous double-digit budget growth in enterprise security; software buyers lack clean, unbranded vector backdrops.',
      signalSources: [
        {
          name: 'Search Trend Query Index',
          type: 'real_public',
          signal: '+142% year-over-year search growth for "cyber security dashboard vector copy space".'
        },
        {
          name: 'Stock Platform Saturation Index',
          type: 'ai_estimated',
          signal: 'High buyer dissatisfaction with overused padlock graphics; unfulfilled demand for copy-space variants.'
        }
      ],
      status: 'completed',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'opp_init_2',
      topic: 'Clean energy transition grid and renewable battery storage concept',
      seedKeyword: 'sustainability',
      platform: 'adobe_stock',
      contentType: 'vector',
      market: 'europe',
      opportunityScore: {
        demand: 88,
        commercialUsefulness: 92,
        keywordOpportunity: 85,
        trendMomentum: 89,
        evergreenPotential: 94,
        differentiationPotential: 80,
        productionEase: 86,
        total: 88
      },
      competitionScore: 38,
      saturationRisk: 'low',
      commercialPotential: 'high',
      trendType: 'evergreen',
      seasonalWindow: 'Q2 - Q4 / ESG Season',
      recommendedAssetType: 'Vector Illustration',
      recommendedComposition: 'Clean vector landscape with high-tech storage batteries and open sky copy space',
      marketGap: {
        overrepresented: 'Literal human hand holding small green plant inside a glass bulb',
        missingAngle: 'Industrial scale utility battery storage vectors with clean geometric fidelity',
        recommendedDifferentiation: 'Focus on smart grid distribution infrastructure rather than generic leaves',
        recommendedCopySpace: 'right'
      },
      buyerUseCases: [
        'Corporate ESG sustainability annual report',
        'Renewable energy utility marketing',
        'Clean tech venture capital presentation'
      ],
      keywordClusters: ['renewable energy', 'battery storage', 'smart grid', 'esg report', 'clean technology'],
      whyThisTopic: 'Mandatory ESG disclosures in Europe and Americas drive high commercial purchase velocity for clean energy visuals.',
      signalSources: [
        {
          name: 'Corporate Annual Report Timeline',
          type: 'real_public',
          signal: 'Peak Q3-Q4 microstock purchasing cycle for corporate sustainability reports.'
        }
      ],
      status: 'discovered',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'opp_init_3',
      topic: 'Southeast Asian female financial analyst reviewing sustainability dashboard on tablet',
      seedKeyword: 'finance',
      platform: 'shutterstock',
      contentType: 'photo',
      market: 'southeast_asia',
      opportunityScore: {
        demand: 86,
        commercialUsefulness: 94,
        keywordOpportunity: 86,
        trendMomentum: 83,
        evergreenPotential: 88,
        differentiationPotential: 92,
        productionEase: 82,
        total: 87
      },
      competitionScore: 34,
      saturationRisk: 'low',
      commercialPotential: 'high',
      trendType: 'gap',
      seasonalWindow: 'All Year',
      recommendedAssetType: 'Commercial Stock Photo',
      recommendedComposition: 'Off-center subject in modern light-filled architectural office with left copy space',
      marketGap: {
        overrepresented: 'Generic staged Caucasian executives shaking hands across empty boardroom',
        missingAngle: 'Authentic Southeast Asian female financial professional working with real data tools',
        recommendedDifferentiation: 'Clean modern workspace with ample negative space for corporate ad headlines',
        recommendedCopySpace: 'left'
      },
      buyerUseCases: [
        'Multinational banking website banner',
        'Fintech mobile app onboarding hero',
        'ASEAN corporate leadership recruitment campaign'
      ],
      keywordClusters: ['businesswoman', 'financial analyst', 'southeast asia', 'modern office', 'fintech'],
      whyThisTopic: 'Global tech and banking brands specifically search for authentic regional diversity in Asia-Pacific markets.',
      signalSources: [
        {
          name: 'Regional Buyer Intent Telemetry',
          type: 'real_public',
          signal: '+88% increase in requests for Asian business leadership with copy space.'
        }
      ],
      status: 'discovered',
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
    }
  ];
}

function getInitialAssets(): StockAsset[] {
  // Generate asset 1: Cybersecurity vector
  const svg1 = generateEditableSvg({
    topic: 'AI cybersecurity threat telemetry dashboard',
    category: 'Technology',
    style: 'gradient_modern',
    aspectRatio: '16:9'
  });

  const promptDetails1 = {
    masterPrompt: 'High quality commercial stock vector illustration, AI cybersecurity threat telemetry dashboard with digital shield centerpiece and circuit traces. Clean modern dark slate background, neon cyan and indigo accents, 40% generous blank copy space on left for advertising text overlay. Crisp scalable geometric paths, no logos or trademarks.',
    negativePrompt: 'brand logo, trademark, text, watermark, signature, extra fingers, malformed hands, distorted facial features, duplicated limbs, unnatural anatomy, noisy, low contrast, oversaturated neon, cluttered frame',
    subject: 'AI cybersecurity threat dashboard and shield',
    cameraFraming: 'Widescreen 16:9, offset focal point leaving left 45% open for headlines',
    lighting: 'Soft digital neon glow with deep ambient contrast',
    background: 'Deep indigo and dark slate subtle vector grid',
    copySpace: '40% negative space on left side',
    commercialIntent: 'Fintech software landing pages, cybersecurity whitepapers, corporate security decks',
    aspectRatio: '16:9' as const
  };

  const qc1 = runQualityControl(promptDetails1, [], false);
  const meta1 = generateMetadataObject({
    filename: 'stock_vector_cyber_920141',
    topic: 'AI cybersecurity threat telemetry dashboard with copy space',
    category: 'Technology',
    contentType: 'vector',
    promptDetails: promptDetails1,
    layeredKeywords: {
      primary: ['cybersecurity', 'dashboard', 'shield', 'security', 'technology', 'network'],
      secondary: ['digital protection', 'data safety', 'encryption', 'telemetry', 'interface', 'circuit', 'dark theme'],
      intent: ['copy space', 'website hero', 'presentation slide', 'banner background', 'software header'],
      concept: ['privacy', 'defense', 'innovation', 'intelligence', 'risk management'],
      usage: ['fintech', 'enterprise saas', 'it consulting', 'cloud infrastructure', 'corporate marketing']
    },
    qualityScore: qc1.score,
    opportunityScore: 90,
    peoplePresent: false
  });

  // Generate asset 2: Financial growth vector
  const svg2 = generateEditableSvg({
    topic: 'Financial analytics growth curve and metrics board',
    category: 'Finance',
    style: 'gradient_modern',
    aspectRatio: '16:9'
  });

  const promptDetails2 = {
    masterPrompt: 'Commercial stock vector graphic, modern financial analytics dashboard with upward trend growth line and glassmorphism telemetry cards. Professional emerald green and cyan gradient palette on dark slate field, ample clean blank copy space on right for marketing headlines. Clean scalable vector paths.',
    negativePrompt: 'brand logo, trademark, text, watermark, signature, extra fingers, malformed hands, distorted facial features, duplicated limbs, unnatural anatomy, noisy, low contrast, oversaturated neon, cluttered frame',
    subject: 'Financial analytics dashboard with growth chart',
    cameraFraming: 'Widescreen 16:9, balanced chart positioning with right copy space',
    lighting: 'Clean high-contrast graphic lighting',
    background: 'Deep emerald and slate subtle grid backdrop',
    copySpace: '35% negative space on right',
    commercialIntent: 'Investment pitch deck, wealth management website hero, financial consulting campaign',
    aspectRatio: '16:9' as const
  };

  const qc2 = runQualityControl(promptDetails2, [], false);
  const meta2 = generateMetadataObject({
    filename: 'stock_vector_finance_811029',
    topic: 'Financial analytics growth curve and metrics board with copy space',
    category: 'Finance',
    contentType: 'vector',
    promptDetails: promptDetails2,
    layeredKeywords: {
      primary: ['finance', 'growth chart', 'analytics', 'investment', 'dashboard', 'data'],
      secondary: ['metrics', 'wealth', 'trading', 'profit', 'economy', 'graph', 'infographic'],
      intent: ['copy space', 'header banner', 'presentation slide', 'marketing visual'],
      concept: ['success', 'progress', 'capital', 'sustainability', 'roi'],
      usage: ['fintech', 'banking', 'venture capital', 'accounting', 'business strategy']
    },
    qualityScore: qc2.score,
    opportunityScore: 88,
    peoplePresent: false
  });

  return [
    {
      id: 'asset_init_1',
      researchId: 'opp_init_1',
      filename: 'stock_vector_cyber_920141',
      title: meta1.title,
      contentType: 'vector',
      format: 'svg',
      dataUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg1)}`,
      vectorSvg: svg1,
      promptDetails: promptDetails1,
      qualityCheck: qc1,
      metadata: meta1,
      status: 'READY',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      costEstimate: {
        tokens: 650,
        estimatedCostUsd: 0.001
      }
    },
    {
      id: 'asset_init_2',
      researchId: 'opp_init_2',
      filename: 'stock_vector_finance_811029',
      title: meta2.title,
      contentType: 'vector',
      format: 'svg',
      dataUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg2)}`,
      vectorSvg: svg2,
      promptDetails: promptDetails2,
      qualityCheck: qc2,
      metadata: meta2,
      status: 'READY',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      costEstimate: {
        tokens: 710,
        estimatedCostUsd: 0.0011
      }
    }
  ];
}
