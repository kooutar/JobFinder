// Updated Job Offer Models - Matching Actual API Response

export interface JobOffer {
  id?: string;
  contents: string;
  name: string;
  type: string;
  publication_date: string;
  short_name: string;
  // Add other fields from the API response as needed
  locations?: any[];
  tags?: string[];
}

export interface JobApiResponse {
  page: number;
  page_count: number;
  items_per_page: number;
  took: number;
  timed_out: boolean;
  total: number;
  results: JobOffer[]; // ← Changed from 'data' to 'results'
  aggregations: any;
}

export interface JobSearchCriteria {
  keyword: string;
  location: string;
  page?: number;
}

export interface JobOfferDisplay {
  id: string;
  title: string;
  company: string;
  location: string;
  datePublished: string;
  description: string;
  shortDescription: string;
  url: string;
  remote: boolean;
  tags: string[];
  jobTypes: string[];
}

export interface JobResponseDisplay {
  jobs: JobOfferDisplay[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}