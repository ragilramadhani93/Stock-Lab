import React, { useState } from 'react';
import { StockAsset } from '../types';
import { Sparkles, X, Check, Layers, Sliders } from 'lucide-react';

interface VariationModalProps {
  asset: StockAsset | null;
  onClose: () => void;
  onGenerateVariation: (baseAsset: StockAsset, options: VariationOptions) => Promise<void>;
  isGenerating: boolean;
}

export interface VariationOptions {
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3';
  copySpace: 'left' | 'right' | 'top' | 'bottom' | 'center_blank';
  style: 'minimal' | 'corporate_dark' | 'clean_light' | 'isometric' | 'lifestyle';
  composition: 'wide' | 'close_up' | 'cinematic';
}

export const VariationModal: React.FC<VariationModalProps> = ({
  asset,
  onClose,
  onGenerateVariation,
  isGenerating
}) => {
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:3'>('16:9');
  const [copySpace, setCopySpace] = useState<'left' | 'right' | 'top' | 'bottom' | 'center_blank'>('right');
  const [style, setStyle] = useState<'minimal' | 'corporate_dark' | 'clean_light' | 'isometric' | 'lifestyle'>('minimal');
  const [composition, setComposition] = useState<'wide' | 'close_up' | 'cinematic'>('cinematic');

  if (!asset) return null;

  const handleGenerate = async () => {
    await onGenerateVariation(asset, { aspectRatio, copySpace, style, composition });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Create Commercial Variations
              </h3>
              <span className="text-xs text-neutral-400">
                Diversify angles & framing without triggering duplicate spam
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Base Asset Info */}
          <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/60 flex items-center justify-between">
            <span className="font-medium text-neutral-400">Base Concept:</span>
            <span className="font-semibold text-neutral-200 truncate max-w-xs">{asset.title}</span>
          </div>

          {/* Aspect Ratio Options */}
          <div className="space-y-1.5">
            <label className="font-medium text-neutral-400">Aspect Ratio & Geometry</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: '16:9', label: '16:9 (Hero)' },
                { id: '9:16', label: '9:16 (Story)' },
                { id: '1:1', label: '1:1 (Square)' },
                { id: '4:3', label: '4:3 (Deck)' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAspectRatio(opt.id as any)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                    aspectRatio === opt.id
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Copy Space Placement */}
          <div className="space-y-1.5">
            <label className="font-medium text-neutral-400">Designated Copy Space Position</label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { id: 'left', label: 'Left 40%' },
                { id: 'right', label: 'Right 40%' },
                { id: 'top', label: 'Top 35%' },
                { id: 'bottom', label: 'Bottom' },
                { id: 'center_blank', label: 'Center' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setCopySpace(opt.id as any)}
                  className={`py-2 text-[11px] font-semibold rounded-lg border transition-colors ${
                    copySpace === opt.id
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Palette & Lighting */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-medium text-neutral-400">Atmosphere & Lighting</label>
              <select
                value={style}
                onChange={e => setStyle(e.target.value as any)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="minimal">Minimal Studio</option>
                <option value="corporate_dark">Dark Slate Neon Glass</option>
                <option value="clean_light">Warm Architectural Light</option>
                <option value="isometric">Isometric Technical</option>
                <option value="lifestyle">Modern Workplace</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-neutral-400">Camera Framing</label>
              <select
                value={composition}
                onChange={e => setComposition(e.target.value as any)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-neutral-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="cinematic">Cinematic Wide Angle</option>
                <option value="wide">Environmental Wide Shot</option>
                <option value="close_up">Detailed Macro / Close-Up</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating Variation...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Differentiated Variation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
