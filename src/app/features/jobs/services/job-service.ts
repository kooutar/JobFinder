import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  JobApiResponse,
  JobOffer,
  JobOfferDisplay,
  JobSearchCriteria,
  JobResponseDisplay,
} from '../interfaces/job-offer.model';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private Api_URL = '/api/jobs';
  private httpClient = inject(HttpClient);



  
 getJobs(page: number = 1): Observable<JobApiResponse> {
  const params = new HttpParams().set('page', page.toString());
  return this.httpClient.get<JobApiResponse>(`${this.Api_URL}`, { params }).pipe(
    tap((response) => {
      console.log('✅ API Response:', response);
      console.log('📊 Jobs count:', response.results?.length); // Changed from data to results
    })
  );
}

/**
 * Get jobs transformed for display
 */
getJobsForDisplay(page: number = 1): Observable<JobResponseDisplay> {
  return this.getJobs(page).pipe(

    map((response: JobApiResponse) => {
      // Changed from response.data to response.results
      if (!response.results || !Array.isArray(response.results)) {
       
        return {
          jobs: [],
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0
          }
        };
      }

      // Sort by publication date (newest first)
      response.results.sort((a, b) => {
        return new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime();
      });

      const transformed = response.results.map((job) => this.transformJobForDisplay(job));
     
      
      return {
        jobs: transformed,
        pagination: {
          currentPage: response.page || page,
          totalPages: response.page_count || 1,
          totalItems: response.total || transformed.length
        }
      };
    })
  );
}

/**
 * Transform raw job data to display format
 */
private transformJobForDisplay(job: JobOffer): JobOfferDisplay {
  // Extract company name from the HTML content if needed
  const companyMatch = job.contents?.match(/<strong>([^<]+)<\/strong>/);
  const company = companyMatch ? companyMatch[1] : 'Company Name Not Available';
  
  // Create short description from HTML content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = job.contents || '';
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  const shortDescription = textContent.substring(0, 200) + (textContent.length > 200 ? '...' : '');
  
  return {
    id: job.short_name || '',
    title: job.name || 'No Title',
    company: company,
    location: 'Location Not Specified', // Extract from content if available
    datePublished: this.formatDate(job.publication_date),
    description: job.contents || '',
    shortDescription: shortDescription,
    url: `https://yourjobsite.com/jobs/${job.short_name}`, // Adjust URL as needed
    remote: job.type === 'remote',
    tags: job.tags || [],
    jobTypes: [job.type || 'external']
  };
}

/**
 * Format date from ISO string to readable format
 */
private formatDate(dateString: string): string {
  if (!dateString) return 'Date Not Available';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

  /**
   * Search jobs by criteria
   */
  // searchJobs(criteria: JobSearchCriteria): Observable<JobOfferDisplay[]> {
  //   const page = criteria.page || 1;

  //   return this.getJobs(page).pipe(
  //     map((response) => {
  //       if (!response.data || !Array.isArray(response.data)) {
  //         return [];
  //       }
  //       // Filter jobs based on search criteria
  //       let filteredJobs = response.data;

  //       // Filter by keyword (search in title only, not description)
  //       if (criteria.keyword) {
  //         const keyword = criteria.keyword.toLowerCase();
  //         filteredJobs = filteredJobs.filter((job) => job.title.toLowerCase().includes(keyword));
  //       }

  //       // Filter by location
  //       if (criteria.location) {
  //         const location = criteria.location.toLowerCase();
  //         filteredJobs = filteredJobs.filter(
  //           (job) =>
  //             job.location.toLowerCase().includes(location) ||
  //             (job.remote && location.includes('remote')),
  //         );
  //       }

  //       // Transform and sort by date (most recent first)
  //       return filteredJobs
  //         .map((job) => this.transformJobForDisplay(job))
  //         .sort(
  //           (a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime(),
  //         );
  //     }),
  //   );
  // }

  /**
   * Get a single job by slug
   */
  // getJobBySlug(slug: string): Observable<JobOffer | undefined> {
  //   return this.httpClient
  //     .get<JobApiResponse>(`${this.Api_URL}`)
  //     .pipe(map((response) => response.data.find((job) => job.slug === slug)));
  // }

  /**
   * Transform raw job data to display format
   */
  // private transformJobForDisplay(job: JobOffer): JobOfferDisplay {
  //   return {
  //     id: job.slug,
  //     title: job.title,
  //     company: job.company_name,
  //     location: job.remote ? 'Remote' : job.location,
  //     datePublished: this.formatDate(job.created_at),
  //     description: job.description,
  //     shortDescription: this.truncateDescription(job.description, 150),
  //     url: job.url,
  //     remote: job.remote,
  //     tags: job.tags,
  //     jobTypes: job.job_types,
  //   };
  // }

  /**
   * Format Unix timestamp to readable date
   */
  // private formatDate(timestamp: number): string {
  //   const date = new Date(timestamp * 1000);
  //   const now = new Date();
  //   const diffTime = Math.abs(now.getTime() - date.getTime());
  //   const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  //   if (diffDays === 0) return 'Today';
  //   if (diffDays === 1) return 'Yesterday';
  //   if (diffDays < 7) return `${diffDays} days ago`;
  //   if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  //   if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

  //   return date.toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //   });
  // }

  /**
   * Truncate description to specified length
   */
  private truncateDescription(description: string, maxLength: number): string {
    if (!description) return '';

    // Remove HTML tags
    const cleanText = description.replace(/<[^>]*>/g, ' ').trim();

    if (cleanText.length <= maxLength) return cleanText;

    return cleanText.substring(0, maxLength).trim() + '...';
  }
}
