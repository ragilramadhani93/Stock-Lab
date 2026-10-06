import { ResearchOpportunity, StockAsset } from '../types';
import { formatAdobeStockMetadata, formatShutterstockMetadata } from '../config/platformRules';

/**
 * Escapes CSV field value according to RFC 4180
 */
function escapeCsv(val: any): string {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Generates Adobe Stock submission CSV
 * Columns: Filename, Title, Keywords, Category, Releases
 */
export function generateAdobeStockCsv(assets: StockAsset[]): string {
  const header = ['Filename', 'Title', 'Keywords', 'Category', 'Releases'];
  const rows = assets.map(asset => {
    const formatted = formatAdobeStockMetadata(asset.metadata);
    return [
      escapeCsv(formatted.filename),
      escapeCsv(formatted.title),
      escapeCsv(formatted.keywords),
      escapeCsv(formatted.category),
      escapeCsv(formatted.releases)
    ].join(',');
  });

  return [header.join(','), ...rows].join('\n');
}

/**
 * Generates Shutterstock submission CSV
 * Columns: Filename, Description, Keywords, Categories, Illustration, Editorial
 */
export function generateShutterstockCsv(assets: StockAsset[]): string {
  const header = ['Filename', 'Description', 'Keywords', 'Categories', 'Illustration', 'Editorial'];
  const rows = assets.map(asset => {
    const formatted = formatShutterstockMetadata(asset.metadata);
    return [
      escapeCsv(formatted.filename),
      escapeCsv(formatted.description),
      escapeCsv(formatted.keywords),
      escapeCsv(formatted.category),
      escapeCsv(formatted.illustration),
      escapeCsv(formatted.editorial)
    ].join(',');
  });

  return [header.join(','), ...rows].join('\n');
}

/**
 * Generates Master Universal Metadata CSV
 */
export function generateMasterMetadataCsv(assets: StockAsset[]): string {
  const header = [
    'Filename',
    'Title',
    'Description',
    'Keywords',
    'Category',
    'Asset Type',
    'AI Generated',
    'Commercial Use',
    'Model Release',
    'Property Release',
    'IP Risk',
    'Quality Score',
    'Opportunity Score'
  ];

  const rows = assets.map(asset => {
    const m = asset.metadata;
    const qc = asset.qualityCheck;
    return [
      escapeCsv(m.filename),
      escapeCsv(m.title),
      escapeCsv(m.description),
      escapeCsv(m.keywords.join(', ')),
      escapeCsv(m.category),
      escapeCsv(m.asset_type),
      escapeCsv(m.ai_generated ? 'Yes' : 'No'),
      escapeCsv(m.commercial_use ? 'Yes' : 'No'),
      escapeCsv(qc.modelRelease),
      escapeCsv(qc.propertyRelease),
      escapeCsv(qc.ipRisk.toUpperCase()),
      escapeCsv(qc.score),
      escapeCsv(m.opportunity_score)
    ].join(',');
  });

  return [header.join(','), ...rows].join('\n');
}

/**
 * Generates Quality & Compliance Audit Report CSV
 */
export function generateQualityReportCsv(assets: StockAsset[]): string {
  const header = [
    'Filename',
    'QC Status',
    'Quality Score',
    'IP Risk',
    'IP Risk Detail',
    'People Anatomy Status',
    'Typography Status',
    'Similarity Status',
    'Highest Similarity %',
    'Model Release Status'
  ];

  const rows = assets.map(asset => {
    const qc = asset.qualityCheck;
    return [
      escapeCsv(asset.filename),
      escapeCsv(qc.status.toUpperCase()),
      escapeCsv(qc.score),
      escapeCsv(qc.ipRisk.toUpperCase()),
      escapeCsv(qc.ipRiskReason || 'Clean'),
      escapeCsv(qc.peopleQC.status.toUpperCase()),
      escapeCsv(qc.typographyQC.status.toUpperCase()),
      escapeCsv(qc.similarityQC.status.toUpperCase()),
      escapeCsv(qc.similarityQC.highestSimilarityPct + '%'),
      escapeCsv(qc.modelRelease)
    ].join(',');
  });

  return [header.join(','), ...rows].join('\n');
}

/**
 * Generates Research & Opportunity Report CSV
 */
export function generateResearchReportCsv(opportunities: ResearchOpportunity[]): string {
  const header = [
    'Topic',
    'Opportunity Score',
    'Demand (25%)',
    'Commercial Utility (20%)',
    'Keyword Opp (15%)',
    'Trend Momentum (15%)',
    'Evergreen (10%)',
    'Competition Score',
    'Saturation Risk',
    'Trend Type',
    'Market Gap - Overrepresented',
    'Market Gap - Missing Angle',
    'Recommendation'
  ];

  const rows = opportunities.map(opp => {
    const score = opp.opportunityScore;
    const gap = opp.marketGap;
    return [
      escapeCsv(opp.topic),
      escapeCsv(score.total),
      escapeCsv(score.demand),
      escapeCsv(score.commercialUsefulness),
      escapeCsv(score.keywordOpportunity),
      escapeCsv(score.trendMomentum),
      escapeCsv(score.evergreenPotential),
      escapeCsv(opp.competitionScore),
      escapeCsv(opp.saturationRisk.toUpperCase()),
      escapeCsv(opp.trendType.toUpperCase()),
      escapeCsv(gap.overrepresented),
      escapeCsv(gap.missingAngle),
      escapeCsv(score.total >= 80 ? 'PRODUCE (Strong Opportunity)' : 'SELECTIVE')
    ].join(',');
  });

  return [header.join(','), ...rows].join('\n');
}

/**
 * Generates Prompts & Generator Commands Catalog CSV (Mode Hemat)
 */
export function generatePromptsCatalogCsv(assets: StockAsset[]): string {
  const header = [
    'Filename',
    'Title',
    'Category',
    'Master Prompt',
    'Negative Prompt',
    'Copy Space',
    'Aspect Ratio',
    'Midjourney Command',
    'Flux Prompt',
    'Stable Diffusion Prompt',
    'Opportunity Score',
    'Quality Score',
    'Adobe Title',
    'Adobe Keywords'
  ];

  const rows = assets.map(asset => {
    const p = asset.promptDetails;
    const m = asset.metadata;
    const arParam = p.aspectRatio.replace(':', ':');
    const mj = asset.generatorParams?.midjourney ||
      `/imagine prompt: ${p.masterPrompt} --ar ${arParam} --v 6.1 --style raw --stylize 100 --no ${p.negativePrompt}`;
    const flux = asset.generatorParams?.flux ||
      `${p.masterPrompt} [negative: ${p.negativePrompt}]`;
    const sd = asset.generatorParams?.stableDiffusion ||
      `${p.masterPrompt} (negative: ${p.negativePrompt})`;

    return [
      escapeCsv(asset.filename),
      escapeCsv(asset.title),
      escapeCsv(m.category),
      escapeCsv(p.masterPrompt),
      escapeCsv(p.negativePrompt),
      escapeCsv(p.copySpace),
      escapeCsv(p.aspectRatio),
      escapeCsv(mj),
      escapeCsv(flux),
      escapeCsv(sd),
      escapeCsv(m.opportunity_score),
      escapeCsv(asset.qualityCheck.score),
      escapeCsv(m.title),
      escapeCsv(m.keywords.slice(0, 49).join(', '))
    ].join(',');
  });

  return [header.join(','), ...rows].join('\n');
}

