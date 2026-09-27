import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TasteCreator } from './components/TasteCreator';
import { LoadingAnimation } from './components/LoadingAnimation';
import { RecommendationResults } from './components/RecommendationResults';
import { SurpriseModal } from './components/SurpriseModal';
import { MovieDetailModal } from './components/MovieDetailModal';
import { DiscoverPage } from './pages/DiscoverPage';
import { MyTastePage } from './pages/MyTastePage';
import { AboutPage } from './pages/AboutPage';
import { Footer } from './components/Footer';
import {
  RecommendationResponse,
  SurpriseResponse,
  UserPreferences,
  Movie,
} from './types';
import { MOVIES_DATASET } from './data/movies';
import {
  fetchRecommendations,
  fetchSurpriseMe,
  getSavedPreferences,
  getRecommendationHistory,
  clearCinematicData,
} from './services/api';
import { Sparkles, Dna, ArrowRight, Film } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'discover' | 'taste' | 'about'>('home');
  const [isTasteCreatorOpen, setIsTasteCreatorOpen] = useState(false);
  const [isSurpriseModalOpen, setIsSurpriseModalOpen] = useState(false);
  const [isSurpriseLoading, setIsSurpriseLoading] = useState(false);
  const [surpriseData, setSurpriseData] = useState<SurpriseResponse | null>(null);

  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [history, setHistory] = useState<RecommendationResponse[]>([]);

  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  // Load saved session data on mount
  useEffect(() => {
    const savedPrefs = getSavedPreferences();
    if (savedPrefs) {
      setUserPreferences(savedPrefs);
    }
    const savedHistory = getRecommendationHistory();
    if (savedHistory.length > 0) {
      setHistory(savedHistory);
      setRecommendations(savedHistory[0]);
    }
  }, []);

  const handleTasteSubmit = async (preferences: UserPreferences) => {
    setIsTasteCreatorOpen(false);
    setActiveTab('home');
    setIsLoadingRecommendations(true);
    setUserPreferences(preferences);

    try {
      const result = await fetchRecommendations(preferences);
      setRecommendations(result);
      setHistory(getRecommendationHistory());
      // Smooth scroll to recommendations
      setTimeout(() => {
        const el = document.getElementById('recommendations-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Failed to generate recommendations:', err);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  // Quick 1-click match from Hero
  const handleQuickMatch = (mood: string) => {
    const quickPrefs: UserPreferences = {
      moods: [mood],
      genres: ['Sci-Fi', 'Drama'],
      favoriteMovie: '',
      language: 'Any',
      era: 'Any',
      favoriteActorDirector: '',
      mainstreamScore: 50,
      darkScore: 50,
      experimentalScore: 50,
    };
    handleTasteSubmit(quickPrefs);
  };

  const handleTriggerSurprise = async () => {
    setIsSurpriseModalOpen(true);
    setIsSurpriseLoading(true);
    try {
      const data = await fetchSurpriseMe();
      setSurpriseData(data);
    } catch (err) {
      console.error('Failed to trigger wildcard surprise:', err);
    } finally {
      setIsSurpriseLoading(false);
    }
  };

  const handleRollWildcardAgain = async () => {
    setIsSurpriseLoading(true);
    try {
      const data = await fetchSurpriseMe();
      setSurpriseData(data);
    } catch (err) {
      console.error('Failed to roll wildcard again:', err);
    } finally {
      setIsSurpriseLoading(false);
    }
  };

  const handleClearAllData = () => {
    clearCinematicData();
    setUserPreferences(null);
    setHistory([]);
    setRecommendations(null);
  };

  const handleSelectHistoryBatch = (batch: RecommendationResponse) => {
    setRecommendations(batch);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedMovie: Movie | null = selectedMovieId
    ? MOVIES_DATASET.find((m) => m.id === selectedMovieId) || null
    : null;

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col selection:bg-violet-600/30 selection:text-violet-200">
      {/* Top Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTasteCreator={() => setIsTasteCreatorOpen(true)}
        onTriggerSurprise={handleTriggerSurprise}
        isSurpriseLoading={isSurpriseLoading}
      />

      {/* Main Views */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            {/* Hero Section */}
            <Hero
              onOpenTasteCreator={() => setIsTasteCreatorOpen(true)}
              onTriggerSurprise={handleTriggerSurprise}
              onQuickMatch={handleQuickMatch}
              isSurpriseLoading={isSurpriseLoading}
            />

            {/* Recommendations or Starter Section */}
            <div id="recommendations-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {isLoadingRecommendations ? (
                <LoadingAnimation />
              ) : recommendations ? (
                <RecommendationResults
                  results={recommendations}
                  onRefineTaste={() => setIsTasteCreatorOpen(true)}
                  onSelectMovie={(id) => setSelectedMovieId(id)}
                />
              ) : (
                /* Starter Showcase */
                <section className="py-12 space-y-8 border-t border-white/[0.06]">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Curated Starting Picks</span>
                      </div>
                      <h2 className="font-['Syne',sans-serif] text-2xl sm:text-3xl font-bold text-white">
                        Masterpieces in the Library
                      </h2>
                    </div>

                    <button
                      onClick={() => setIsTasteCreatorOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto"
                    >
                      <Dna className="w-4 h-4" />
                      <span>Match My Taste</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {MOVIES_DATASET.slice(0, 4).map((movie) => (
                      <div
                        key={movie.id}
                        onClick={() => setSelectedMovieId(movie.id)}
                        className="p-5 rounded-2xl bg-[#0d0f19] border border-white/[0.08] hover:border-violet-500/40 transition-all cursor-pointer group flex flex-col justify-between space-y-3 shadow-lg"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs text-slate-400">
                            <span>{movie.year}</span>
                            <span className="text-cyan-400 font-medium">{movie.moods[0]}</span>
                          </div>
                          <h3 className="font-['Syne',sans-serif] font-bold text-base text-white group-hover:text-violet-200 line-clamp-1">
                            {movie.title}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {movie.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/[0.06] text-xs text-violet-400 flex items-center justify-between font-semibold">
                          <span>Dir. {movie.director.split(' ')[0]}</span>
                          <span className="group-hover:translate-x-1 transition-transform">Explore →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}

        {activeTab === 'discover' && (
          <DiscoverPage onSelectMovie={(id) => setSelectedMovieId(id)} />
        )}

        {activeTab === 'taste' && (
          <MyTastePage
            preferences={userPreferences}
            history={history}
            onOpenTasteCreator={() => setIsTasteCreatorOpen(true)}
            onSelectRecommendationBatch={handleSelectHistoryBatch}
            onClearData={handleClearAllData}
            onSelectMovie={(id) => setSelectedMovieId(id)}
          />
        )}

        {activeTab === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />

      {/* Streamlined Taste Creator Modal */}
      <TasteCreator
        isOpen={isTasteCreatorOpen}
        onClose={() => setIsTasteCreatorOpen(false)}
        onSubmit={handleTasteSubmit}
        initialPreferences={userPreferences}
      />

      {/* Surprise Me Wildcard Modal */}
      <SurpriseModal
        isOpen={isSurpriseModalOpen}
        onClose={() => setIsSurpriseModalOpen(false)}
        surpriseData={surpriseData}
        isLoading={isSurpriseLoading}
        onRollAgain={handleRollWildcardAgain}
        onSelectMovie={(id) => setSelectedMovieId(id)}
      />

      {/* Movie Detail Modal */}
      <MovieDetailModal
        movie={selectedMovie}
        onClose={() => setSelectedMovieId(null)}
        onSelectSimilarMovie={(id) => setSelectedMovieId(id)}
      />
    </div>
  );
}
