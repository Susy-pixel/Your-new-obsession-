import { Movie, RecommendationResponse, SurpriseResponse, UserPreferences } from '../types';
import { MOVIES_DATASET } from '../data/movies';
import { calculateMovieScores, generateLocalRecommendationResponse, generateLocalSurpriseResponse } from '../utils/scoring';

const LOCAL_STORAGE_PREFS_KEY = 'cinematch_user_preferences';
const LOCAL_STORAGE_HISTORY_KEY = 'cinematch_recommendation_history';

export async function fetchRecommendations(preferences: UserPreferences): Promise<RecommendationResponse> {
  try {
    const res = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data: RecommendationResponse = await res.json();
    saveRecommendationToHistory(data);
    savePreferences(preferences);
    return data;
  } catch (err) {
    console.warn('API call failed, running local hybrid engine in client:', err);
    const scored = calculateMovieScores(preferences, MOVIES_DATASET);
    const local = generateLocalRecommendationResponse(preferences, scored);
    saveRecommendationToHistory(local);
    savePreferences(preferences);
    return local;
  }
}

export async function fetchSurpriseMe(): Promise<SurpriseResponse> {
  try {
    const res = await fetch('/api/surprise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp: Date.now() }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn('Surprise API call failed, generating local surprise:', err);
    return generateLocalSurpriseResponse();
  }
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export function getSavedPreferences(): UserPreferences | null {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_PREFS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error('Failed to read from localStorage', e);
    return null;
  }
}

export function saveRecommendationToHistory(rec: RecommendationResponse): void {
  try {
    const current = getRecommendationHistory();
    // Keep max 5 recent recommendation batches
    const updated = [rec, ...current.filter((item) => item.tasteProfileTitle !== rec.tasteProfileTitle)].slice(0, 5);
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save history to localStorage', e);
  }
}

export function getRecommendationHistory(): RecommendationResponse[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Failed to read history from localStorage', e);
    return [];
  }
}

export function clearCinematicData(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_PREFS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear data', e);
  }
}
