import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { addFavorite, removeFavorite } from './favorites.actions';

@Injectable()
export class FavoritesEffects {

  saveFavorites$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addFavorite, removeFavorite),
        tap((action: any) => {
          const favorites =
            action.type === '[Favorites] Add Favorite'
              ? null
              : null;
          // handled via reducer state
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
