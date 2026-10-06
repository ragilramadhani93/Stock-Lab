export type Platform = 'adobe_stock' | 'shutterstock' | 'istock' | 'generic';

export type ContentType =
  | 'photo'
  | 'illustration'
  | 'vector'
  | 'icon'
  | 'background'
  | '3d_style'
  | 'business'
  | 'people'
  | 'objects'
  | 'food'
  | 'tech'
  | 'finance'
  | 'healthcare'
  | 'education'
  | 'lifestyle'
  | 'seasonal'
  | 'abstract';

export type TargetMarket =
  | 'global'
  | 'us'
  | 'europe'
  | 'southeast_asia'
  | 'indonesia'
  | 'japan';

export interface OpportunityScoreBreakdown {
  demand: number; // 25%
  commercialUsefulness: number; // 20%
  keywordOpportunity: number; // 15%
  trendMomentum: number; // 15%
  evergreenPotential: number; // 10%
  differentiationPotential: number; // 10%
  productionEase: number; // 5%
  total: number; // 0-100
}

export interface MarketGap {
  overrepresented: string;
  missingAngle: string;
  recommendedDifferentiation: string;
  recommendedCopySpace: 'left' | 'right' | 'top' | 'bottom' | 'center_blank' | 'none';
}

export interface ResearchSignal {
  name: string;
  type: 'real_public' | 'ai_estimated';
  signal: string;
  metric?: string;
}

export interface ResearchOpportunity {
  id: string;
  topic: string;
  seedKeyword?: string;
  platform: Platform;
  contentType: ContentType;
  market: TargetMarket;
  opportunityScore: OpportunityScoreBreakdown;
  competitionScore: number; // 0-100
  saturationRisk: 'low' | 'medium' | 'high';
  commercialPotential: 'low' | 'medium' | 'high';
  trendType: 'evergreen' | 'seasonal' | 'emerging' | 'short_lived' | 'saturated' | 'gap';
  seasonalWindow?: string;
  recommendedAssetType: string;
  recommendedComposition: string;
  marketGap: MarketGap;
  buyerUseCases: string[];
  keywordClusters: string[];
  whyThisTopic: string;
  signalSources: ResearchSignal[];
  status: 'discovered' | 'in_production' | 'completed';
  createdAt: string;
}

export interface PromptDetails {
  masterPrompt: string;
  negativePrompt: string;
  subject: string;
  cameraFraming: string;
  lighting: string;
  background: string;
  copySpace: string;
  commercialIntent: string;
  aspectRatio: '1:1' | '16:9' | '4:3' | '3:4' | '9:16';
}

export interface QualityCheckResult {
  status: 'pass' | 'warning' | 'fail';
  score: number; // 0-100
  peopleQC: {
    checked: boolean;
    defectsDetected: string[];
    status: 'pass' | 'warning' | 'fail';
  };
  typographyQC: {
    checked: boolean;
    hasText: boolean;
    recommendations: string;
    status: 'pass' | 'warning' | 'fail';
  };
  similarityQC: {
    checked: boolean;
    highestSimilarityPct: number;
    similarAssetId?: string;
    status: 'pass' | 'warning' | 'fail';
    warningMessage?: string;
  };
  ipRisk: 'low' | 'medium' | 'high';
  ipRiskReason?: string;
  modelRelease: 'Required' | 'Not required' | 'Review manually';
  propertyRelease: 'Required' | 'Not required' | 'Review manually';
}

export interface LayeredKeywords {
  primary: string[];
  secondary: string[];
  intent: string[];
  concept: string[];
  usage: string[];
}

export interface UniversalMetadata {
  filename: string;
  title: string;
  description: string;
  keywords: string[];
  layeredKeywords: LayeredKeywords;
  category: string;
  platforms: Platform[];
  asset_type: ContentType;
  ai_generated: boolean;
  commercial_use: boolean;
  people_present: boolean;
  property_present: boolean;
  release_required: boolean;
  ip_risk: 'low' | 'medium' | 'high';
  quality_score: number;
  opportunity_score: number;
  keyword_quality_score: number;
  keyword_validation_issues: string[];
}

export type AssetStatus =
  | 'IDEA'
  | 'RESEARCHED'
  | 'PROMPT_READY'
  | 'GENERATING'
  | 'GENERATED'
  | 'QC'
  | 'READY'
  | 'REJECTED'
  | 'EXPORTED';

export interface GeneratorSyntaxes {
  midjourney: string;
  flux: string;
  stableDiffusion: string;
  dallE: string;
}

export interface StockAsset {
  id: string;
  researchId?: string;
  filename: string;
  title: string;
  contentType: ContentType;
  format: 'svg' | 'png' | 'jpg';
  dataUrl: string;
  vectorSvg?: string;
  promptDetails: PromptDetails;
  generatorParams?: GeneratorSyntaxes;
  isPromptOnly?: boolean;
  qualityCheck: QualityCheckResult;
  metadata: UniversalMetadata;
  status: AssetStatus;
  createdAt: string;
  costEstimate: {
    tokens: number;
    estimatedCostUsd: number;
  };
}

export interface PlatformRuleConfig {
  id: Platform;
  name: string;
  titleMaxChars: number;
  descriptionRequired: boolean;
  keywordsMin: number;
  keywordsMax: number;
  topKeywordsPriorityCount: number;
  requiresAiFlag: boolean;
  allowedFormats: string[];
  categories: string[];
}
