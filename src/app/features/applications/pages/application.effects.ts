import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { loadApplications, loadApplicationsSuccess, addApplication } from './application.actions';
import { Store } from '@ngrx/store';
import { selectApplications } from './application.selectors';
import { ApplicationsService } from '../service/applications-service';

@Injectable()
export class ApplicationsEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private service = inject(ApplicationsService);

  loadApplications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadApplications),
      switchMap(({ userId }) =>
        this.service.getUserApplications(userId).pipe(
          map(user => loadApplicationsSuccess({ applications: user.applications }))
        )
      )
    )
  );

  addApplication$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addApplication),
     
      withLatestFrom(this.store.select(selectApplications)),
      switchMap(([{ userId, jobId }, applications]) =>
        this.service.updateUserApplications(userId, [...applications, jobId]).pipe(
          map(() => loadApplications({ userId }))
        )
      )
    )
  );
}
