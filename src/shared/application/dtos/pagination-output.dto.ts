export type PaginationOutputDto<Items = unknown> = {
  items: Items[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
};
