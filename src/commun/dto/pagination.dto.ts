export type Pagination = {
  page: number;
  pagesize: number;
  total?: number;
  orderby?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  page: number;
  pagesize: number;
  total: number;
};
