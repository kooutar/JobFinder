import { Routes } from '@angular/router';
import { JobListComponent } from './features/jobs/components/job-list-component/job-list-component';
import { FavoritesPageComponent } from './features/favorites/pages/favorites-page/favorites-page.component';
import { ApplicationsListPageComponent } from './features/applications/pages/applications-list-page/applications-list-page.component';
import { ProfileComponent } from './features/auth/profile/profile.component';

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
    path: 'favorites',
    component: FavoritesPageComponent
  },
  {
    path: 'applications',
    component: ApplicationsListPageComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
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
    path: 'job-list',
    component: JobListComponent
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];

