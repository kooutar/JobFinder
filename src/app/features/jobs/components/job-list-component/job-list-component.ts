import { Component } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import { Job } from '../../interfaces/job.model';
import { JobService } from '../../services/job-service';
import { SharedModule } from '../../../../shared/shared/shared-module';
import { Pagination } from '../pagination/pagination';

@Component({
  selector: 'app-job-list-component',
  imports: [SharedModule, Pagination],
  templateUrl: './job-list-component.html',
  styleUrl: './job-list-component.css',
})
export class JobListComponent {

  jobs$!: Observable<Job[]>;

  total = 0;
  itemsPerPage = 10;

  private page$ = new Subject<number>();
  private search$ = new Subject<string>();

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.jobs$ = combineLatest([
      this.page$.pipe(startWith(1)),
      this.search$.pipe(startWith(''))
    ]).pipe(
      debounceTime(300),
      switchMap(([page, search]) =>
        this.jobService.getAllJobs(page).pipe(
          tap(res => this.total = res.total),
          map(res =>
            res.results
              .filter(job =>
                job.name.toLowerCase().includes(search.toLowerCase())
              )
              .sort(
                (a, b) =>
                  new Date(b.publication_date).getTime()
                  - new Date(a.publication_date).getTime()
              )
          )
        )
      )
    );
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.page$.next(1);           // reset pagination
    this.search$.next(value);
  }

  onPageChange(page: number) {
    this.page$.next(page);
  }

  toggleFavorite(job: any): void {
    job.isFavorite = !job.isFavorite;
    console.log('Favoris toggled:', job.name, job.isFavorite);
  }

  applyToJob(job: any): void {
    console.log('Candidature pour:', job.name);
  }
}
