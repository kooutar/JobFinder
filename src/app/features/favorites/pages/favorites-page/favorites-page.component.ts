import { Component, OnInit } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { selectFavorites } from '../../favorites.selectors';
import { loadFavorites, removeFavorite } from '../../favorites.actions';
import { JobService } from '../../../jobs/services/job-service';
import { AuthService } from '../../../auth/services/auth-service';
import { Job } from '../../../jobs/interfaces/job.model';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../shared/shared/shared-module';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './favorites-page.component.html',
  styleUrl: './favorites-page.component.css',
})
export class FavoritesPageComponent implements OnInit {
  jobs$!: Observable<Job[]>;
  loading$!: Observable<boolean>;
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
    this.store.dispatch(loadFavorites({ userId: this.userId! }));

    this.jobs$ = this.store.select(selectFavorites).pipe(
      switchMap((favoriteIds) => {
        if (favoriteIds.length === 0) return of([]);
        return combineLatest(
          favoriteIds.map((id) =>
            this.jobService.getJobById(id).pipe(
              catchError(() => of(null))
            )
          )
        ).pipe(
          map((results) => results.filter((job): job is Job => job !== null))
        );
      })
    );

    this.loading$ = this.store.select(selectFavorites).pipe(
      map((ids) => ids.length > 0)
    );
    this.isEmpty$ = this.jobs$.pipe(map((jobs) => jobs.length === 0));
  }

  removeFavorite(job: Job): void {
    if (!this.userId) return;
    this.store.dispatch(removeFavorite({ jobId: job.id, userId: this.userId }));
  }

  trackByJobId(_index: number, job: Job): number {
    return job.id;
  }
}
