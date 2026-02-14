import { createReducer, on } from '@ngrx/store';
import { addFavorite, loadFavoritesSuccess, logout, removeFavorite } from './favorites.actions';
import { Job } from '../jobs/interfaces/job.model';
export interface FavoritesState {
  favorites: number[];
}

export const initialState: FavoritesState = {
  favorites: []
};

export const favoritesReducer = createReducer(
  initialState,

  on(loadFavoritesSuccess, (state, { favorites }) => ({
    ...state,
    favorites
  })),
   on(logout, state => ({
    ...state,
    favorites: []
  }))
);
