export interface Movie {
  id: string;
  title: string;
  year: number;
  genres: string[];
  language: string;
  moods: string[];
  description: string;
  director: string;
  actors: string[];
  mainstreamScore: number; // 0 (indie/arthouse) to 100 (global blockbuster)
  darkScore: number; // 0 (bright/uplifting) to 100 (dark/gritty/nihilistic)
  experimentalScore: number; // 0 (traditional structure) to 100 (surreal/avant-garde)
  duration: string;
  accentColor: string; // e.g. '#8b5cf6'
  tagline?: string;
  streamingVibe?: string;
}

export interface UserPreferences {
  moods: string[];
  genres: string[];
  favoriteMovie: string;
  language: string;
  era: string; // 'Any' | 'Classic (Pre-1980)' | '80s-90s' | '2000s' | '2010s' | '2020s'
  favoriteActorDirector: string;
  mainstreamScore: number; // 0 to 100 (Underrated to Mainstream)
  darkScore: number; // 0 to 100 (Light to Dark)
  experimentalScore: number; // 0 to 100 (Familiar to Experimental)
}

export interface ScoredMovie extends Movie {
  matchScore: number; // 0 to 100
  matchBreakdown: {
    genreMatch: number;
    moodMatch: number;
    languageMatch: number;
    eraMatch: number;
    talentMatch: number;
    sliderAffinity: number;
  };
}

export interface RecommendationItem {
  id: string;
  title: string;
  releaseYear: number;
  genre: string;
  shortDescription: string;
  whyItMatches: string;
  mood: string;
  language: string;
  similarityReason: string;
  confidenceLevel: 'Exceptional Match' | 'Strong Match' | 'Curated Wildcard';
  matchScore: number;
  accentColor?: string;
  director?: string;
  actors?: string[];
  duration?: string;
}

export interface RecommendationResponse {
  tasteProfileTitle: string; // e.g. "Emotion-Driven Sci-Fi Architect"
  tasteProfileSummary: string;
  dnaTags: string[]; // e.g. ["Mind-Bending", "Character Driven", "Dark", "Sci-Fi"]
  featuredRecommendation: RecommendationItem;
  recommendations: RecommendationItem[];
  isLocalFallback?: boolean;
  generatedAt: string;
}

export interface SurpriseResponse {
  recommendation: RecommendationItem;
  wildcardTheme: string;
  wildcardReason: string;
  isLocalFallback?: boolean;
}
