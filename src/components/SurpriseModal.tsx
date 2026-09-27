import React, { useState, useEffect } from 'react';
import { SurpriseResponse } from '../types';
import { Sparkles, X, RefreshCw, Eye, Film, Star, Clock } from 'lucide-react';

interface SurpriseModalProps {
  isOpen: boolean;
  onClose: () => void;
  surpriseData: SurpriseResponse | null;
  isLoading: boolean;
  onRollAgain: () => void;
  onSelectMovie: (movieId: string) => void;
}

export const SurpriseModal: React.FC<SurpriseModalProps> = ({
  isOpen,
  onClose,
  surpriseData,
  isLoading,
  onRollAgain,
  onSelectMovie,
}) => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setRevealed(false);
    } else if (surpriseData) {
      const timer = setTimeout(() => setRevealed(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isLoading, surpriseData]);

  if (!isOpen) return null;

  const movie = surpriseData?.recommendation;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
      <div className="relative w-full max-w-2xl bg-[#0c0e17] border border-white/[0.12] rounded-3xl shadow-2xl shadow-cyan-950/40 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0a0c14]/90">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-white font-['Syne',sans-serif]">
              CINEMATCH WILDCARD
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8">
          {isLoading || !revealed ? (
            <div className="py-16 text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-cyan-400/50 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Film className="w-8 h-8 text-violet-400 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-cyan-400 block">
                  Tonight's wildcard...
                </span>
                <p className="text-sm text-slate-400">
                  Synthesizing an unexpected narrative journey...
                </p>
              </div>
            </div>
          ) : movie ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              {/* Wildcard Theme Kicker */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-cyan-400 font-extrabold block">
                    Tonight's Wildcard
                  </span>
                  <h4 className="text-sm font-semibold text-violet-300">
                    {surpriseData?.wildcardTheme || 'Atmospheric Masterwork'}
                  </h4>
                </div>

                <div className="px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-bold text-cyan-300">
                  {movie.matchScore}% Wildcard Affinity
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-2">
                <h3 className="font-['Syne',sans-serif] text-3xl sm:text-4xl font-extrabold text-white">
                  {movie.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span>{movie.releaseYear}</span>
                  <span aria-hidden="true">·</span>
                  <span>{movie.genre}</span>
                  {movie.duration && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {movie.duration}
                      </span>
                    </>
                  )}
                  {movie.director && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>Dir. {movie.director}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-300 leading-relaxed">
                {movie.shortDescription}
              </p>

              {/* AI Why Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] space-y-2">
                <div className="text-[11px] uppercase tracking-wider font-semibold text-violet-300">
                  Why this is your wildcard:
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "{movie.whyItMatches}"
                </p>
                <div className="text-[11px] text-slate-400 pt-1">
                  {surpriseData?.wildcardReason}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onSelectMovie(movie.id);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Full Details</span>
                </button>

                <button
                  onClick={onRollAgain}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Roll Wildcard Again</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
