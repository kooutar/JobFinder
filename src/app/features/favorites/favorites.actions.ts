import { createAction, props } from '@ngrx/store';
import { Job } from '../jobs/interfaces/job.model';



export const loadFavorites = createAction(
  '[Favorites] Load Favorites',
  props<{ userId: number }>()
);

export const loadFavoritesSuccess = createAction(
  '[Favorites] Load Favorites Success',
  props<{ favorites: number[] }>()
);

export const addFavorite = createAction(
  '[Favorites] Add Favorite',
  props<{ jobId: number; userId: number }>()
);

export const removeFavorite = createAction(
  '[Favorites] Remove Favorite',
  props<{ jobId: number; userId: number }>()
);


export const logout = createAction('[Auth] Logout');


