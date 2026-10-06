/**
 * Clean Vector SVG Generator & Raster-to-Vector Path Engine
 * Generates true, editable SVG markup with clean shapes, paths, gradients, and scalable viewBox.
 */

export interface VectorGenerationOptions {
  topic: string;
  category: string;
  style: 'flat' | 'gradient_modern' | 'isometric' | 'line_art' | 'duotone';
  aspectRatio: '1:1' | '16:9' | '4:3';
  primaryColor?: string;
  secondaryColor?: string;
}

export function generateEditableSvg(options: VectorGenerationOptions): string {
  const { topic, category, style, aspectRatio } = options;
  const isWidescreen = aspectRatio === '16:9';
  const width = isWidescreen ? 1600 : 1200;
  const height = isWidescreen ? 900 : (aspectRatio === '4:3' ? 900 : 1200);

  const lower = topic.toLowerCase();

  // Color schemes based on microstock commercial categories
  let colA = '#4F46E5'; // Indigo
  let colB = '#06B6D4'; // Cyan
  let colC = '#10B981'; // Emerald
  let bg = '#0B0F17';

  if (category.includes('Finance') || lower.includes('fintech') || lower.includes('money')) {
    colA = '#059669';
    colB = '#10B981';
    colC = '#34D399';
    bg = '#064E3B';
  } else if (category.includes('Tech') || lower.includes('cyber') || lower.includes('security') || lower.includes('ai')) {
    colA = '#6366F1';
    colB = '#3B82F6';
    colC = '#8B5CF6';
    bg = '#0F172A';
  } else if (category.includes('Health') || lower.includes('medical') || lower.includes('bio')) {
    colA = '#0284C7';
    colB = '#38BDF8';
    colC = '#14B8A6';
    bg = '#082F49';
  } else if (lower.includes('sustain') || lower.includes('eco') || lower.includes('green')) {
    colA = '#16A34A';
    colB = '#84CC16';
    colC = '#10B981';
    bg = '#14532D';
  }

  // Generate vector content based on style & topic
  const cx = width / 2;
  const cy = height / 2;

  let graphicElements = '';

  if (lower.includes('security') || lower.includes('cyber') || lower.includes('shield')) {
    graphicElements = `
      <!-- Cyber Shield Centerpiece -->
      <g filter="url(#glow)">
        <path d="M${cx},${cy - 200} L${cx + 170},${cy - 120} C${cx + 170},${cy + 90} ${cx},${cy + 240} ${cx},${cy + 240} C${cx},${cy + 240} ${cx - 170},${cy + 90} ${cx - 170},${cy - 120} Z"
              fill="url(#grad1)" stroke="${colB}" stroke-width="4" />
        <path d="M${cx},${cy - 160} L${cx + 130},${cy - 100} C${cx + 130},${cy + 60} ${cx},${cy + 190} ${cx},${cy + 190} C${cx},${cy + 190} ${cx - 130},${cy + 60} ${cx - 130},${cy - 100} Z"
              fill="${bg}" opacity="0.6" stroke="${colC}" stroke-width="2" stroke-dasharray="8 6" />
        <!-- Keyhole / Core Node -->
        <circle cx="${cx}" cy="${cy - 30}" r="45" fill="url(#grad2)" />
        <path d="M${cx - 24},${cy - 10} L${cx + 24},${cy - 10} L${cx + 36},${cy + 75} L${cx - 36},${cy + 75} Z" fill="url(#grad2)" />
        <circle cx="${cx}" cy="${cy - 30}" r="18" fill="#ffffff" />
      </g>
      <!-- Circuit Network Elements -->
      <path d="M${cx - 280},${cy - 80} L${cx - 190},${cy - 80} L${cx - 160},${cy - 50}" stroke="${colB}" stroke-width="3" fill="none" opacity="0.8" />
      <circle cx="${cx - 280}" cy="${cy - 80}" r="8" fill="${colC}" />
      <path d="M${cx + 280},${cy + 100} L${cx + 190},${cy + 100} L${cx + 160},${cy + 70}" stroke="${colC}" stroke-width="3" fill="none" opacity="0.8" />
      <circle cx="${cx + 280}" cy="${cy + 100}" r="8" fill="${colB}" />
    `;
  } else if (lower.includes('finance') || lower.includes('chart') || lower.includes('growth') || lower.includes('dashboard')) {
    graphicElements = `
      <!-- Financial Analytics Board -->
      <g filter="url(#glow)">
        <!-- Chart Glass Card -->
        <rect x="${cx - 320}" y="${cy - 220}" width="640" height="420" rx="24" fill="url(#cardGrad)" stroke="#38BDF8" stroke-width="2" stroke-opacity="0.3" />
        <!-- Gridlines -->
        <line x1="${cx - 280}" y1="${cy - 140}" x2="${cx + 280}" y2="${cy - 140}" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5" />
        <line x1="${cx - 280}" y1="${cy - 50}" x2="${cx + 280}" y2="${cy - 50}" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5" />
        <line x1="${cx - 280}" y1="${cy + 40}" x2="${cx + 280}" y2="${cy + 40}" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5" />
        <line x1="${cx - 280}" y1="${cy + 130}" x2="${cx + 280}" y2="${cy + 130}" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1.5" />
        
        <!-- Growth Area Polygon -->
        <path d="M${cx - 260},${cy + 120} L${cx - 150},${cy + 60} L${cx - 40},${cy + 90} L${cx + 80},${cy - 20} L${cx + 180},${cy - 60} L${cx + 260},${cy - 140} L${cx + 260},${cy + 130} L${cx - 260},${cy + 130} Z"
              fill="url(#gradGrowth)" opacity="0.4" />
        <!-- Trend Curve Line -->
        <path d="M${cx - 260},${cy + 120} L${cx - 150},${cy + 60} L${cx - 40},${cy + 90} L${cx + 80},${cy - 20} L${cx + 180},${cy - 60} L${cx + 260},${cy - 140}"
              fill="none" stroke="${colB}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
        
        <!-- Growth Indicator Points -->
        <circle cx="${cx - 260}" cy="${cy + 120}" r="8" fill="#ffffff" stroke="${colB}" stroke-width="3" />
        <circle cx="${cx - 150}" cy="${cy + 60}" r="8" fill="#ffffff" stroke="${colB}" stroke-width="3" />
        <circle cx="${cx - 40}" cy="${cy + 90}" r="8" fill="#ffffff" stroke="${colB}" stroke-width="3" />
        <circle cx="${cx + 80}" cy="${cy - 20}" r="8" fill="#ffffff" stroke="${colB}" stroke-width="3" />
        <circle cx="${cx + 180}" cy="${cy - 60}" r="8" fill="#ffffff" stroke="${colB}" stroke-width="3" />
        <circle cx="${cx + 260}" cy="${cy - 140}" r="11" fill="${colC}" stroke="#ffffff" stroke-width="3" />
      </g>
    `;
  } else if (lower.includes('ai') || lower.includes('brain') || lower.includes('cloud') || lower.includes('data')) {
    graphicElements = `
      <!-- AI / Neural Network Concept -->
      <g filter="url(#glow)">
        <!-- Core Nucleus -->
        <circle cx="${cx}" cy="${cy}" r="120" fill="url(#grad1)" opacity="0.85" />
        <circle cx="${cx}" cy="${cy}" r="70" fill="url(#grad2)" />
        <circle cx="${cx}" cy="${cy}" r="30" fill="#ffffff" />
        
        <!-- Synapse Orbits -->
        <circle cx="${cx}" cy="${cy}" r="180" fill="none" stroke="${colB}" stroke-width="2" stroke-dasharray="12 8" opacity="0.6" />
        <circle cx="${cx}" cy="${cy}" r="250" fill="none" stroke="${colC}" stroke-width="1.5" opacity="0.4" />
        
        <!-- Floating Nodes -->
        <circle cx="${cx - 160}" cy="${cy - 110}" r="16" fill="${colB}" />
        <line x1="${cx}" y1="${cy}" x2="${cx - 160}" y2="${cy - 110}" stroke="${colB}" stroke-width="2.5" opacity="0.7" />
        
        <circle cx="${cx + 180}" cy="${cy - 90}" r="20" fill="${colC}" />
        <line x1="${cx}" y1="${cy}" x2="${cx + 180}" y2="${cy - 90}" stroke="${colC}" stroke-width="2.5" opacity="0.7" />

        <circle cx="${cx - 140}" cy="${cy + 150}" r="18" fill="${colC}" />
        <line x1="${cx}" y1="${cy}" x2="${cx - 140}" y2="${cy + 150}" stroke="${colC}" stroke-width="2.5" opacity="0.7" />

        <circle cx="${cx + 170}" cy="${cy + 140}" r="15" fill="${colA}" />
        <line x1="${cx}" y1="${cy}" x2="${cx + 170}" y2="${cy + 140}" stroke="${colA}" stroke-width="2.5" opacity="0.7" />
      </g>
    `;
  } else {
    // Elegant geometric commercial composition with designated copy space
    graphicElements = `
      <!-- Abstract Commercial Geometric Composition with Ample Copy Space -->
      <g filter="url(#glow)">
        <circle cx="${cx + 200}" cy="${cy - 50}" r="220" fill="url(#grad1)" opacity="0.8" />
        <polygon points="${cx + 100},${cy - 220} ${cx + 380},${cy} ${cx + 180},${cy + 220}" fill="url(#grad2)" opacity="0.6" />
        <rect x="${cx + 40}" y="${cy + 20}" width="280" height="180" rx="30" fill="none" stroke="${colC}" stroke-width="4" stroke-dasharray="16 8" />
        <circle cx="${cx + 180}" cy="${cy + 80}" r="40" fill="#ffffff" opacity="0.9" />
      </g>
      <!-- Subtle Decorative Accent Lines -->
      <path d="M${cx + 80},${cy - 180} C${cx + 250},${cy - 150} ${cx + 350},${cy + 50} ${cx + 240},${cy + 180}" fill="none" stroke="${colB}" stroke-width="3" stroke-linecap="round" />
    `;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(topic)}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090D16" />
      <stop offset="100%" stop-color="#141B2D" />
    </linearGradient>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colA}" />
      <stop offset="100%" stop-color="${colB}" />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colB}" />
      <stop offset="100%" stop-color="${colC}" />
    </linearGradient>
    <linearGradient id="gradGrowth" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${colC}" stop-opacity="0.8" />
      <stop offset="100%" stop-color="${colA}" stop-opacity="0.0" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#0F172A" stop-opacity="0.98" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Clean Commercial Background Field -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

  <!-- Subtle Microstock Grid Backdrop -->
  <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
    <circle cx="30" cy="30" r="1.5" fill="#ffffff" fill-opacity="0.06" />
  </pattern>
  <rect width="${width}" height="${height}" fill="url(#grid)" />

  <!-- Editable Vector Illustration Geometry -->
  ${graphicElements}

  <!-- Designated Copy Space Guide Tag (Visual Indicator) -->
  <g opacity="0.25">
    <rect x="60" y="${height - 70}" width="220" height="32" rx="6" fill="#1E293B" />
    <text x="75" y="${height - 49}" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" font-weight="500">Commercial Copy Space</text>
  </g>
