import { Entity } from '@/shared/domain/entity';
import { SearchResult } from '@/shared/domain/repository';

import { PaginationOutputDto } from '../dtos/pagination-output.dto';

export class PaginationOutputMapper {
  static toPaginationOutput<T, P>(
    result: SearchResult<Entity<T, P>>
  ): Omit<PaginationOutputDto, 'items'> {
    return {
      total: result.total,
      current_page: result.current_page,
      last_page: result.last_page,
      per_page: result.per_page,
    };
  }
}
