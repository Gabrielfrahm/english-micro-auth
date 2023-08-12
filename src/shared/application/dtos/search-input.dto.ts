import { SortDirection } from '@/shared/domain/repository';

export type SearchInputDto<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
  column?: string | null;
};
