import { createSelector, createFeatureSelector } from '@ngrx/store';
import { FavoritesState } from './favorites.reducer';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const selectAllFavorites = createSelector(
  selectFavoritesState,
  state => state.favorites
);

export const selectIsFavorite = (jobId: string) => createSelector(
  selectFavoritesState,
  state => state.favorites.some(job => job.id === +jobId)
);
