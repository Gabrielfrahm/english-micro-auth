/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchResult } from '@/shared/domain/repository';

import { PaginationOutputMapper } from '../pagination-output.mapper';

describe('Pagination output mapper unit test', () => {
  it('should convert a SearchResult in output', () => {
    const result = new SearchResult({
      items: ['fake'] as any,
      total: 1,
      current_page: 1,
      per_page: 1,
      sort: null,
      sort_dir: null,
      filter: 'Fake',
      column: null,
    });
    const output = PaginationOutputMapper.toPaginationOutput(result);
    expect(output).toStrictEqual({
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 1,
    });
  });
});
