import { createReducer, on } from '@ngrx/store';
import { loadApplicationsSuccess, addApplication } from './application.actions';
import { logout } from '../../favorites/favorites.actions';

export interface ApplicationsState {
  applications: number[];
}

export const initialState: ApplicationsState = {
  applications: []
};

export const applicationsReducer = createReducer(
  initialState,
  on(loadApplicationsSuccess, (state, { applications }) => ({
    ...state,
    applications
  })),
  on(addApplication, (state, { jobId }) => ({
    ...state,
    applications: state.applications.includes(jobId)
      ? state.applications
      : [...state.applications, jobId]
  })),
  on(logout, () => initialState) // vider à logout
);
