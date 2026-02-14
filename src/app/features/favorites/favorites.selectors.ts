import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState } from './favorites.reducer';

/**
 * Feature key (doit matcher celui du Store)
 */
export const FAVORITES_FEATURE_KEY = 'favorites';

/**
 * Sélecteur racine du feature
 */
export const selectFavoritesState =
  createFeatureSelector<FavoritesState>(FAVORITES_FEATURE_KEY);

/**
 * Tous les favoris (IDs)
 */
export const selectFavorites = createSelector(
  selectFavoritesState,
  (state) => state.favorites
);

/**
 * Nombre de favoris ❤️
 */
export const selectFavoritesCount = createSelector(
  selectFavorites,
  (favorites) => favorites.length
);

/**
 * Vérifier si un job est favori
 */
export const selectIsFavorite = (jobId: number) =>
  createSelector(
    selectFavorites,
    (favorites) => favorites.includes(jobId)
  );
