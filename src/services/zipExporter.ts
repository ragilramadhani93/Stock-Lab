import JSZip from 'jszip';
import { ResearchOpportunity, StockAsset } from '../types';
import {
  generateAdobeStockCsv,
  generateMasterMetadataCsv,
  generatePromptsCatalogCsv,
  generateQualityReportCsv,
  generateResearchReportCsv,
  generateShutterstockCsv
} from './csvExporter';

/**
 * Builds a complete microstock submission ZIP package
 * containing /assets, /metadata, and /reports
 */
export async function createMicrostockZipPackage(
  assets: StockAsset[],
  opportunities: ResearchOpportunity[] = []
): Promise<Blob> {
  const zip = new JSZip();

  const assetsFolder = zip.folder('assets');
  const metadataFolder = zip.folder('metadata');
  const reportsFolder = zip.folder('reports');

  // 1. Add Asset files
  if (assetsFolder) {
    for (const asset of assets) {
      if (asset.vectorSvg) {
        assetsFolder.file(`${asset.filename}.svg`, asset.vectorSvg);
      } else if (asset.dataUrl.startsWith('data:image/svg+xml')) {
        const svgContent = decodeURIComponent(asset.dataUrl.split(',')[1] || '');
        assetsFolder.file(`${asset.filename}.svg`, svgContent);
      } else if (asset.dataUrl.startsWith('data:image/png;base64,')) {
        const base64Data = asset.dataUrl.replace(/^data:image\/png;base64,/, '');
        assetsFolder.file(`${asset.filename}.png`, base64Data, { base64: true });
      } else if (asset.dataUrl.startsWith('data:image/jpeg;base64,')) {
        const base64Data = asset.dataUrl.replace(/^data:image\/jpeg;base64,/, '');
        assetsFolder.file(`${asset.filename}.jpg`, base64Data, { base64: true });
      } else {
        // Fallback text description or file
        assetsFolder.file(`${asset.filename}.txt`, `Microstock Asset: ${asset.title}\nFormat: ${asset.format}\nStatus: ${asset.status}`);
      }
    }
  }

  // 2. Add Platform Metadata & Prompt Pack CSVs
  if (metadataFolder) {
    metadataFolder.file('prompts_and_generators.csv', generatePromptsCatalogCsv(assets));
    metadataFolder.file('adobe_stock_metadata.csv', generateAdobeStockCsv(assets));
    metadataFolder.file('shutterstock_metadata.csv', generateShutterstockCsv(assets));
    metadataFolder.file('metadata_master.csv', generateMasterMetadataCsv(assets));
  }

  // 3. Add Audit & Research Reports
  if (reportsFolder) {
    reportsFolder.file('quality_report.csv', generateQualityReportCsv(assets));
    reportsFolder.file('research_report.csv', generateResearchReportCsv(opportunities));
  }

  // Generate ZIP blob
  return await zip.generateAsync({ type: 'blob' });
}
