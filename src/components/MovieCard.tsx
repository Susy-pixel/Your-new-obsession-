import React, { useState } from 'react';
import { RecommendationItem } from '../types';
import { Sparkles, ChevronDown, ChevronUp, Clock, Info, Eye } from 'lucide-react';

interface MovieCardProps {
  movie: RecommendationItem;
  rankIndex: number;
  onSelectMovie: (movieId: string) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  rankIndex,
  onSelectMovie,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative group rounded-2xl border border-white/[0.08] hover:border-violet-500/40 bg-[#0e101a] hover:bg-[#111422] transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg shadow-black/40">
      {/* Top Accent Line */}
      <div
        className="h-1 w-full bg-gradient-to-r from-transparent via-violet-500/40 to-transparent group-hover:via-cyan-400/70 transition-all"
        style={{
          background: movie.accentColor
            ? `linear-gradient(90deg, transparent, ${movie.accentColor}80, transparent)`
            : undefined,
        }}
      />

      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        {/* Top Header: Rank & Match Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-['Syne',sans-serif] font-bold text-slate-400 tracking-wider">
              MATCH #{rankIndex}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium">Affinity</span>
              <span className="font-['Syne',sans-serif] font-extrabold text-sm text-cyan-300">
                {movie.matchScore}%
              </span>
            </div>
          </div>

          {/* Title & Metadata */}
          <div>
            <h4 className="font-['Syne',sans-serif] text-xl font-bold text-white group-hover:text-violet-200 transition-colors line-clamp-1">
              {movie.title}
            </h4>

            {/* Unboxed Metadata with Typographic Separator */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 mt-1">
              <span>{movie.releaseYear}</span>
              <span aria-hidden="true">·</span>
              <span className="line-clamp-1">{movie.genre}</span>
              {movie.duration && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{movie.duration}</span>
                </>
              )}
            </div>
          </div>

          {/* Mood tag as clean editorial subtitle */}
          <div className="text-[11px] font-semibold text-violet-300 uppercase tracking-wider">
            Vibe: {movie.mood}
          </div>

          {/* Short Description */}
          <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
            {movie.shortDescription}
          </p>
        </div>

        {/* AI Match Explanation */}
        <div className="pt-3 border-t border-white/[0.06] space-y-2">
          <div className="flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {movie.whyItMatches}
            </p>
          </div>

          {/* Expandable "Why this matches you" section */}
          {isExpanded && (
            <div className="pt-2 text-xs text-slate-300 space-y-1.5 bg-black/30 p-3 rounded-xl border border-white/[0.05]">
              <span className="font-semibold text-violet-300 block text-[11px] uppercase tracking-wide">
                Semantic Overlap:
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {movie.similarityReason}
              </p>
              {movie.director && (
                <div className="text-[11px] text-slate-400 pt-1">
                  Direction by <span className="text-slate-200 font-medium">{movie.director}</span>
                </div>
              )}
            </div>
          )}

          {/* Expand Toggle & Detail Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[11px] font-semibold text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer py-1"
            >
              <span>{isExpanded ? 'Less detail' : 'Why this matches you'}</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              type="button"
              onClick={() => onSelectMovie(movie.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Inspect dossier"
            >
              <Eye className="w-4 h-4 text-violet-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
