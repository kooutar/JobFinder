import { Routes } from '@angular/router';
import { HomeSearchBarComponent } from './features/Home/components/home-search-bar-component/home-search-bar-component';
import { Registre } from './features/auth/registre/registre';
import { Login } from './features/auth/login/login';


export const routes: Routes = [
    {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeSearchBarComponent
  },

{
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth-routes').then(m => m.authRoutes)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
