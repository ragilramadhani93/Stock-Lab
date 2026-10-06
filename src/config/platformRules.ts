import { Platform, PlatformRuleConfig, UniversalMetadata } from '../types';

export const PLATFORM_RULES: Record<Platform, PlatformRuleConfig> = {
  adobe_stock: {
    id: 'adobe_stock',
    name: 'Adobe Stock',
    titleMaxChars: 70,
    descriptionRequired: false,
    keywordsMin: 5,
    keywordsMax: 49,
    topKeywordsPriorityCount: 10,
    requiresAiFlag: true,
    allowedFormats: ['jpg', 'svg', 'ai', 'eps'],
    categories: [
      'Business',
      'Technology',
      'Finance',
      'Health & Medical',
      'Education',
      'Graphic Resources',
      'Illustrations',
      'People',
      'Lifestyle',
      'Environment',
      'Science',
      'Travel'
    ]
  },
  shutterstock: {
    id: 'shutterstock',
    name: 'Shutterstock',
    titleMaxChars: 200,
    descriptionRequired: true, // Needs descriptive natural sentence
    keywordsMin: 7,
    keywordsMax: 50,
    topKeywordsPriorityCount: 0,
    requiresAiFlag: true,
    allowedFormats: ['jpg', 'eps', 'svg'],
    categories: [
      'Business/Finance',
      'Technology',
      'Vectors',
      'Healthcare/Medical',
      'Education',
      'Backgrounds/Textures',
      'Icons',
      'People',
      'Signs/Symbols',
      'Science',
      'Abstract',
      'Holidays'
    ]
  },
  istock: {
    id: 'istock',
    name: 'iStock / Getty Images',
    titleMaxChars: 120,
    descriptionRequired: true,
    keywordsMin: 10,
    keywordsMax: 50,
    topKeywordsPriorityCount: 5,
    requiresAiFlag: true,
    allowedFormats: ['jpg', 'eps', 'svg'],
    categories: [
      'Business & Career',
      'Technology & Industry',
      'Finance & Economy',
      'Healthcare & Medicine',
      'Science & Innovation',
      'Concepts & Ideas',
      'Illustrations & Vectors'
    ]
  },
  generic: {
    id: 'generic',
    name: 'Universal Stock Master',
    titleMaxChars: 100,
    descriptionRequired: true,
    keywordsMin: 10,
    keywordsMax: 50,
    topKeywordsPriorityCount: 10,
    requiresAiFlag: true,
    allowedFormats: ['jpg', 'png', 'svg'],
    categories: [
      'Business',
      'Technology',
      'Finance',
      'Healthcare',
      'Education',
      'Vector Graphics',
      'Icons',
      'Lifestyle'
    ]
  }
};

/**
 * Format Universal Metadata specifically for Adobe Stock CSV format
 * Columns: Filename, Title, Keywords, Category, Releases
 */
export function formatAdobeStockMetadata(meta: UniversalMetadata) {
  const truncatedTitle = meta.title.length > 70 ? meta.title.substring(0, 67).trim() + '...' : meta.title;
  // Adobe Stock: maximum 49 keywords, first 10 must be top priority
  const prioritizedKeywords = meta.keywords.slice(0, 49).join(', ');
  
  let releases = 'None';
  if (meta.people_present && meta.release_required) {
    releases = 'Model Release Required';
  } else if (meta.property_present) {
    releases = 'Property Release Required';
  }

  return {
    filename: meta.filename,
    title: truncatedTitle,
    keywords: prioritizedKeywords,
    category: meta.category || 'Business',
    releases,
    aiGenerated: meta.ai_generated ? 'Yes' : 'No'
  };
}

/**
 * Format Universal Metadata specifically for Shutterstock CSV format
 * Columns: Filename, Description, Keywords, Categories
 */
export function formatShutterstockMetadata(meta: UniversalMetadata) {
  // Shutterstock requires descriptive English sentence
  const description = meta.description || meta.title;
  const keywords = meta.keywords.slice(0, 50).join(', ');
  
  return {
    filename: meta.filename,
    description: description,
    keywords: keywords,
    category: meta.category || 'Business/Finance',
    illustration: meta.asset_type === 'vector' || meta.asset_type === 'illustration' ? 'Yes' : 'No',
    editorial: 'No'
  };
}
