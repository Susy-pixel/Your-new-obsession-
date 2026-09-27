import { Movie, ScoredMovie, UserPreferences, RecommendationItem, RecommendationResponse, SurpriseResponse } from '../types';
import { MOVIES_DATASET } from '../data/movies';

export function calculateMovieScores(
  preferences: UserPreferences,
  movies: Movie[] = MOVIES_DATASET
): ScoredMovie[] {
  const scored = movies.map((movie) => {
    // 1. Genre Score (0 - 28 pts)
    let genreMatchPoints = 0;
    if (preferences.genres.length > 0) {
      const matchingGenres = movie.genres.filter((g) =>
        preferences.genres.some((prefG) => prefG.toLowerCase() === g.toLowerCase())
      );
      const genreRatio = matchingGenres.length / Math.min(preferences.genres.length, movie.genres.length);
      genreMatchPoints = Math.min(28, Math.round(genreRatio * 28));
    } else {
      genreMatchPoints = 18; // neutral
    }

    // 2. Mood Score (0 - 28 pts)
    let moodMatchPoints = 0;
    if (preferences.moods.length > 0) {
      const matchingMoods = movie.moods.filter((m) =>
        preferences.moods.some((prefM) => prefM.toLowerCase() === m.toLowerCase())
      );
      const moodRatio = matchingMoods.length / Math.min(preferences.moods.length, movie.moods.length);
      moodMatchPoints = Math.min(28, Math.round(moodRatio * 28));
    } else {
      moodMatchPoints = 18;
    }

    // 3. Language Match (0 - 10 pts)
    let languageMatchPoints = 0;
    if (!preferences.language || preferences.language === 'Any' || preferences.language === 'All') {
      languageMatchPoints = 9;
    } else if (movie.language.toLowerCase() === preferences.language.toLowerCase()) {
      languageMatchPoints = 10;
    } else {
      languageMatchPoints = 2;
    }

    // 4. Era Match (0 - 10 pts)
    let eraMatchPoints = 0;
    const year = movie.year;
    switch (preferences.era) {
      case 'Classic (Pre-1980)':
        eraMatchPoints = year < 1980 ? 10 : 3;
        break;
      case '80s-90s':
        eraMatchPoints = year >= 1980 && year < 2000 ? 10 : 4;
        break;
      case '2000s':
        eraMatchPoints = year >= 2000 && year < 2010 ? 10 : 5;
        break;
      case '2010s':
        eraMatchPoints = year >= 2010 && year < 2020 ? 10 : 5;
        break;
      case '2020s':
        eraMatchPoints = year >= 2020 ? 10 : 4;
        break;
      case 'Any':
      default:
        eraMatchPoints = 9;
        break;
    }

    // 5. Talent Match (Actor / Director) (0 - 12 pts)
    let talentMatchPoints = 0;
    if (preferences.favoriteActorDirector && preferences.favoriteActorDirector.trim()) {
      const query = preferences.favoriteActorDirector.toLowerCase().trim();
      const directorMatch = movie.director.toLowerCase().includes(query);
      const actorMatch = movie.actors.some((a) => a.toLowerCase().includes(query));
      if (directorMatch && actorMatch) talentMatchPoints = 12;
      else if (directorMatch) talentMatchPoints = 11;
      else if (actorMatch) talentMatchPoints = 9;
    } else {
      talentMatchPoints = 6; // default neutral
    }

    // 6. Sliders Affinity (Mainstream, Dark, Experimental) (0 - 12 pts)
    const mainstreamDiff = Math.abs(preferences.mainstreamScore - movie.mainstreamScore);
    const darkDiff = Math.abs(preferences.darkScore - movie.darkScore);
    const expDiff = Math.abs(preferences.experimentalScore - movie.experimentalScore);
    const avgDiff = (mainstreamDiff + darkDiff + expDiff) / 3;
    const sliderAffinity = Math.max(2, Math.round(12 - (avgDiff / 100) * 10));

    // Total base sum is out of 100
    const rawSum =
      genreMatchPoints +
      moodMatchPoints +
      languageMatchPoints +
      eraMatchPoints +
      talentMatchPoints +
      sliderAffinity;

    // Direct penalty if this is the exact same movie as their favorite movie (we want to recommend NEW films)
    let favoriteMoviePenalty = 0;
    if (
      preferences.favoriteMovie &&
      preferences.favoriteMovie.toLowerCase().trim() === movie.title.toLowerCase().trim()
    ) {
      favoriteMoviePenalty = -30;
    }

    // Normalized match score bounded between 68% and 97% for top matching films
    const boundedScore = Math.max(50, Math.min(96, rawSum + favoriteMoviePenalty));

    return {
      ...movie,
      matchScore: boundedScore,
      matchBreakdown: {
        genreMatch: genreMatchPoints,
        moodMatch: moodMatchPoints,
        languageMatch: languageMatchPoints,
        eraMatch: eraMatchPoints,
        talentMatch: talentMatchPoints,
        sliderAffinity,
      },
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}

export function generateLocalTasteProfile(preferences: UserPreferences): {
  title: string;
  summary: string;
  dnaTags: string[];
} {
  const moods = preferences.moods.length > 0 ? preferences.moods : ['Mind-Bending', 'Emotional'];
  const genres = preferences.genres.length > 0 ? preferences.genres : ['Sci-Fi', 'Drama'];

  let title = 'Cinematic Explorer';
  if (preferences.darkScore > 65 && moods.includes('Dark')) {
    title = 'Shadow Realist & Neo-Noir Seeker';
  } else if (preferences.experimentalScore > 70 && moods.includes('Mind-Bending')) {
    title = 'Visionary Surrealist';
  } else if (moods.includes('Emotional') && (genres.includes('Drama') || genres.includes('Romance'))) {
    title = 'Emotion-Driven Storyteller';
  } else if (moods.includes('Thrilling') && (genres.includes('Action') || genres.includes('Sci-Fi'))) {
    title = 'High-Concept Adrenaline Strategist';
  } else if (moods.includes('Feel Good') || moods.includes('Funny')) {
    title = 'Soulful Optimist';
  }

  const primaryGenre = genres[0] || 'Cinema';
  const primaryMood = moods[0] || 'Intrigue';
  const summary = `Drawn toward ${primaryMood.toLowerCase()} narratives rooted in ${primaryGenre.toLowerCase()}, with an appetite for ${
    preferences.experimentalScore > 60 ? 'audacious non-linear structure' : 'resonant thematic execution'
  } and ${preferences.darkScore > 60 ? 'unflinching emotional grit' : 'cathartic human warmth'}.`;

  const dnaTags = [
    primaryMood,
    primaryGenre,
    preferences.experimentalScore > 60 ? 'Avant-Garde' : 'Classical Craft',
    preferences.darkScore > 60 ? 'Dark Complex' : 'Luminous',
  ];

  return { title, summary, dnaTags };
}

export function generateLocalRecommendationResponse(
  preferences: UserPreferences,
  topMovies: ScoredMovie[]
): RecommendationResponse {
  const profile = generateLocalTasteProfile(preferences);
  const candidates = topMovies.slice(0, 7);
  const featured = candidates[0];
  const recommendationsList = candidates.slice(1, 7);

  const makeItem = (m: ScoredMovie, isFeatured = false): RecommendationItem => {
    const reasons: string[] = [];
    if (preferences.favoriteMovie) {
      reasons.push(`Echoes the narrative resonance and craftsmanship of "${preferences.favoriteMovie}"`);
    }
    if (m.genres.some((g) => preferences.genres.includes(g))) {
      reasons.push(`Hits your preferred ${m.genres[0]} palette`);
    }
    if (m.moods.some((mod) => preferences.moods.includes(mod))) {
      reasons.push(`delivering genuine ${m.moods[0].toLowerCase()} energy`);
    }

    const why =
      reasons.length > 0
        ? `Because you love ${preferences.favoriteMovie ? `"${preferences.favoriteMovie}"` : 'evocative cinema'} and requested ${preferences.moods.join(' & ') || 'compelling'} stories, ${m.title} provides ${m.description.toLowerCase()}`
        : `${m.title} perfectly bridges your preference for ${m.genres.join('/')} with thoughtful directorial vision by ${m.director}.`;

    return {
      id: m.id,
      title: m.title,
      releaseYear: m.year,
      genre: m.genres.join(', '),
      shortDescription: m.description,
      whyItMatches: why,
      mood: m.moods[0] || 'Captivating',
      language: m.language,
      similarityReason: `Aligns with your ${m.moods.join(' · ')} criteria and directorial style of ${m.director}.`,
      confidenceLevel: isFeatured ? 'Exceptional Match' : m.matchScore > 85 ? 'Strong Match' : 'Curated Wildcard',
      matchScore: m.matchScore,
      accentColor: m.accentColor,
      director: m.director,
      actors: m.actors,
      duration: m.duration,
    };
  };

  return {
    tasteProfileTitle: profile.title,
    tasteProfileSummary: profile.summary,
    dnaTags: profile.dnaTags,
    featuredRecommendation: makeItem(featured, true),
    recommendations: recommendationsList.map((m) => makeItem(m, false)),
    isLocalFallback: true,
    generatedAt: new Date().toISOString(),
  };
}

export function generateLocalSurpriseResponse(): SurpriseResponse {
  // Pick a random standout movie
  const randomIndex = Math.floor(Math.random() * MOVIES_DATASET.length);
  const movie = MOVIES_DATASET[randomIndex];

  const themes = [
    'Unconventional Masterpiece',
    'Midnight Mind-Bender',
    'Atmospheric Sonic Journey',
    'Sensory Overload',
    'Forgotten Cult Phenomenon',
  ];
  const theme = themes[Math.floor(Math.random() * themes.length)];

  return {
    recommendation: {
      id: movie.id,
      title: movie.title,
      releaseYear: movie.year,
      genre: movie.genres.join(', '),
      shortDescription: movie.description,
      whyItMatches: `Selected as tonight's wildcard because of its audacious ${movie.moods.join(' and ')} vision directed by ${movie.director}.`,
      mood: movie.moods[0] || 'Thrilling',
      language: movie.language,
      similarityReason: `Bypasses standard recommendations to surprise your cinematic instincts with ${movie.genres[0]} greatness.`,
      confidenceLevel: 'Curated Wildcard',
      matchScore: 91,
      accentColor: movie.accentColor,
      director: movie.director,
      actors: movie.actors,
      duration: movie.duration,
    },
    wildcardTheme: theme,
    wildcardReason: `A calculated curveball that breaks conventional algorithms to offer a truly singular cinematic encounter.`,
    isLocalFallback: true,
  };
}
