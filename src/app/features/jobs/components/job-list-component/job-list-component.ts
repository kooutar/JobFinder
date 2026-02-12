import { Component } from '@angular/core';
import { Observable ,of} from 'rxjs';
import { Job } from '../../interfaces/job.model';
import { JobService } from '../../services/job-service';
import { SharedModule } from '../../../../shared/shared/shared-module';
import { Pagination } from '../pagination/pagination';


@Component({
  selector: 'app-job-list-component',
  imports: [SharedModule,Pagination],
  templateUrl: './job-list-component.html',
  styleUrl: './job-list-component.css',
})
export class JobListComponent {
  jobs$!:Observable<Job[]>
  total=0;
  page=1;
  itemsPerPage=10;
  constructor(private jobService:JobService){}
   ngOnInit(): void {
    this.loadJobs();
   }


  loadJobs(){
    this.jobService.getAllJobs(this.page).subscribe(res=>{
      this.jobs$=of( res.results.sort((a, b) =>
        new Date(b.publication_date).getTime()
        - new Date(a.publication_date).getTime()));
      this.total=res.total;
    })
     
  }

   toggleFavorite(job: any): void {
    job.isFavorite = !job.isFavorite;
    // Ajoutez votre logique de sauvegarde des favoris ici
    console.log('Favoris toggled:', job.name, job.isFavorite);
  }

  applyToJob(job: any): void {
    // Logique pour candidater
    console.log('Candidature pour:', job.name);
    // Vous pouvez ouvrir un modal, rediriger, etc.
  }
  onPageChange(page: number) {
    this.page = page;
    this.loadJobs();
  }

}
