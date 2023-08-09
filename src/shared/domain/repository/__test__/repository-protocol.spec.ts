/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchParams, SearchResult } from '../repository-protocol';

describe('SearchParams Units Test', () => {
  test('page prop', () => {
    const params = new SearchParams();

    expect(params.page).toBe(1);

    const arrange = [
      { page: null, expected: 1 },
      { page: undefined, expected: 1 },
      { page: '', expected: 1 },
      { page: 'fake', expected: 1 },
      { page: 0, expected: 1 },
      { page: -1, expected: 1 },
      { page: 5.5, expected: 1 },
      { page: true, expected: 1 },
      { page: false, expected: 1 },
      { page: {}, expected: 1 },
      { page: 1, expected: 1 },
      { page: 2, expected: 2 },
    ];

    arrange.forEach((item) => {
      expect(new SearchParams({ page: Number(item.page) }).page).toBe(
        item.expected
      );
    });
  });

  test('per_page prop', () => {
    const params = new SearchParams();
    expect(params.per_page).toBe(10);

    const arrange = [
      { per_page: null, expected: 10 },
      { per_page: undefined, expected: 10 },
      { per_page: '', expected: 10 },
      { per_page: 'fake', expected: 10 },
      { per_page: 0, expected: 10 },
      { per_page: -1, expected: 10 },
      { per_page: 5.5, expected: 10 },
      { per_page: true, expected: 10 },
      { per_page: false, expected: 10 },
      { per_page: {}, expected: 10 },
      { per_page: 1, expected: 1 },
      { per_page: 2, expected: 2 },
    ];

    arrange.forEach((item) => {
      expect(
        new SearchParams({ per_page: item.per_page as any }).per_page
      ).toBe(item.expected);
    });
  });

  test('sort prop', () => {
    const params = new SearchParams();
    expect(params.sort).toBeNull();

    const arrange = [
      { sort: null, expected: null },
      { sort: undefined, expected: null },
      { sort: '', expected: null },
      { sort: 0, expected: '0' },
      { sort: -1, expected: '-1' },
      { sort: 5.5, expected: '5.5' },
      { sort: true, expected: 'true' },
      { sort: false, expected: 'false' },
      { sort: {}, expected: '[object Object]' },
      { sort: 'field', expected: 'field' },
      { sort: 1, expected: '1' },
      { sort: 2, expected: '2' },
    ];

    arrange.forEach((item) => {
      expect(new SearchParams({ sort: item.sort as any }).sort).toBe(
        item.expected
      );
    });
  });
  test('sort_dir prop', () => {
    let params = new SearchParams({ sort: null });
    expect(params.sort_dir).toBeNull();

    params = new SearchParams({ sort: '' });
    expect(params.sort_dir).toBeNull();

    params = new SearchParams({ sort: undefined });
    expect(params.sort_dir).toBeNull();

    const arrange = [
      { sort_dir: null, expected: 'asc' },
      { sort_dir: undefined, expected: 'asc' },
      { sort_dir: '', expected: 'asc' },
      { sort_dir: 0, expected: 'asc' },
      { sort_dir: -1, expected: 'asc' },
      { sort_dir: 5.5, expected: 'asc' },
      { sort_dir: true, expected: 'asc' },
      { sort_dir: false, expected: 'asc' },
      { sort_dir: 'asc', expected: 'asc' },
      { sort_dir: 'ASC', expected: 'asc' },
      { sort_dir: 'desc', expected: 'desc' },
      { sort_dir: 'DESC', expected: 'desc' },
    ];

    arrange.forEach((item) => {
      expect(
        new SearchParams({ sort: 'field', sort_dir: item.sort_dir as any })
          .sort_dir
      ).toBe(item.expected);
    });
  });

  test('filter prop', () => {
    const params = new SearchParams();
    expect(params.filter).toBeNull();

    const arrange = [
      { filter: null, expected: null },
      { filter: undefined, expected: null },
      { filter: '', expected: [''] },
      { filter: 0, expected: ['0'] },
      { filter: -1, expected: ['-1'] },
      { filter: 5.5, expected: ['5.5'] },
      { filter: true, expected: ['true'] },
      { filter: false, expected: ['false'] },
      { filter: {}, expected: ['[object Object]'] },
      { filter: 'field', expected: ['field'] },
      { filter: 1, expected: ['1'] },
      { filter: 2, expected: ['2'] },
    ];

    arrange.forEach((item) => {
      expect(
        new SearchParams({ filter: item.filter as any }).filter
      ).toStrictEqual(item.expected);
    });
  });
});

describe('Search result unit test', () => {
  test('constructor props', () => {
    let result = new SearchResult({
      items: ['entity1', 'entity2'] as any,
      total: 4,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
      column: null,
    });
    expect(result.toJSON()).toStrictEqual({
      items: ['entity1', 'entity2'] as any,
      total: 4,
      last_page: 2,
      current_page: 1,
      per_page: 2,
      sort: null,
      sort_dir: null,
      filter: null,
      column: null,
    });
    result = new SearchResult({
      items: ['entity1', 'entity2'] as any,
      total: 4,
      current_page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'asc',
      filter: 'test',
      column: 'name',
    });
    expect(result.toJSON()).toStrictEqual({
      items: ['entity1', 'entity2'] as any,
      total: 4,
      last_page: 2,
      current_page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'asc',
      filter: 'test',
      column: 'name',
    });
  });

  it('should set last_page 1  when  per_page field is greater than total field', () => {
    const result = new SearchResult({
      items: ['entity1', 'entity2'] as any,
      total: 4,
      current_page: 1,
      per_page: 15,
      sort: 'name',
      sort_dir: 'asc',
      filter: 'test',
      column: 'name',
    });

    expect(result.last_page).toBe(1);
  });

  test('last_page prop when is total not multiple of per_page', () => {
    const result = new SearchResult({
      items: ['entity1', 'entity2'] as any,
      total: 101,
      current_page: 1,
      per_page: 20,
      sort: 'name',
      sort_dir: 'asc',
      filter: 'test',
      column: 'name',
    });

    expect(result.last_page).toBe(6);
  });
});
