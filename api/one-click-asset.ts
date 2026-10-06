import { handleOneClickAsset } from '../src/server/geminiBackend';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await handleOneClickAsset(body || {});
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Vercel API error in /api/one-click-asset:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
