import React, { useState, useMemo } from 'react';
import { Movie } from '../types';
import { MOVIES_DATASET } from '../data/movies';
import { Search, Filter, Clock, Eye, Film, Sparkles, X } from 'lucide-react';

interface DiscoverPageProps {
  onSelectMovie: (movieId: string) => void;
}

const GENRES = [
  'All',
  'Sci-Fi',
  'Drama',
  'Action',
  'Thriller',
  'Comedy',
  'Mystery',
  'Adventure',
  'Romance',
  'Horror',
  'Animation',
  'Crime',
];

const MOODS = [
  'All',
  'Mind-Bending',
  'Emotional',
  'Thrilling',
  'Dark',
  'Feel Good',
  'Inspiring',
  'Funny',
  'Chilling',
  'Romantic',
];

const ERAS = [
  { label: 'All Eras', value: 'all' },
  { label: '2020s', value: '2020s' },
  { label: '2010s', value: '2010s' },
  { label: '2000s', value: '2000s' },
  { label: '80s-90s', value: '80s-90s' },
  { label: 'Classic (Pre-1980)', value: 'classic' },
];

const LANGUAGES = [
  'All',
  'English',
  'Korean',
  'Japanese',
  'French',
  'Spanish',
  'Hindi',
  'Italian',
  'Cantonese',
];

export const DiscoverPage: React.FC<DiscoverPageProps> = ({ onSelectMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedMood, setSelectedMood] = useState('All');
  const [selectedEra, setSelectedEra] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  const filteredMovies = useMemo(() => {
    return MOVIES_DATASET.filter((movie) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = movie.title.toLowerCase().includes(q);
        const matchesDirector = movie.director.toLowerCase().includes(q);
        const matchesActor = movie.actors.some((a) => a.toLowerCase().includes(q));
        const matchesDesc = movie.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDirector && !matchesActor && !matchesDesc) {
          return false;
        }
      }

      // 2. Genre Filter
      if (selectedGenre !== 'All' && !movie.genres.includes(selectedGenre)) {
        return false;
      }

      // 3. Mood Filter
      if (selectedMood !== 'All' && !movie.moods.includes(selectedMood)) {
        return false;
      }

      // 4. Language Filter
      if (selectedLanguage !== 'All' && movie.language.toLowerCase() !== selectedLanguage.toLowerCase()) {
        return false;
      }

      // 5. Era Filter
      if (selectedEra === '2020s' && movie.year < 2020) return false;
      if (selectedEra === '2010s' && (movie.year < 2010 || movie.year >= 2020)) return false;
      if (selectedEra === '2000s' && (movie.year < 2000 || movie.year >= 2010)) return false;
      if (selectedEra === '80s-90s' && (movie.year < 1980 || movie.year >= 2000)) return false;
      if (selectedEra === 'classic' && movie.year >= 1980) return false;

      return true;
    });
  }, [searchQuery, selectedGenre, selectedMood, selectedEra, selectedLanguage]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSelectedMood('All');
    setSelectedEra('all');
    setSelectedLanguage('All');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedGenre !== 'All' ||
    selectedMood !== 'All' ||
    selectedEra !== 'all' ||
    selectedLanguage !== 'All';

  return (
    <div className="space-y-10 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/40 border border-violet-500/20 text-xs font-semibold text-violet-300">
          <Film className="w-3.5 h-3.5 text-cyan-400" />
          <span>Curated Cinematic Archive</span>
        </div>
        <h1 className="font-['Syne',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
          Movie Explorer
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
          Browse verified landmark films across genres, directors, eras, and emotional wavelengths.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-6 p-6 rounded-3xl bg-[#0c0e17] border border-white/[0.08] shadow-xl shadow-black/40">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, director, cast (e.g. Nolan, DiCaprio, Denis Villeneuve)..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-slate-900 border border-white/[0.1] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Era Filter */}
          <div className="space-y-1">
            <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Release Era
            </label>
            <select
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/[0.1] text-white text-xs focus:outline-none focus:border-violet-500"
            >
              {ERAS.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div className="space-y-1">
            <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/[0.1] text-white text-xs focus:outline-none focus:border-violet-500"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l === 'All' ? 'All Languages' : l}
                </option>
              ))}
            </select>
          </div>

          {/* Mood Filter */}
          <div className="space-y-1">
            <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Vibe / Mood
            </label>
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/[0.1] text-white text-xs focus:outline-none focus:border-violet-500"
            >
              {MOODS.map((m) => (
                <option key={m} value={m}>
                  {m === 'All' ? 'All Moods' : m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Genre Filter Buttons */}
        <div className="space-y-2 pt-2 border-t border-white/[0.06]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Filter by Genre:</span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Reset all filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => {
              const active = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                      : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid Status Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <span className="text-white font-bold">{filteredMovies.length}</span> films
        </span>
        <span>Click any title for deep narrative analysis</span>
      </div>

      {/* Movies Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onSelectMovie(movie.id)}
              className="group relative rounded-2xl border border-white/[0.08] hover:border-violet-500/40 bg-[#0e101a] hover:bg-[#121524] p-5 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-lg shadow-black/40 hover:-translate-y-1"
            >
              {/* Card Top */}
              <div className="space-y-3">
                {/* Year and Mood */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">{movie.year}</span>
                  <span className="text-[11px] font-medium text-cyan-300">
                    {movie.moods[0]}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-['Syne',sans-serif] font-bold text-lg text-white group-hover:text-violet-200 transition-colors line-clamp-1">
                  {movie.title}
                </h3>

                {/* Unboxed Metadata with Typographic Separators */}
                <div className="text-xs text-slate-400 line-clamp-1">
                  {movie.genres.join(' · ')}
                </div>

                {/* Short Synopsis */}
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {movie.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                <span className="line-clamp-1 font-medium text-slate-300">
                  Dir. {movie.director}
                </span>

                <div className="flex items-center gap-1 text-violet-400 group-hover:text-cyan-300 font-semibold shrink-0">
                  <span>Dossier</span>
                  <Eye className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 rounded-3xl bg-[#0c0e17] border border-white/[0.08]">
          <Film className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-xl font-bold text-white font-['Syne',sans-serif]">
            No films match your search
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Try broadening your search query or reset the genre, mood, and era filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
