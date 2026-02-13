
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';


import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './job-search.component.html',
  styleUrl: './job-search.component.css'
})
export class JobSearchComponent implements OnInit {
 
  isLoading = false;
  error = '';
  
  // Search parameters
  keyword = '';
  location = '';
  
  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalItems = 0;

  constructor(
    
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.keyword = params['keyword'] || '';
      this.location = params['location'] || '';
      this.currentPage = params['page'] ? +params['page'] : 1;
      
      this.performSearch();
    });
  }

  performSearch(): void {
    this.isLoading = true;
    this.error = '';
    
   
   
  }

  onSearch(): void {
    // Reset to page 1 for new search
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        keyword: this.keyword,
        location: this.location,
        page: 1
      },
      queryParamsHandling: 'merge'
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page },
        queryParamsHandling: 'merge'
      });
      window.scrollTo(0, 0);
    }
  }

  get pages(): number[] {
    const maxPages = 5;
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
}
