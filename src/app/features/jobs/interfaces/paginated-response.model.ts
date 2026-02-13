export interface PaginatedResponse<T> {
  page: number;
  page_count: number;
  items_per_page: number;
  total: number;
  results: T[];
}
