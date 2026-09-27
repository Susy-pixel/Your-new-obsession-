import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Check,
  Film,
  Sun,
  Layers,
  Zap,
  Flame,
  Heart,
  Laugh,
  Eye,
  Ghost,
  Compass,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { UserPreferences } from '../types';
import { MOVIES_DATASET } from '../data/movies';

interface TasteCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (preferences: UserPreferences) => void;
  initialPreferences?: UserPreferences | null;
}

const POPULAR_MOODS = [
  { id: 'Feel Good', label: 'Feel Good', icon: Sun },
  { id: 'Mind-Bending', label: 'Mind-Bending', icon: Layers },
  { id: 'Thrilling', label: 'Thrilling', icon: Zap },
  { id: 'Dark', label: 'Dark', icon: Flame },
  { id: 'Emotional', label: 'Emotional', icon: Heart },
  { id: 'Funny', label: 'Funny', icon: Laugh },
  { id: 'Inspiring', label: 'Inspiring', icon: Eye },
  { id: 'Chilling', label: 'Chilling', icon: Ghost },
];

const POPULAR_GENRES = [
  'Sci-Fi',
  'Action',
  'Thriller',
  'Drama',
  'Comedy',
  'Mystery',
  'Romance',
  'Adventure',
  'Horror',
  'Animation',
];

const QUICK_MOVIES = [
  'Inception',
  'Interstellar',
  'Parasite',
  'Blade Runner 2049',
  'Whiplash',
  'Spirited Away',
  'Everything Everywhere All at Once',
];

export const TasteCreator: React.FC<TasteCreatorProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialPreferences,
}) => {
  const [selectedMood, setSelectedMood] = useState<string>(
    initialPreferences?.moods?.[0] || 'Mind-Bending'
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    initialPreferences?.genres?.length ? initialPreferences.genres : ['Sci-Fi']
  );
  const [favoriteMovie, setFavoriteMovie] = useState<string>(
    initialPreferences?.favoriteMovie || ''
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced optional settings
  const [language, setLanguage] = useState<string>(
    initialPreferences?.language || 'Any'
  );
  const [era, setEra] = useState<string>(initialPreferences?.era || 'Any');
  const [favoriteActorDirector, setFavoriteActorDirector] = useState<string>(
    initialPreferences?.favoriteActorDirector || ''
  );
  const [mainstreamScore, setMainstreamScore] = useState<number>(
    initialPreferences?.mainstreamScore ?? 50
  );
  const [darkScore, setDarkScore] = useState<number>(
    initialPreferences?.darkScore ?? 50
  );
  const [experimentalScore, setExperimentalScore] = useState<number>(
    initialPreferences?.experimentalScore ?? 50
  );

  if (!isOpen) return null;

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.length > 1
          ? prev.filter((g) => g !== genre)
          : prev
        : [...prev, genre]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      moods: [selectedMood],
      genres: selectedGenres,
      favoriteMovie: favoriteMovie.trim(),
      language,
      era,
      favoriteActorDirector: favoriteActorDirector.trim(),
      mainstreamScore,
      darkScore,
      experimentalScore,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all">
      <div className="relative w-full max-w-2xl bg-[#0c0e17] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/[0.08] flex items-center justify-between bg-[#0a0c14]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Syne',sans-serif]">
                Build Your Movie Taste
              </h2>
              <p className="text-xs text-slate-400">
                Simple, fast, and personalized in 3 steps
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. What's your mood tonight? */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-violet-400 block">
              1. What's your mood tonight?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {POPULAR_MOODS.map((m) => {
                const Icon = m.icon;
                const active = selectedMood === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMood(m.id)}
                    className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      active
                        ? 'bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-600/30'
                        : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Pick your favorite genres */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                2. Pick 1 or more genres
              </label>
              <span className="text-[11px] text-slate-400">
                {selectedGenres.length} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_GENRES.map((genre) => {
                const active = selectedGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      active
                        ? 'bg-cyan-600 border-cyan-400 text-white shadow-md shadow-cyan-600/20'
                        : 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Tell us one movie you like */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-fuchsia-400 block">
              3. Tell us one movie you like (Optional)
            </label>
            <input
              type="text"
              value={favoriteMovie}
              onChange={(e) => setFavoriteMovie(e.target.value)}
              placeholder="e.g. Inception, Interstellar, Parasite, Whiplash..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/[0.12] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
            />

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-400">
              <span className="text-[11px] text-slate-500">Quick suggestions:</span>
              {QUICK_MOVIES.slice(0, 4).map((title) => (
                <button
                  key={title}
                  type="button"
                  onClick={() => setFavoriteMovie(title)}
                  className={`text-[11px] px-2 py-0.5 rounded-md hover:text-white cursor-pointer ${
                    favoriteMovie === title
                      ? 'text-cyan-300 font-bold underline'
                      : 'text-slate-400'
                  }`}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Advanced Settings Toggle */}
          <div className="pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer py-1"
            >
              <span>{showAdvanced ? 'Hide fine-tuning' : 'Optional fine-tuning (Language, Era, Tone)'}</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showAdvanced && (
              <div className="pt-4 space-y-4 text-xs animate-in fade-in duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/[0.1] text-white text-xs"
                    >
                      <option value="Any">Any Language (Global)</option>
                      <option value="English">English</option>
                      <option value="Korean">Korean</option>
                      <option value="Japanese">Japanese</option>
                      <option value="French">French</option>
                      <option value="Spanish">Spanish</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Release Era</label>
                    <select
                      value={era}
                      onChange={(e) => setEra(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/[0.1] text-white text-xs"
                    >
                      <option value="Any">Any Era</option>
                      <option value="2020s">2020s</option>
                      <option value="2010s">2010s</option>
                      <option value="2000s">2000s</option>
                      <option value="80s-90s">80s-90s</option>
                      <option value="Classic (Pre-1980)">Classic (Pre-1980)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Favorite Director or Actor</label>
                  <input
                    type="text"
                    value={favoriteActorDirector}
                    onChange={(e) => setFavoriteActorDirector(e.target.value)}
                    placeholder="e.g. Christopher Nolan, Denis Villeneuve..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/[0.1] text-white text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-white/[0.08]">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-sm tracking-wide shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>FIND MATCHING MOVIES</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
