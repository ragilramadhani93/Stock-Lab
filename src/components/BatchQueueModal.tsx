import React, { useState } from 'react';
import { ContentType, Platform, ResearchOpportunity, StockAsset } from '../types';
import {
  X,
  Play,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface BatchQueueModalProps {
  onClose: () => void;
  onRunBatch: (params: { count: number; category: string; contentType: ContentType }) => Promise<void>;
  isProcessing: boolean;
}

export const BatchQueueModal: React.FC<BatchQueueModalProps> = ({
  onClose,
  onRunBatch,
  isProcessing
}) => {
  const [batchCount, setBatchCount] = useState<number>(5);
  const [category, setCategory] = useState<string>('AI & Cybersecurity');
  const [contentType, setContentType] = useState<ContentType>('vector');
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    'Researching high-demand commercial topics',
    'Calculating 7-factor opportunity scores',
    'Synthesizing stock-safe prompts with negative space',
    'Generating vector/raster assets with zero trademarks',
    'Running anatomy, typography & duplicate QC audits',
    'Optimizing layered Adobe & Shutterstock metadata'
  ];

  const handleStart = async () => {
    setCurrentStep(1);
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < 5 ? prev + 1 : prev));
    }, 1200);

    try {
      await onRunBatch({ count: batchCount, category, contentType });
    } finally {
      clearInterval(interval);
      setCurrentStep(6);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Batch Production Queue
              </h3>
              <span className="text-xs text-neutral-400">
                Automated end-to-end pipeline from research to export
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isProcessing ? (
          <div className="py-6 space-y-5 text-center">
            <div className="w-12 h-12 rounded-full border-3 border-indigo-500/20 border-t-indigo-500 animate-spin mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-white">
                {steps[Math.min(currentStep, steps.length - 1)]}
              </h4>
              <p className="text-xs text-neutral-400">
                Processing {batchCount} differentiated stock assets...
              </p>
            </div>

            {/* Progress Step Bar */}
            <div className="w-full bg-neutral-950 rounded-full h-2 overflow-hidden border border-neutral-800">
              <div
                className="bg-indigo-500 h-full transition-all duration-500"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5 text-xs">
              <label className="font-medium text-neutral-400">Commercial Niche / Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="AI & Cybersecurity">AI & Cybersecurity</option>
                <option value="Clean Energy Transition">Clean Energy & ESG</option>
                <option value="Fintech & Wealth">Fintech & Wealth Management</option>
                <option value="Telemedicine & Digital Health">Telemedicine & Health</option>
                <option value="Supply Chain & Automation">Supply Chain & Automation</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-medium text-neutral-400">Format</label>
                <select
                  value={contentType}
                  onChange={e => setContentType(e.target.value as any)}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="vector">Editable Vector SVG</option>
                  <option value="photo">Stock Photography</option>
                  <option value="illustration">Flat Illustration</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-neutral-400">Batch Quantity</label>
                <div className="flex items-center gap-1.5">
                  {[3, 5, 10].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setBatchCount(cnt)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                        batchCount === cnt
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cost & Efficiency Estimation */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 space-y-1.5 text-xs text-neutral-400">
              <div className="flex items-center justify-between">
                <span>Estimated Production Cost:</span>
                <span className="font-mono tabular-nums text-emerald-400 font-semibold">
                  ~${(batchCount * 0.0012).toFixed(4)} USD
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Duplicate Prevention:</span>
                <span className="text-neutral-200 font-medium">Automatic 80% similarity threshold</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Platform Metadata:</span>
                <span className="text-neutral-200 font-medium">Adobe & Shutterstock CSVs ready</span>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 text-xs font-semibold shadow-sm transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Batch Production ({batchCount} Assets)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
