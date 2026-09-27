import React from 'react';
import { Movie } from '../types';
import { MOVIES_DATASET } from '../data/movies';
import { X, Clock, Film, Sparkles, User, Heart, Compass, Check } from 'lucide-react';

interface MovieDetailModalProps {
  movie: Movie | null;
  onClose: () => void;
  onSelectSimilarMovie: (movieId: string) => void;
}

export const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  movie,
  onClose,
  onSelectSimilarMovie,
}) => {
  if (!movie) return null;

  // Find 3 similar movies based on genre and mood overlap
  const similarMovies = MOVIES_DATASET.filter((m) => m.id !== movie.id)
    .map((m) => {
      const genreOverlap = m.genres.filter((g) => movie.genres.includes(g)).length;
      const moodOverlap = m.moods.filter((mod) => movie.moods.includes(mod)).length;
      return {
        ...m,
        score: genreOverlap * 2 + moodOverlap * 2 + (m.director === movie.director ? 3 : 0),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
      <div className="relative w-full max-w-3xl bg-[#0c0e17] border border-white/[0.12] rounded-3xl shadow-2xl shadow-violet-950/40 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#0a0c14]/90">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-['Syne',sans-serif]">
              Film Dossier
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

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Title & Tagline */}
          <div className="space-y-2">
            <h3 className="font-['Syne',sans-serif] text-3xl sm:text-4xl font-extrabold text-white">
              {movie.title}
            </h3>

            {movie.tagline && (
              <p className="text-sm font-medium text-cyan-300 italic">
                "{movie.tagline}"
              </p>
            )}

            {/* Unboxed Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300 pt-1">
              <span>{movie.year}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{movie.genres.join(', ')}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {movie.duration}
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{movie.language}</span>
            </div>
          </div>

          {/* Director & Principal Cast */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs">
            <div>
              <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold">
                Director
              </span>
              <span className="text-sm font-semibold text-white mt-0.5 block">
                {movie.director}
              </span>
            </div>

            <div>
              <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold">
                Principal Cast
              </span>
              <span className="text-sm font-medium text-slate-200 mt-0.5 block">
                {movie.actors.join(', ')}
              </span>
            </div>
          </div>

          {/* Synopsis */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Synopsis
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {movie.description}
            </p>
          </div>

          {/* Why Someone Might Enjoy It */}
          <div className="p-5 rounded-2xl bg-violet-950/30 border border-violet-500/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Why you will enjoy it</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {movie.streamingVibe ||
                `A quintessential ${movie.genres[0]} masterwork that balances gripping ${movie.moods.join(' and ')} tones with unmatched craftsmanship.`}
            </p>
          </div>

          {/* Tonal Footprint */}
          <div className="space-y-3 pt-2 border-t border-white/[0.08]">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tonal Footprint
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.06] space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Mainstream</span>
                  <span className="text-white font-medium">{movie.mainstreamScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full"
                    style={{ width: `${movie.mainstreamScore}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.06] space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Dark Tone</span>
                  <span className="text-white font-medium">{movie.darkScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${movie.darkScore}%` }}
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-white/[0.06] space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Experimental</span>
                  <span className="text-white font-medium">{movie.experimentalScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-fuchsia-400 rounded-full"
                    style={{ width: `${movie.experimentalScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-white/[0.08]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Similar Cinematic Journeys
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {similarMovies.map((sim) => (
                  <button
                    key={sim.id}
                    onClick={() => onSelectSimilarMovie(sim.id)}
                    className="p-3 rounded-xl border border-white/[0.07] bg-[#10121d] hover:border-violet-500/40 text-left transition-all cursor-pointer group"
                  >
                    <div className="font-semibold text-xs text-white group-hover:text-cyan-300 line-clamp-1">
                      {sim.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {sim.year} · {sim.genres[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
