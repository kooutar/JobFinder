
import { Routes } from '@angular/router';
import { JobSearchComponent } from './pages/job-search/job-search.component';

export const jobsRoutes: Routes = [
  {
    path: 'search',
    component: JobSearchComponent
  },
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full'
  }
];
