import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  ShieldCheck,
  Zap,
  Server,
  FileCode
} from 'lucide-react';

interface VercelDeployModalProps {
  onClose: () => void;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({ onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const envSample = `# Tambahkan di Vercel: Project Settings -> Environment Variables
GEMINI_API_KEY="AIzaSy..."

# Opsional: Jika menggunakan model gambar eksternal
# OPENAI_API_KEY="sk-..."`;

  const vercelJsonSample = `{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/api/:match*", "destination": "/api/:match*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-[#0F1523] shadow-2xl overflow-hidden my-8 text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black border border-slate-700 flex items-center justify-center font-bold text-white shadow-sm">
              ▲
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Panduan Deploy ke Vercel
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready to Deploy
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Langkah-langkah menyiapkan Microstock Asset Lab di platform Vercel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick Summary Pill */}
          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex items-start gap-3">
            <Zap className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-semibold text-indigo-300">Konfigurasi Siap Pakai</span>
              <p className="text-slate-300 leading-relaxed">
                Aplikasi ini sudah dilengkapi dengan file <code className="text-white font-mono bg-slate-800 px-1.5 py-0.5 rounded">vercel.json</code> dan backend serverless di folder <code className="text-white font-mono bg-slate-800 px-1.5 py-0.5 rounded">/api</code>. Anda hanya perlu 3 langkah utama di bawah.
              </p>
            </div>
          </div>

          {/* Steps Checklist */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Checklist Persiapan Deploy:
            </h4>

            {/* Step 1 */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 text-xs flex items-center justify-center font-bold">1</span>
                  <span>Push Source Code ke GitHub / GitLab</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Git Repository</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-7">
                Pastikan seluruh file project sudah di-commit ke repository Git Anda. Folder <code className="text-indigo-300 font-mono">api/</code> dan <code className="text-indigo-300 font-mono">vercel.json</code> harus ikut ter-push.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 text-xs flex items-center justify-center font-bold">2</span>
                  <span>Set Environment Variable di Vercel Dashboard</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Wajib
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-7">
                Saat import project di Vercel (atau di menu <em>Settings → Environment Variables</em>), tambahkan kunci API Gemini berikut:
              </p>
              <div className="pl-7">
                <div className="relative rounded-lg bg-slate-950 border border-slate-800 p-3 font-mono text-xs text-indigo-300">
                  <pre className="overflow-x-auto">{envSample}</pre>
                  <button
                    onClick={() => handleCopy(envSample, 'env')}
                    className="absolute top-2 right-2 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'env' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin .env</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 text-xs flex items-center justify-center font-bold">3</span>
                  <span>Build &amp; Output Settings (Otomatis)</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">vercel.json</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-7">
                Vercel akan otomatis mendeteksi konfigurasi di <code className="text-white font-mono bg-slate-800 px-1.5 py-0.5 rounded">vercel.json</code>:
              </p>
              <div className="pl-7 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Framework Preset</span>
                  <span className="text-white font-semibold font-mono">Vite</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Build Command</span>
                  <span className="text-white font-semibold font-mono">npm run build</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Output Directory</span>
                  <span className="text-white font-semibold font-mono">dist</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Serverless Routing</span>
                  <span className="text-emerald-400 font-semibold font-mono">/api/* auto-handled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vercel CLI Tip */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-indigo-400" />
              Ingin Deploy Langsung Lewat Terminal / CLI?
            </span>
            <div className="p-2.5 rounded-lg bg-black border border-slate-800 font-mono text-xs text-slate-200 flex items-center justify-between">
              <span>npx vercel --prod</span>
              <button
                onClick={() => handleCopy('npx vercel --prod', 'cli')}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Salin Command"
              >
                {copiedKey === 'cli' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800/80 bg-slate-900/60 text-xs">
          <span className="text-slate-400">
            Microstock Asset Lab · Siap deploy dalam &lt; 2 menit di Vercel
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all cursor-pointer shadow-sm"
          >
            Mengerti &amp; Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
