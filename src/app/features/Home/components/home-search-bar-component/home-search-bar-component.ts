import { CommonModule } from '@angular/common';
import { Component, Input, NgModule, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FeatureCardComponent } from '../../feature-card/feature-card-component/feature-card-component';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { SharedModule } from '../../../../shared/shared/shared-module';
import { JobOfferDisplay } from '../../../jobs/interfaces/job-offer.model';
import { Subject, takeUntil } from 'rxjs';
import { JobService } from '../../../jobs/services/job-service';
import { JobCardComponent } from '../../../jobs/components/job-card-component/job-card-component';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-home-search-bar-component',
  imports: [SharedModule,JobCardComponent,FeatureCardComponent],
  templateUrl: './home-search-bar-component.html',
  styleUrl: './home-search-bar-component.css',
})
export class HomeSearchBarComponent implements OnInit , OnDestroy {
  
  // Featured jobs to display on home page
  featuredJobs: JobOfferDisplay[] = [];
  isLoadingJobs = false;
  jobsError = '';

  // Pagination
  currentPage = 1;
  totalPages = 1;

  popularSearches = [
    'Software Engineer',
    'Product Designer', 
    'Marketing Specialist'
  ];

  features = [
    {
      icon: 'travel_explore',
      title: 'Multi-source search',
      description: 'Aggregate listings from the web\'s top boards and find exclusive openings you won\'t see anywhere else.'
    },
    {
      icon: 'bookmark',
      title: 'Save favorites',
      description: 'Never lose track of a great opportunity. Bookmark roles and organize them into custom lists for later review.'
    },
    {
      icon: 'query_stats',
      title: 'Track applications',
      description: 'Monitor your status from application to offer. Get real-time updates on your progress and interview schedules.'
    },
    {
      icon: 'account_circle',
      title: 'Manage profile',
      description: 'Build a professional resume that stands out. Use our AI-powered tools to optimize your profile for ATS systems.'
    }
  ];

  companyLogos = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCsFQZ7HSmiX_k9XmNf_e5t9s4WFelUSY5AZo6mDFeKLW2hjxa4c0M11kVDTmTwD_6VnxPsp7bRQdegmTpiOvfGjACfNjdoCPeewBxEduoW_62CwmSzncWn1rGY39UHchWk4YN5z0SN3TMIUJ4w4r4OFfJpOeWvG0CoTm1ZuUg4SrzYxJB3inFoZbwdPzXRAa1lgJYDgS5HjMYotk1JKoSzXVTtL9MdBM3lLTGTq33LAOPz3hAVLVQKuIjCLjfJ6lQwdH615o8OLih7',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD6lAcLTYbgGJ8m2ZdMKpguiGypC6sTXg9Vxlu9n0Or6t3s0GwvG9LNRJQQpPEEbcLEF7rP6nF8Z4e8pZBcprC5uftG-G_2TeoaHNxQSwDiruSs8tTZ9TFxR56K8FrpS8c0eT1loIW5ijUVrWoDfHPeDPSbT2E3AU9XzRGHIuDzd54ta1Swy32AcNYjWtHrDhX6OdOw3ie9E-3UJaQza1OX5Jl0KNB9h9xb9HpzzGoPGfj3JavnFgVO0mOz3J3zXlNNzKg9NIUFmu6K',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBJoEY19S6yWMMuyQCP3vhVLUV6lCfFojEYOwPQhPAjRGtIQ79cyNy_tQeSyGotxqj3_EvhGVlPn08JsOXkU4JmjD5YmjAeIQrfpOQdYFlZR3FUCaC8OG1o3M7ftC7ZtX8G5JvpUzSm8XCM0zCC95m60EuyHTZdGNYSIcmFRP4CwcqLyPxvdHjnJZRrxX_ArDI8IHMMGun81yLHUr9NQUWYYz49R2zIDiCwMr5FFB_Ad1Uy8dmEvrBA3w-QH6g4D0tAYsyYD-qxNw0h',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDuzmdWHAQ8R-fmuAMx8SoMBb5gW2aKIj_8-2df_48SkT9cs56re8UtKpTEyzkvQnYTc-nxQSoyr0Ys2fcCK3ofPXN_qSBNIIAU-zM9Gmi_fIIXfiZOiII86es0WD_LHJitn2P3yR7LqdhQpJdGruMUeJ7Zn1aB5uAa9FzaZzPhJYoU1xOaL3aVawNX4F5Kx7FrEp6nWJ49x5Lb4lk5FcjdZpu4Kqq5iUVluyoUcJjuamQCisnsJC8AqImy_FTQsclsH6oy6B5sZCM0',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBMw-ed6T0UiFnv0YK_D04lVWv8BA4Vt6RxwADs5KLhf2a7mlRLdPhMyDP2vgX06MUgFCxPiJKPzQz60EEkO0hpIeBqCJpoP3VPl_Zin01DkIWEYohAiRKbqXFsvzLkgw_FWPcOWzioiEYjydN2SmSWiECLAxTaolOHYqClGmsUWcEMg-2cH0nH1rkq54mhX7ix7l771tCd2CvM-iQHLNnlRtS_v8DpjG9gUHs6TNEmBBbgkNIWMEaqoJ3kz_q3rhFLBaipNEorfsRe'
  ];

  searchKeyword = '';
  searchLocation = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private jobService: JobService
  ) {}

  ngOnInit(): void {
    this.loadFeaturedJobs();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load featured jobs to display on home page
   */
  loadFeaturedJobs(page: number = 1): void {
    this.isLoadingJobs = true;
    this.jobsError = '';
    this.currentPage = page;

    this.jobService.getJobsForDisplay(page)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.featuredJobs = response.jobs;
          this.totalPages = response.pagination.totalPages;
          this.isLoadingJobs = false;
          
          // Scroll to top of jobs section if not first load
          if (page > 1) {
             const jobsSection = document.getElementById('featured-jobs');
             if (jobsSection) {
               jobsSection.scrollIntoView({ behavior: 'smooth' });
             }
          }
        },
        error: (error: any) => {
          console.error('Error loading jobs:', error);
          this.jobsError = 'Failed to load jobs. Please try again later.';
          this.isLoadingJobs = false;
        }
      });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadFeaturedJobs(page);
    }
  }

  get pages(): number[] {
    const maxPages = 6;
    const pages: number[] = [];
    
    let startPage = Math.max(1, this.currentPage - 2);
    let endPage = Math.min(this.totalPages, startPage + maxPages - 1);
    
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  /**
   * Handle search form submission
   */
  onSearch(): void {
    if (this.searchKeyword && this.searchLocation) {
      this.router.navigate(['/jobs/search'], {
        queryParams: {
          keyword: this.searchKeyword,
          location: this.searchLocation
        }
      });
    }
  }

  /**
   * Navigate to jobs page
   */
  navigateToJobs(): void {
    this.router.navigate(['/jobs/search']);
  }

  /**
   * Navigate to sign up page
   */
  navigateToSignUp(): void {
    this.router.navigate(['/auth/register']);
  }

  /**
   * Navigate to job details
   */
  viewJobDetails(job: JobOfferDisplay): void {
    // Open job URL in new tab
    window.open(job.url, '_blank');
  }

  /**
   * Handle popular search click
   */
  onPopularSearchClick(searchTerm: string): void {
    this.searchKeyword = searchTerm;
    this.router.navigate(['/jobs/search'], {
      queryParams: {
        keyword: searchTerm
      }
    });
}
}
