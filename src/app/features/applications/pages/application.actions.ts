import { createAction, createFeatureSelector, createSelector, props } from '@ngrx/store';
import { ApplicationsState } from './application.reducer';

export const loadApplications = createAction(
  '[Applications] Load Applications',
  props<{ userId: number }>()
);

export const loadApplicationsSuccess = createAction(
  '[Applications] Load Applications Success',
  props<{ applications: number[] }>()
);

export const addApplication = createAction(
  '[Applications] Add Application',
  props<{ userId: number; jobId: number }>()
);
// Nom du feature store (doit correspondre à celui du provideStore)
export const APPLICATIONS_FEATURE_KEY = 'applications';

// Sélecteur racine du feature
export const selectApplicationsState =
  createFeatureSelector<ApplicationsState>(APPLICATIONS_FEATURE_KEY);

