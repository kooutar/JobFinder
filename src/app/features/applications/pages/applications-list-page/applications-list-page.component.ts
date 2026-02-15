import { Component, OnInit } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { selectApplications } from '../application.selectors';
import { loadApplications } from '../application.actions';
import { JobService } from '../../../jobs/services/job-service';
import { AuthService } from '../../../auth/services/auth-service';
import { RouterModule } from '@angular/router';
import { Job } from '../../../jobs/interfaces/job.model';
import { SharedModule } from '../../../../shared/shared/shared-module';

@Component({
  selector: 'app-applications-list-page',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './applications-list-page.component.html',
  styleUrl: './applications-list-page.component.css',
})
export class ApplicationsListPageComponent implements OnInit {
  jobs$!: Observable<Job[]>;
  isEmpty$!: Observable<boolean>;
  private userId: number | null = null;

  constructor(
    private store: Store,
    private jobService: JobService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.id) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
    this.store.dispatch(loadApplications({ userId: this.userId! }));

    this.jobs$ = this.store.select(selectApplications).pipe(
      switchMap((applicationIds) => {
        if (applicationIds.length === 0) return of([]);
        return combineLatest(
          applicationIds.map((id) =>
            this.jobService.getJobById(id).pipe(
              catchError(() => of(null))
            )
          )
        ).pipe(
          map((results) => results.filter((job): job is Job => job !== null))
        );
      })
    );

    this.isEmpty$ = this.jobs$.pipe(map((jobs) => jobs.length === 0));
  }

  trackByJobId(_index: number, job: Job): number {
    return job.id;
  }
}
