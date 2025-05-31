export class PaginatedResults<T> {
  edges: T[];
  total: number;
  page: number;
  pageSize: number;
}
