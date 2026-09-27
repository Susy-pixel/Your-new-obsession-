import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { MOVIES_DATASET } from './src/data/movies.ts';
import { calculateMovieScores, generateLocalRecommendationResponse, generateLocalSurpriseResponse } from './src/utils/scoring.ts';
import { UserPreferences } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// POST /api/recommendations
app.post('/api/recommendations', async (req: Request, res: Response) => {
  try {
    const preferences: UserPreferences = req.body;

    if (!preferences) {
      return res.status(400).json({ error: 'Missing preferences in request body.' });
    }

    // 1. Local Matching Engine: Pre-score the dataset
    const scoredMovies = calculateMovieScores(preferences, MOVIES_DATASET);
    // Take top 10 candidates for Gemini semantic evaluation
    const topCandidates = scoredMovies.slice(0, 10);

    // 2. If Gemini is unavailable or not configured, return local hybrid fallback
    if (!ai || !apiKey) {
      console.log('Gemini API key not configured. Using local recommendation engine.');
      const localResponse = generateLocalRecommendationResponse(preferences, scoredMovies);
      return res.json(localResponse);
    }

    // 3. Prompt Gemini to analyze candidates and formulate personalized explanations
    const prompt = `You are CINEMATCH, an expert cinematic curator and film scholar with deep narrative intuition.
The user has provided their cinematic preferences:
- Favorite Movie: "${preferences.favoriteMovie || 'None specified'}"
- Moods desired: ${preferences.moods?.length ? preferences.moods.join(', ') : 'Open to anything'}
- Preferred Genres: ${preferences.genres?.length ? preferences.genres.join(', ') : 'Diverse'}
- Preferred Language: "${preferences.language || 'Any'}"
- Preferred Era: "${preferences.era || 'Any'}"
- Favorite Actor or Director: "${preferences.favoriteActorDirector || 'None specified'}"
- Mainstream vs Underrated scale (0=Niche/Indie, 100=Blockbuster): ${preferences.mainstreamScore}
- Light vs Dark tone scale (0=Uplifting, 100=Dark/Brooding): ${preferences.darkScore}
- Familiar vs Experimental structure scale (0=Classical, 100=Avant-Garde): ${preferences.experimentalScore}

Here are the top candidate movies rigorously matched from our cinematic library:
${JSON.stringify(
  topCandidates.map((m) => ({
    id: m.id,
    title: m.title,
    year: m.year,
    genres: m.genres,
    director: m.director,
    actors: m.actors,
    moods: m.moods,
    language: m.language,
    description: m.description,
    duration: m.duration,
    calculatedMatchScore: m.matchScore,
  })),
  null,
  2
)}

TASKS:
1. Synthesize the user's "Cinematic DNA" taste profile title (e.g. "Mind-Bending Neo-Noir Seeker", "Emotion-Driven Metaphysical Dreamer", etc.) and a concise 1-sentence summary of what moves them.
2. Provide 4 thematic DNA tags (e.g. ["Mind-Bending", "Existential Stakes", "Dark Realism", "Sci-Fi"]).
3. Select the single best movie from the candidate list as the FEATURED recommendation ("THE ONE YOU SHOULD TRY FIRST").
4. Select 5 additional distinct movies from the candidate list for a total of 6 recommendations.
5. For EVERY selected movie, generate a deeply personalized natural-language explanation for "whyItMatches" and a "similarityReason". Specifically connect the recommendation back to their favorite movie, selected mood, or stylistic preference (e.g., "Because you loved Inception and selected mind-bending sci-fi with darker themes, this film delivers high-concept twists...").
6. Provide a confidenceLevel ('Exceptional Match' for the featured pick, and 'Strong Match' or 'Curated Wildcard' for others).
7. Preserve the movie's real ID, year, director, actors, duration, and calculatedMatchScore from the candidates provided. Do not hallucinate fake actors, directors, or awards.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a high-end film recommendation engine. You output valid JSON conforming exactly to the requested schema. Never invent unverified film trivia or fake cast members.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasteProfileTitle: { type: Type.STRING },
            tasteProfileSummary: { type: Type.STRING },
            dnaTags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            featuredRecommendation: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                releaseYear: { type: Type.INTEGER },
                genre: { type: Type.STRING },
                shortDescription: { type: Type.STRING },
                whyItMatches: { type: Type.STRING },
                mood: { type: Type.STRING },
                language: { type: Type.STRING },
                similarityReason: { type: Type.STRING },
                confidenceLevel: { type: Type.STRING },
                matchScore: { type: Type.INTEGER },
              },
              required: [
                'id',
                'title',
                'releaseYear',
                'genre',
                'shortDescription',
                'whyItMatches',
                'mood',
                'similarityReason',
                'confidenceLevel',
                'matchScore',
              ],
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  releaseYear: { type: Type.INTEGER },
                  genre: { type: Type.STRING },
                  shortDescription: { type: Type.STRING },
                  whyItMatches: { type: Type.STRING },
                  mood: { type: Type.STRING },
                  language: { type: Type.STRING },
                  similarityReason: { type: Type.STRING },
                  confidenceLevel: { type: Type.STRING },
                  matchScore: { type: Type.INTEGER },
                },
                required: [
                  'id',
                  'title',
                  'releaseYear',
                  'genre',
                  'shortDescription',
                  'whyItMatches',
                  'mood',
                  'similarityReason',
                  'confidenceLevel',
                  'matchScore',
                ],
              },
            },
          },
          required: [
            'tasteProfileTitle',
            'tasteProfileSummary',
            'dnaTags',
            'featuredRecommendation',
            'recommendations',
          ],
        },
      },
    });

    const rawText = response.text?.trim() || '';
    if (!rawText) {
      throw new Error('Empty response from Gemini.');
    }

    const parsedData = JSON.parse(rawText);

    // Merge in extra metadata from candidate dataset for complete rendering (accentColor, duration, director, cast)
    const enrichItem = (item: any) => {
      const original = MOVIES_DATASET.find((m) => m.id === item.id || m.title.toLowerCase() === item.title.toLowerCase());
      return {
        ...item,
        accentColor: original?.accentColor || '#8b5cf6',
        director: original?.director || item.director || '',
        actors: original?.actors || item.actors || [],
        duration: original?.duration || item.duration || '2h',
        matchScore: item.matchScore || original ? (topCandidates.find(c => c.id === original?.id)?.matchScore ?? 88) : 88,
      };
    };

    const finalResponse = {
      tasteProfileTitle: parsedData.tasteProfileTitle || 'Cinematic Visionary',
      tasteProfileSummary: parsedData.tasteProfileSummary || 'Tailored to your aesthetic instincts.',
      dnaTags: parsedData.dnaTags || ['Mind-Bending', 'Emotional', 'Sci-Fi'],
      featuredRecommendation: enrichItem(parsedData.featuredRecommendation),
      recommendations: (parsedData.recommendations || []).map(enrichItem),
      isLocalFallback: false,
      generatedAt: new Date().toISOString(),
    };

    return res.json(finalResponse);
  } catch (error) {
    console.error('Error generating AI recommendations, using local fallback:', error);
    // Graceful fallback to local engine - never crash
    const preferences: UserPreferences = req.body || {
      moods: ['Mind-Bending'],
      genres: ['Sci-Fi'],
      favoriteMovie: '',
      language: 'Any',
      era: 'Any',
      favoriteActorDirector: '',
      mainstreamScore: 50,
      darkScore: 50,
      experimentalScore: 50,
    };
    const scored = calculateMovieScores(preferences, MOVIES_DATASET);
    const fallbackResponse = generateLocalRecommendationResponse(preferences, scored);
    return res.json(fallbackResponse);
  }
});

// POST /api/surprise
app.post('/api/surprise', async (req: Request, res: Response) => {
  try {
    if (!ai || !apiKey) {
      return res.json(generateLocalSurpriseResponse());
    }

    // Pick 3 random candidate movies from dataset
    const shuffled = [...MOVIES_DATASET].sort(() => 0.5 - Math.random());
    const sample = shuffled.slice(0, 4);

    const prompt = `You are CINEMATCH's Wildcard Curator.
Select ONE movie from this candidate pool that would make the most intriguing, unexpected, and gripping cinematic surprise tonight:
${JSON.stringify(sample.map(m => ({ id: m.id, title: m.title, year: m.year, genres: m.genres, director: m.director, description: m.description, moods: m.moods })))}

Provide:
1. "wildcardTheme": A dramatic 2-3 word archetype (e.g., "Midnight Mind-Bender", "Subterranean Masterpiece", "Electric Paranoia").
2. "wildcardReason": An evocative sentence explaining why this specific movie is tonight's wildcard pick.
3. The selected movie details adhering to the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wildcardTheme: { type: Type.STRING },
            wildcardReason: { type: Type.STRING },
            recommendation: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                releaseYear: { type: Type.INTEGER },
                genre: { type: Type.STRING },
                shortDescription: { type: Type.STRING },
                whyItMatches: { type: Type.STRING },
                mood: { type: Type.STRING },
                language: { type: Type.STRING },
                similarityReason: { type: Type.STRING },
                confidenceLevel: { type: Type.STRING },
                matchScore: { type: Type.INTEGER },
              },
              required: [
                'id',
                'title',
                'releaseYear',
                'genre',
                'shortDescription',
                'whyItMatches',
                'mood',
                'similarityReason',
                'confidenceLevel',
                'matchScore',
              ],
            },
          },
          required: ['wildcardTheme', 'wildcardReason', 'recommendation'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    const original = MOVIES_DATASET.find(m => m.id === parsed.recommendation?.id || m.title.toLowerCase() === parsed.recommendation?.title?.toLowerCase());

    const result = {
      wildcardTheme: parsed.wildcardTheme || "Tonight's Hidden Masterpiece",
      wildcardReason: parsed.wildcardReason || "A singular story that challenges expectations.",
      recommendation: {
        ...parsed.recommendation,
        accentColor: original?.accentColor || '#ec4899',
        director: original?.director || '',
        actors: original?.actors || [],
        duration: original?.duration || '2h',
        matchScore: parsed.recommendation?.matchScore || 92,
      },
      isLocalFallback: false,
    };

    return res.json(result);
  } catch (error) {
    console.error('Error in surprise wildcard, using local fallback:', error);
    return res.json(generateLocalSurpriseResponse());
  }
});

// GET /api/movies - for discover page
app.get('/api/movies', (req: Request, res: Response) => {
  res.json(MOVIES_DATASET);
});

// GET /api/health
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!(ai && apiKey),
    moviesCount: MOVIES_DATASET.length,
    timestamp: new Date().toISOString(),
  });
});

// Vite or Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`CINEMATCH server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
