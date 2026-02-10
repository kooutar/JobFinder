import { Routes } from '@angular/router';
import { HomeSearchBarComponent } from './features/Home/components/home-search-bar-component/home-search-bar-component';


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
    path: '**',
    redirectTo: '/home'
  }
];
