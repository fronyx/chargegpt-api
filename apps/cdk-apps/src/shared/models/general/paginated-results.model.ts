export interface PaginatedResults<T> {
  results: T[];
  count: number;
  totalCount: number;
  lastPage: number;
  currentPage: number;
  prevPage: number;
  nextPage: number;
}