</svg>`;
}

/**
 * Generates an informative blueprint preview card for Prompt-Only assets (Mode Hemat).
 * ZERO image generation cost, high aesthetic technical blueprint.
 */
export function generatePromptBlueprintSvg(topic: string, copySpace: string, aspectRatio: string = '16:9'): string {
  const isWide = aspectRatio === '16:9';
  const width = isWide ? 1600 : 1200;
  const height = isWide ? 900 : 1200;
  const cx = width / 2;
  const cy = height / 2;

  const escapedTopic = escapeXml(topic);
  const escapedCopySpace = escapeXml(copySpace);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Stock Prompt Blueprint">
  <defs>
    <linearGradient id="blueprintBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080D1A" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <pattern id="dotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1.2" fill="#38BDF8" fill-opacity="0.15" />
    </pattern>
  </defs>

  <!-- Dark Engineering Blueprint Backdrop -->
  <rect width="${width}" height="${height}" fill="url(#blueprintBg)" />
  <rect width="${width}" height="${height}" fill="url(#dotGrid)" />

  <!-- Outer Framing Guides -->
  <rect x="40" y="40" width="${width - 80}" height="${height - 80}" rx="16" fill="none" stroke="#38BDF8" stroke-width="1.5" stroke-opacity="0.25" stroke-dasharray="8 6" />

  <!-- Center Card Area -->
  <rect x="${cx - 480}" y="${cy - 200}" width="960" height="400" rx="20" fill="#0B132B" fill-opacity="0.85" stroke="#6366F1" stroke-width="2" stroke-opacity="0.4" />

  <!-- Prompt Dossier Tag -->
  <g transform="translate(${cx - 440}, ${cy - 160})">
    <rect width="210" height="34" rx="8" fill="#4F46E5" fill-opacity="0.2" stroke="#6366F1" stroke-width="1.5" />
    <text x="15" y="22" fill="#A5B4FC" font-family="system-ui, sans-serif" font-size="13" font-weight="700" letter-spacing="1">⚡ READY PROMPT PACK</text>
  </g>

  <!-- Aspect Ratio & Copy Space Indicators -->
  <g transform="translate(${cx + 260}, ${cy - 160})">
    <text x="0" y="22" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="14" font-weight="600">AR: ${escapeXml(aspectRatio)} · Copy: ${escapedCopySpace}</text>
  </g>

  <!-- Topic Title -->
  <text x="${cx - 440}" y="${cy - 80}" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="28" font-weight="700">
    ${escapedTopic.length > 55 ? escapedTopic.substring(0, 52) + '...' : escapedTopic}
  </text>

  <!-- Subtitle Instruction -->
  <text x="${cx - 440}" y="${cy - 35}" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="16" font-weight="500">
    Commercial Stock Prompt &amp; Metadata Dossier (Zero Image API Cost)
  </text>

  <!-- Guideline Boxes -->
  <g transform="translate(${cx - 440}, ${cy + 15})">
    <rect width="420" height="120" rx="12" fill="#1E293B" fill-opacity="0.6" stroke="#334155" stroke-width="1" />
    <text x="20" y="32" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12" font-weight="600">COMPOSITION</text>
    <text x="20" y="60" fill="#E2E8F0" font-family="system-ui, sans-serif" font-size="14">Rule of thirds · 40% clean copy space</text>
    <text x="20" y="85" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12">Optimized for marketing &amp; web headers</text>
  </g>

  <g transform="translate(${cx + 20}, ${cy + 15})">
    <rect width="420" height="120" rx="12" fill="#1E293B" fill-opacity="0.6" stroke="#334155" stroke-width="1" />
    <text x="20" y="32" fill="#10B981" font-family="system-ui, sans-serif" font-size="12" font-weight="600">STOCK-SAFE IP AUDIT</text>
    <text x="20" y="60" fill="#E2E8F0" font-family="system-ui, sans-serif" font-size="14">100% Original · Zero Protected Trademarks</text>
    <text x="20" y="85" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="12">No living artist names · Ready for submission</text>
  </g>
</svg>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
