import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { favoritesReducer } from './features/favorites/favorites.reducer';
import { provideEffects } from '@ngrx/effects';
import { FavoritesEffects } from './features/favorites/favorites.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
     // ✅ NgRx Store
    provideStore({
      favorites: favoritesReducer
    }),

    // ✅ NgRx Effects
    provideEffects([FavoritesEffects])
]
};
