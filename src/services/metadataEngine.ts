import {
  ContentType,
  LayeredKeywords,
  Platform,
  PromptDetails,
  UniversalMetadata
} from '../types';

/**
 * Validates keywords against stock policies:
 * - Checks length, duplicates, trademark terms, stuffing
 * Returns a score from 0-100 and list of flagged issues
 */
export function validateKeywords(keywords: string[]): {
  score: number;
  issues: string[];
  cleanKeywords: string[];
} {
  const issues: string[] = [];
  const seen = new Set<string>();
  const cleanKeywords: string[] = [];

  const BANNED_WORDS = new Set([
    'apple', 'nike', 'google', 'microsoft', 'adidas', 'tesla', 'disney',
    'instagram', 'tiktok', 'facebook', 'best', 'top', 'buy', 'cheap', 'click',
    'download', 'stock', 'photo', 'image', 'picture', 'ai generated'
  ]);

  for (const raw of keywords) {
    const kw = raw.trim().toLowerCase();
    if (!kw || kw.length < 2) continue;

    if (seen.has(kw)) {
      issues.push(`Duplicate keyword removed: "${kw}"`);
      continue;
    }

    if (BANNED_WORDS.has(kw)) {
      issues.push(`Prohibited commercial keyword removed: "${kw}"`);
      continue;
    }

    seen.add(kw);
    cleanKeywords.push(kw);
  }

  let score = 95;
  if (cleanKeywords.length < 15) {
    score -= 20;
    issues.push(`Keyword count (${cleanKeywords.length}) is low. Stock buyers search with high specificity.`);
  } else if (cleanKeywords.length > 50) {
    score -= 10;
    issues.push(`Keyword count (${cleanKeywords.length}) exceeds 50; platforms may truncate.`);
  }

  if (issues.length > 5) {
    score -= 15;
  }

  score = Math.max(20, Math.min(100, score));

  return {
    score,
    issues,
    cleanKeywords
  };
}

/**
 * Synthesizes Layered Keywords and builds Universal Metadata
 */
export function generateMetadataObject(params: {
  filename: string;
  topic: string;
  category: string;
  contentType: ContentType;
  promptDetails: PromptDetails;
  layeredKeywords: LayeredKeywords;
  qualityScore: number;
  opportunityScore: number;
  peoplePresent?: boolean;
}): UniversalMetadata {
  const {
    filename,
    topic,
    category,
    contentType,
    promptDetails,
    layeredKeywords,
    qualityScore,
    opportunityScore,
    peoplePresent = false
  } = params;

  // Flatten layered keywords into a prioritized list
  // Top 10 are primary + secondary (most critical for Adobe Stock)
  const combined = [
    ...layeredKeywords.primary,
    ...layeredKeywords.secondary,
    ...layeredKeywords.intent,
    ...layeredKeywords.concept,
    ...layeredKeywords.usage
  ];

  const validation = validateKeywords(combined);

  // Adobe Stock title limit: 70 chars
  let title = `${topic.charAt(0).toUpperCase() + topic.slice(1)} with commercial copy space`;
  if (title.length > 70) {
    title = topic.slice(0, 67).trim() + '...';
  }

  // Shutterstock natural English descriptive sentence
  const description = `${topic.charAt(0).toUpperCase() + topic.slice(1)}. High quality commercial stock visual featuring ${promptDetails.subject.toLowerCase() || 'modern concept'} with clean negative space for marketing, website header, and advertising campaigns.`;

  return {
    filename,
    title,
    description,
    keywords: validation.cleanKeywords,
    layeredKeywords,
    category: category || 'Business',
    platforms: ['adobe_stock', 'shutterstock', 'istock', 'generic'],
    asset_type: contentType,
    ai_generated: true,
    commercial_use: true,
    people_present: peoplePresent,
    property_present: false,
    release_required: peoplePresent,
    ip_risk: 'low',
    quality_score: qualityScore,
    opportunity_score: opportunityScore,
    keyword_quality_score: validation.score,
    keyword_validation_issues: validation.issues
  };
}
