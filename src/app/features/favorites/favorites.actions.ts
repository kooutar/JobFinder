import { createAction, props } from '@ngrx/store';
import { Job } from '../jobs/interfaces/job.model';



export const addFavorite = createAction(
  '[Favorites] Add Favorite',
  props<{ job: Job }>()
);

export const removeFavorite = createAction(
  '[Favorites] Remove Favorite',
  props<{ jobId: number }>()
);
