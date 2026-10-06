import type { Plugin } from 'vite';
import {
  handleGenerateMetadata,
  handleGeneratePrompt,
  handleOneClickAsset,
  handleResearch
} from './geminiBackend';

export function microstockApiPlugin(): Plugin {
  return {
    name: 'microstock-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Helper to parse JSON request body
        const readBody = async (): Promise<any> => {
          return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch (e) {
                reject(e);
              }
            });
            req.on('error', reject);
          });
        };

        const sendJson = (statusCode: number, data: any) => {
          res.statusCode = statusCode;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        const endpoint = req.url.split('?')[0];

        try {
          if (endpoint === '/api/research' && req.method === 'POST') {
            const body = await readBody();
            const result = await handleResearch(body);
            return sendJson(200, result);
          }

          if (endpoint === '/api/generate-prompt' && req.method === 'POST') {
            const body = await readBody();
            const result = await handleGeneratePrompt(body);
            return sendJson(200, result);
          }

          if (endpoint === '/api/generate-metadata' && req.method === 'POST') {
            const body = await readBody();
            const result = await handleGenerateMetadata(body);
            return sendJson(200, result);
          }

          if (endpoint === '/api/one-click-asset' && req.method === 'POST') {
            const body = await readBody();
            const result = await handleOneClickAsset(body);
            return sendJson(200, result);
          }

          // Unhandled api endpoint
          return sendJson(404, { error: 'Not found' });
        } catch (err: any) {
          console.error('API Error:', err);
          return sendJson(500, { error: err.message || 'Internal server error' });
        }
      });
    }
  };
}
