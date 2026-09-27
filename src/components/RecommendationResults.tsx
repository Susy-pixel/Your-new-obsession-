import React from 'react';
import { RecommendationResponse } from '../types';
import { FeaturedMovie } from './FeaturedMovie';
import { MovieCard } from './MovieCard';
import { Dna, Sparkles, RefreshCw, SlidersHorizontal, CheckCircle2, AlertCircle } from 'lucide-react';

interface RecommendationResultsProps {
  results: RecommendationResponse;
  onRefineTaste: () => void;
  onSelectMovie: (movieId: string) => void;
}

export const RecommendationResults: React.FC<RecommendationResultsProps> = ({
  results,
  onRefineTaste,
  onSelectMovie,
}) => {
  return (
    <section className="space-y-12 py-10">
      {/* Top Banner: YOUR CINEMATIC DNA */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0c0e17] p-8 sm:p-12 shadow-2xl shadow-black/60">
        {/* Glow ambient spots */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-violet-600/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-cyan-500/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-xs font-semibold text-violet-200">
              <Dna className="w-3.5 h-3.5 text-cyan-400" />
              <span>YOUR CINEMATIC DNA</span>
            </div>

            {results.isLocalFallback && (
              <div className="flex items-center gap-2 text-xs text-amber-300/90 font-medium">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>CINEMATCH Deterministic Matching Engine</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold block">
              Taste Profile
            </span>
            <h2 className="font-['Syne',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-cyan-300">
              "{results.tasteProfileTitle}"
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              {results.tasteProfileSummary}
            </p>
          </div>

          {/* DNA Tags rendered with subtle hairline containers rather than candy pills */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            {results.dnaTags.map((tag, idx) => (
              <div
                key={idx}
                className="px-3.5 py-1.5 rounded-lg border border-white/[0.1] bg-white/[0.03] text-xs font-medium text-slate-200 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <span>{tag}</span>
              </div>
            ))}
          </div>

          {/* Action Refine Button */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between flex-wrap gap-4">
            <span className="text-xs text-slate-400">
              Analysis calibrated across your selected genre, mood & tonal metrics.
            </span>

            <button
              onClick={onRefineTaste}
              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 transition-all cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Refine Preferences</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Recommendation */}
      {results.featuredRecommendation && (
        <div className="space-y-4">
          <FeaturedMovie
            movie={results.featuredRecommendation}
            onSelectMovie={onSelectMovie}
          />
        </div>
      )}

      {/* 5 Additional Recommendations to make 6 movies */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-['Syne',sans-serif] text-2xl sm:text-3xl font-bold text-white">
              6 MOVIES THAT MATCH YOUR DNA
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Curated by deep semantic alignment and stylistic coherence.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.recommendations.map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              rankIndex={index + 2}
              onSelectMovie={onSelectMovie}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
