import { Routes } from '@angular/router';
import { HomeSearchBarComponent } from './features/Home/components/home-search-bar-component/home-search-bar-component';
import { JobListComponent } from './features/jobs/components/job-list-component/job-list-component';
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
    component: JobListComponent
  },

  {
    path: 'jobs',
    loadChildren: () => import('./features/jobs/jobs.routes').then(m => m.jobsRoutes)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth-routes').then(m => m.authRoutes)
  },
  {
    path: '**',
    redirectTo: '/home'
  },
  {
    path: 'job-list',
    component: JobListComponent
  }
];

