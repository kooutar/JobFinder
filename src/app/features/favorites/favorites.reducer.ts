import { createReducer, on } from '@ngrx/store';
import { addFavorite, removeFavorite } from './favorites.actions';
import { Job } from '../jobs/interfaces/job.model';

/**
 * State
 */
export interface FavoritesState {
  favorites: Job[];
}

/**
 * Load favorites from localStorage (on app init / refresh)
 */
function loadFavoritesFromStorage(): Job[] {
  try {
    const data = localStorage.getItem('favorites');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error loading favorites from storage', e);
    return [];
  }
}

/**
 * Initial State
 */
export const initialState: FavoritesState = {
  favorites: loadFavoritesFromStorage(), // ✅ persistence
};

/**
 * Reducer
 */
export const favoritesReducer = createReducer(
  initialState,

  // ❤️ ADD FAVORITE
  on(addFavorite, (state, { job }) => {
    // éviter les doublons
    if (state.favorites.some(f => f.id === job.id)) {
      return state;
    }

    const updatedFavorites = [...state.favorites, job];

    // 💾 save to localStorage
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    return {
      ...state,
      favorites: updatedFavorites,
    };
  }),

  // 💔 REMOVE FAVORITE
  on(removeFavorite, (state, { jobId }) => {
    const updatedFavorites = state.favorites.filter(
      job => job.id !== jobId
    );

    // 💾 save to localStorage
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

    return {
      ...state,
      favorites: updatedFavorites,
    };
  })
);
