import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JobOfferDisplay } from '../../interfaces/job-offer.model';
import { SharedModule } from '../../../../shared/shared/shared-module';

@Component({
  selector: 'app-job-card-component',
  imports: [SharedModule],
  templateUrl: './job-card-component.html',
  styleUrl: './job-card-component.css',
})
export class JobCardComponent {
   @Input() job!: JobOfferDisplay;
  @Input() isFavorite = false;
  @Input() isAuthenticated = false;
  @Input() showActions = true; // Show favorite/track buttons
  
  @Output() viewJob = new EventEmitter<JobOfferDisplay>();
  @Output() addToFavorites = new EventEmitter<JobOfferDisplay>();
  @Output() trackApplication = new EventEmitter<JobOfferDisplay>();

  onViewJob(): void {
    this.viewJob.emit(this.job);
  }

  onAddToFavorites(event: Event): void {
    event.stopPropagation();
    this.addToFavorites.emit(this.job);
  }

  onTrackApplication(event: Event): void {
    event.stopPropagation();
    this.trackApplication.emit(this.job);
  }

}
