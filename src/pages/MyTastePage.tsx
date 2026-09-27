import React from 'react';
import { UserPreferences, RecommendationResponse } from '../types';
import { Dna, SlidersHorizontal, Sparkles, Clock, Trash2, ArrowRight, Eye, Film } from 'lucide-react';
import { clearCinematicData } from '../services/api';

interface MyTastePageProps {
  preferences: UserPreferences | null;
  history: RecommendationResponse[];
  onOpenTasteCreator: () => void;
  onSelectRecommendationBatch: (batch: RecommendationResponse) => void;
  onClearData: () => void;
  onSelectMovie: (movieId: string) => void;
}

export const MyTastePage: React.FC<MyTastePageProps> = ({
  preferences,
  history,
  onOpenTasteCreator,
  onSelectRecommendationBatch,
  onClearData,
  onSelectMovie,
}) => {
  // Determine cinematic personality archetype based on preferences
  const getPersonalityArchetype = (prefs: UserPreferences | null) => {
    if (!prefs) return 'THE EXPLORER';
    if (prefs.experimentalScore > 70 && prefs.moods.includes('Mind-Bending')) {
      return 'THE VISIONARY SURREALIST';
    }
    if (prefs.darkScore > 70 && (prefs.genres.includes('Crime') || prefs.moods.includes('Dark'))) {
      return 'THE NEO-NOIR REALIST';
    }
    if (prefs.genres.includes('Sci-Fi') && prefs.moods.includes('Mind-Bending')) {
      return 'THE COSMIC METAPHYSICIAN';
    }
    if (prefs.moods.includes('Emotional') && prefs.genres.includes('Drama')) {
      return 'THE HUMANIST STORYTELLER';
    }
    if (prefs.moods.includes('Thrilling') || prefs.genres.includes('Action')) {
      return 'THE KINETIC ADRENALIST';
    }
    if (prefs.mainstreamScore < 40) {
      return 'THE ARTHOUSE CONNOISSEUR';
    }
    return 'THE EXPLORER';
  };

  const archetype = getPersonalityArchetype(preferences);

  const getViewingStyleDescription = (prefs: UserPreferences | null) => {
    if (!prefs) return 'Eclectic and open-minded';
    const parts: string[] = [];
    if (prefs.experimentalScore > 65) parts.push('Experimental & Complex Structure');
    else if (prefs.experimentalScore < 40) parts.push('Classical Linear Narrative');
    else parts.push('Balanced Artful Narrative');

    if (prefs.darkScore > 65) parts.push('Deep Psychological Darkness');
    else if (prefs.darkScore < 40) parts.push('Luminous & Cathartic');

    if (prefs.mainstreamScore < 40) parts.push('Arthouse / Hidden Gems Preference');
    else if (prefs.mainstreamScore > 70) parts.push('High-Production Spectacle');

    return parts.join(' · ');
  };

  return (
    <div className="space-y-12 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/20 text-xs font-semibold text-violet-300">
            <Dna className="w-3.5 h-3.5 text-cyan-400" />
            <span>Session Cinematic Dossier</span>
          </div>
          <h1 className="font-['Syne',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            My Taste Profile
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            Persisted in your local browser sandbox. No sign-up required.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenTasteCreator}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-violet-200" />
            <span>{preferences ? 'Recalibrate Profile' : 'Build Profile'}</span>
          </button>

          {(preferences || history.length > 0) && (
            <button
              onClick={onClearData}
              className="p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-colors cursor-pointer"
              title="Clear taste profile & history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Visual Taste Profile Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0c0e17] p-8 sm:p-12 shadow-2xl shadow-black/60">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Archetype Hero */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-violet-400 font-extrabold block">
              Your Cinematic Personality
            </span>
            <h2 className="font-['Syne',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-violet-300">
              {archetype}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Viewing Style: <span className="text-cyan-300 font-medium">{getViewingStyleDescription(preferences)}</span>
            </p>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/[0.08]">
            {/* 1. Favorite Moods */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Favorite Moods
              </span>
              <div className="text-sm font-semibold text-white">
                {preferences?.moods?.length
                  ? preferences.moods.join(' · ')
                  : 'Thrilling · Emotional · Mind-Bending'}
              </div>
            </div>

            {/* 2. Favorite Genres */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Favorite Genres
              </span>
              <div className="text-sm font-semibold text-white">
                {preferences?.genres?.length
                  ? preferences.genres.join(' · ')
                  : 'Sci-Fi · Mystery · Drama'}
              </div>
            </div>

            {/* 3. Narrative Anchor */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Narrative Anchor Film
              </span>
              <div className="text-sm font-semibold text-violet-300">
                {preferences?.favoriteMovie || 'Inception (Default baseline)'}
              </div>
            </div>
          </div>

          {/* Sliders Calibration Summary */}
          {preferences && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.06] text-xs">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Mainstream Index</span>
                  <span className="text-white font-medium">{preferences.mainstreamScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-500 rounded-full"
                    style={{ width: `${preferences.mainstreamScore}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Dark Tone Index</span>
                  <span className="text-white font-medium">{preferences.darkScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${preferences.darkScore}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06] space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Experimental Index</span>
                  <span className="text-white font-medium">{preferences.experimentalScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-fuchsia-400 rounded-full"
                    style={{ width: `${preferences.experimentalScore}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Recommendation Batches */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-['Syne',sans-serif] text-2xl font-bold text-white">
              Session Recommendation History
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Previously generated AI recommendation collections from this device.
            </p>
          </div>
        </div>

        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map((batch, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-[#0c0e17] border border-white/[0.08] hover:border-violet-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>
                      {new Date(batch.generatedAt || Date.now()).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-violet-300 font-medium">
                      {batch.recommendations.length + 1} films curated
                    </span>
                  </div>

                  <h4 className="font-['Syne',sans-serif] text-xl font-bold text-white">
                    "{batch.tasteProfileTitle}"
                  </h4>

                  <p className="text-xs text-slate-300 line-clamp-1 max-w-2xl">
                    {batch.tasteProfileSummary}
                  </p>

                  {/* Highlight film names */}
                  <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-400">
                    <span className="text-cyan-300 font-semibold">
                      Featured: {batch.featuredRecommendation.title}
                    </span>
                    <span>·</span>
                    <span>
                      {batch.recommendations.map((m) => m.title).slice(0, 3).join(', ')}...
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onSelectRecommendationBatch(batch)}
                    className="px-5 py-2.5 rounded-xl bg-violet-600/80 hover:bg-violet-600 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Load Recommendations</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-4 rounded-3xl bg-[#0c0e17] border border-white/[0.08]">
            <Film className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-lg font-bold text-white font-['Syne',sans-serif]">
              No recommendations generated yet
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Use the Taste Creator to analyze your cinematic DNA and generate your first batch.
            </p>
            <button
              onClick={onOpenTasteCreator}
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold cursor-pointer"
            >
              Build My Taste
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
