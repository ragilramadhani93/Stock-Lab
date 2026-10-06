import { PromptDetails, QualityCheckResult, StockAsset } from '../types';

/**
 * Known commercial brand keywords or artist names strictly forbidden in stock submissions
 */
const TRADEMARK_TERMS = [
  'apple', 'iphone', 'ipad', 'macbook', 'samsung', 'galaxy', 'nike', 'adidas',
  'tesla', 'microsoft', 'windows', 'coca-cola', 'pepsi', 'disney', 'marvel',
  'star wars', 'mickey mouse', 'batman', 'superman', 'barbie', 'lego', 'gucci',
  'louis vuitton', 'chanel', 'prada', 'rolex', 'ferrari', 'porsche', 'bmw',
  'mercedes', 'audi', 'starbucks', 'mcdonalds', 'greg rutkowski', 'artgerm'
];

/**
 * Evaluates duplicate similarity against other assets in the catalog/queue
 */
export function calculateAssetSimilarity(
  candidatePrompt: string,
  existingAssets: StockAsset[]
): { highestSimilarityPct: number; similarAssetId?: string; warning?: string } {
  if (!existingAssets || existingAssets.length === 0) {
    return { highestSimilarityPct: 0 };
  }

  const candidateWords = new Set(
    candidatePrompt.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 3)
  );

  let maxSimilarity = 0;
  let mostSimilarId: string | undefined;

  for (const asset of existingAssets) {
    const existingWords = new Set(
      (asset.promptDetails?.masterPrompt || asset.title || '')
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3)
    );

    if (candidateWords.size === 0 || existingWords.size === 0) continue;

    // Jaccard similarity intersection
    let intersectionCount = 0;
    for (const word of candidateWords) {
      if (existingWords.has(word)) {
        intersectionCount++;
      }
    }

    const unionCount = new Set([...candidateWords, ...existingWords]).size;
    const similarityPct = Math.round((intersectionCount / unionCount) * 100);

    if (similarityPct > maxSimilarity) {
      maxSimilarity = similarityPct;
      mostSimilarId = asset.id;
    }
  }

  let warning: string | undefined;
  if (maxSimilarity >= 80) {
    warning = `High similarity (${maxSimilarity}%) with Asset #${mostSimilarId?.slice(0, 6)}. Stock platforms may reject as duplicate spam. Vary framing, lighting, or context.`;
  } else if (maxSimilarity >= 65) {
    warning = `Moderate similarity (${maxSimilarity}%) detected. Consider changing camera angle or background.`;
  }

  return {
    highestSimilarityPct: maxSimilarity,
    similarAssetId: mostSimilarId,
    warning
  };
}

/**
 * Evaluates IP Risk based on prompt, subject, and composition
 */
export function evaluateIpRisk(text: string): { risk: 'low' | 'medium' | 'high'; reason?: string } {
  const lower = text.toLowerCase();
  
  for (const term of TRADEMARK_TERMS) {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(lower)) {
      return {
        risk: 'high',
        reason: `Potential trademark or proprietary brand detected ("${term}"). Commercial stock platforms will reject this asset.`
      };
    }
  }

  // Check for living artists or copyrighted entities
  if (lower.includes('in the style of') || lower.includes('character from') || lower.includes('celebrity')) {
    return {
      risk: 'high',
      reason: 'References living artist styles or copyrighted character references. Commercial stock platforms require original works.'
    };
  }

  // Check for generic risk triggers
  if (lower.includes('logo') || lower.includes('emblem') || lower.includes('trademark')) {
    return {
      risk: 'medium',
      reason: 'Contains logo/emblem phrasing. Ensure any graphic element is strictly fictional or generic.'
    };
  }

  return {
    risk: 'low'
  };
}

/**
 * Runs a complete Quality Control suite on an asset concept or generated image
 */
export function runQualityControl(
  promptDetails: PromptDetails,
  existingAssets: StockAsset[] = [],
  containsPeople: boolean = false
): QualityCheckResult {
  const textCorpus = `${promptDetails.masterPrompt} ${promptDetails.subject} ${promptDetails.negativePrompt}`;
  
  // 1. IP Risk
  const ipCheck = evaluateIpRisk(textCorpus);

  // 2. People QC
  const peopleQC = {
    checked: containsPeople,
    defectsDetected: [] as string[],
    status: 'pass' as 'pass' | 'warning' | 'fail'
  };

  if (containsPeople) {
    // If the negative prompt lacks anatomy guards, flag warning
    const neg = promptDetails.negativePrompt.toLowerCase();
    const hasAnatomyGuard = neg.includes('extra fingers') || neg.includes('malformed hands') || neg.includes('distorted');
    if (!hasAnatomyGuard) {
      peopleQC.defectsDetected.push('Prompt lacks anatomy safety constraints for hands/fingers');
      peopleQC.status = 'warning';
    }
  }

  // 3. Typography QC
  const typographyQC = {
    checked: true,
    hasText: false,
    recommendations: 'Asset utilizes clean copy space rather than embedded text.',
    status: 'pass' as 'pass' | 'warning' | 'fail'
  };

  const masterLower = promptDetails.masterPrompt.toLowerCase();
  if (masterLower.includes('text') || masterLower.includes('quote') || masterLower.includes('words written')) {
    typographyQC.hasText = true;
    typographyQC.recommendations = 'Embedded text detected. Microstock buyers prefer blank copy space so they can overlay their own typography.';
    typographyQC.status = 'warning';
  }

  // 4. Similarity / Duplicate check
  const similarity = calculateAssetSimilarity(promptDetails.masterPrompt, existingAssets);
  const similarityQC = {
    checked: true,
    highestSimilarityPct: similarity.highestSimilarityPct,
    similarAssetId: similarity.similarAssetId,
    status: (similarity.highestSimilarityPct >= 80 ? 'fail' : similarity.highestSimilarityPct >= 65 ? 'warning' : 'pass') as 'pass' | 'warning' | 'fail',
    warningMessage: similarity.warning
  };

  // 5. Release Requirements
  const modelRelease = containsPeople ? 'Review manually' : 'Not required';
  const propertyRelease = (textCorpus.toLowerCase().includes('architecture') || textCorpus.toLowerCase().includes('private estate'))
    ? 'Review manually'
    : 'Not required';

  // Overall Score Calculation
  let score = 95;
  if (ipCheck.risk === 'high') score -= 50;
  if (ipCheck.risk === 'medium') score -= 20;
  if (peopleQC.status === 'warning') score -= 10;
  if (typographyQC.status === 'warning') score -= 10;
  if (similarityQC.status === 'warning') score -= 15;
  if (similarityQC.status === 'fail') score -= 35;

  score = Math.max(10, Math.min(100, score));

  // Determine overall status
  let status: 'pass' | 'warning' | 'fail' = 'pass';
  if (ipCheck.risk === 'high' || similarityQC.status === 'fail' || score < 50) {
    status = 'fail';
  } else if (ipCheck.risk === 'medium' || peopleQC.status === 'warning' || typographyQC.status === 'warning' || similarityQC.status === 'warning' || score < 80) {
    status = 'warning';
  }

  return {
    status,
    score,
    peopleQC,
    typographyQC,
    similarityQC,
    ipRisk: ipCheck.risk,
    ipRiskReason: ipCheck.reason,
    modelRelease,
    propertyRelease
  };
}
