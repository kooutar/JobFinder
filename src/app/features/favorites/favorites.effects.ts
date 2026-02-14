import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { addFavorite, loadFavorites, loadFavoritesSuccess, removeFavorite } from './favorites.actions';
import { FavoritesService } from './service/favorites-service';
import { Store } from '@ngrx/store';
import { selectFavorites } from './favorites.selectors';

@Injectable()
export class FavoritesEffects {
  private actions$ = inject(Actions);
  private service = inject(FavoritesService);
  private store = inject(Store);

  loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFavorites),
      switchMap(({ userId }) =>
        this.service.getUserFavorites(userId).pipe(
          map(user => loadFavoritesSuccess({ favorites: user.favorites }))
        )
      )
    )
  );

  addFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addFavorite),
      withLatestFrom(this.store.select(selectFavorites)),
      switchMap(([{ jobId, userId }, favorites]) =>
        this.service.updateUserFavorites(userId, [...favorites, jobId]).pipe(
          map(() => loadFavorites({ userId }))
        )
      )
    )
  );

  removeFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeFavorite),
      withLatestFrom(this.store.select(selectFavorites)),
      switchMap(([{ jobId, userId }, favorites]) =>
        this.service.updateUserFavorites(
          userId,
          favorites.filter(id => id !== jobId)
        ).pipe(
          map(() => loadFavorites({ userId }))
        )
      )
    )
  );
}