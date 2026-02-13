import { Component } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import { Job } from '../../interfaces/job.model';
import { JobService } from '../../services/job-service';
import { SharedModule } from '../../../../shared/shared/shared-module';
import { Pagination } from '../pagination/pagination';
import { Store } from '@ngrx/store';
import { selectAllFavorites } from '../../../favorites/favorites.selectors';
import { addFavorite, removeFavorite } from '../../../favorites/favorites.actions';


@Component({
  selector: 'app-job-list-component',
  imports: [SharedModule, Pagination],
  templateUrl: './job-list-component.html',
  styleUrl: './job-list-component.css',
})
export class JobListComponent {

   jobs$!: Observable<Job[]>;

  total = 0;
  itemsPerPage = 20;
  page = 1;

  private page$ = new BehaviorSubject<number>(1);
  private search$ = new BehaviorSubject<string>('');

  constructor(private jobService: JobService,  private store: Store) {}

ngOnInit(): void {
  const apiJobs$ = this.page$.pipe(
    tap(page => (this.page = page)),
    switchMap(page =>
      this.jobService.getAllJobs(page).pipe(
        tap(res => (this.total = res.total)),
        map(res => res.results)
      )
    )
  );

  this.jobs$ = combineLatest([
    apiJobs$,
    this.store.select(selectAllFavorites)
  ]).pipe(
    map(([jobs, favorites]) =>
      jobs.map(job => ({
        ...job,
        isFavorite: favorites.some(fav => fav.id === job.id)
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
  if (job.isFavorite) {
    this.store.dispatch(removeFavorite({ jobId: job.id }));
  } else {
    this.store.dispatch(addFavorite({ job }));
  }
}

  applyToJob(job: any): void {
    console.log('Apply:', job.name);
  }
}
