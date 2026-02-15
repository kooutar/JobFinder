import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationsState } from './application.reducer';

export const selectApplicationsState =
  createFeatureSelector<ApplicationsState>('applications');

export const selectApplications = createSelector(
  selectApplicationsState,
  state => state.applications
);

export const selectApplicationsCount = createSelector(
  selectApplications,
  (applications) => applications.length
);

export const selectHasApplied = (jobId: number) =>
  createSelector(
    selectApplications,
    (applications) => applications.includes(jobId)
  );

  

  
