import { SearchResult } from '@/shared/domain/repository';

import { PaginationOutputDto } from '../dtos/pagination-output.dto';

export class PaginationOutputMapper {
  static toPaginationOutput(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: SearchResult<any>
  ): Omit<PaginationOutputDto, 'items'> {
    return {
      total: result.total,
      current_page: result.current_page,
      last_page: result.last_page,
      per_page: result.per_page,
    };
  }
}
