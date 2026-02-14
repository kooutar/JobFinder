import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { Job } from '../../interfaces/job.model';
import { JobService } from '../../services/job-service';
import { SharedModule } from '../../../../shared/shared/shared-module';
import { Pagination } from '../pagination/pagination';
import { Store } from '@ngrx/store';
import { selectFavorites } from '../../../favorites/favorites.selectors';
import { addFavorite, removeFavorite, loadFavorites, logout } from '../../../favorites/favorites.actions';
import { AuthService } from '../../../auth/services/auth-service';

@Component({
  selector: 'app-job-list-component',
  imports: [SharedModule, Pagination],
  templateUrl: './job-list-component.html',
  styleUrl: './job-list-component.css',
})
export class JobListComponent implements OnInit {

  jobs$!: Observable<Job[]>;

  total = 0;
  itemsPerPage = 20;
  page = 1;

  private page$ = new BehaviorSubject<number>(1);
  private search$ = new BehaviorSubject<string>('');

  private userId: number | null = null;

  constructor(
    private jobService: JobService,
    private store: Store,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // ✅ Récupérer l'ID du user connecté au démarrage
    this.userId = this.authService.getCurrentUser()?.id ?? null;

    if (this.userId) {
      // ✅ Charger les favoris depuis JSON Server
      this.store.dispatch(loadFavorites({ userId: this.userId }));
    }

    const apiJobs$ = this.page$.pipe(
      tap(page => (this.page = page)),
      switchMap(page =>
        this.jobService.getAllJobs(page).pipe(
          tap(res => (this.total = res.total)),
          map(res => res.results)
        )
      )
    );

    // ✅ Combiner les jobs et les favoris pour afficher le cœur
    this.jobs$ = combineLatest([
      apiJobs$,
      this.store.select(selectFavorites)
    ]).pipe(
      map(([jobs, favorites]) =>
        jobs.map(job => ({
          ...job,
          isFavorite: favorites.includes(job.id)
        }))
      )
    );
  }

  // Recherche locale sans toucher à la pagination
  searchLocally(term: string) {
    this.jobs$ = this.jobs$.pipe(
      map(jobs => jobs.filter(job => 
        job.name.toLowerCase().includes(term.toLowerCase())
      ))
    );
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.page$.next(1);        // reset pagination
    this.search$.next(value);
  }

  onPageChange(page: number) {
    this.page$.next(page);    // 🔥 une seule source
  }

  toggleFavorite(job: Job): void {
    if (!this.userId) return; // Pas connecté

    if (job.isFavorite) {
      this.store.dispatch(removeFavorite({
        jobId: job.id,
        userId: this.userId
      }));
    } else {
      this.store.dispatch(addFavorite({
        jobId: job.id,
        userId: this.userId
      }));
    }
  }

  applyToJob(job: any): void {
    console.log('Apply:', job.name);
  }
  


}
