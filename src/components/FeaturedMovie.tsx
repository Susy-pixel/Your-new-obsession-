import React from 'react';
import { RecommendationItem } from '../types';
import { Sparkles, Star, Film, Clock, User, ChevronRight, Eye } from 'lucide-react';

interface FeaturedMovieProps {
  movie: RecommendationItem;
  onSelectMovie: (movieId: string) => void;
}

export const FeaturedMovie: React.FC<FeaturedMovieProps> = ({ movie, onSelectMovie }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-br from-[#121524] via-[#0d0f1a] to-[#090b12] p-6 sm:p-10 shadow-2xl shadow-violet-950/40">
      {/* Background radial spotlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Decorative film edge */}
      <div className="absolute top-0 left-0 right-0 h-1.5 film-strip-edge opacity-30" />

      <div className="relative z-10 space-y-6">
        {/* Kicker Header & Match Percentage */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.25em] text-cyan-300 font-extrabold font-['Syne',sans-serif]">
              THE ONE YOU SHOULD TRY FIRST
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
                AI Match Index
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-cyan-300 font-['Syne',sans-serif]">
                {movie.matchScore}%
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-violet-900/40 border border-violet-400/30 flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
          </div>
        </div>

        {/* Title & Metadata */}
        <div className="space-y-3">
          <h3 className="font-['Syne',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {movie.title}
          </h3>

          {/* Clean Unboxed Metadata with Typographic Separators */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
            <span>{movie.releaseYear}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{movie.genre}</span>
            {movie.duration && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {movie.duration}
                </span>
              </>
            )}
            {movie.director && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>Dir. {movie.director}</span>
              </>
            )}
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-violet-300 font-semibold">{movie.mood}</span>
          </div>
        </div>

        {/* Synopsis */}
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          {movie.shortDescription}
        </p>

        {/* Why CINEMATCH Picked This */}
        <div className="p-5 sm:p-6 rounded-2xl bg-black/40 border border-white/[0.08] backdrop-blur-md space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Why CINEMATCH picked this for you</span>
          </div>
          <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed italic">
            "{movie.whyItMatches}"
          </p>
          <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
            <span className="font-medium text-slate-300">Key Affinity:</span>
            <span>{movie.similarityReason}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-wrap items-center gap-4">
          <button
            onClick={() => onSelectMovie(movie.id)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-violet-200" />
            <span>View Complete Dossier & Cast</span>
            <ChevronRight className="w-4 h-4 text-cyan-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
