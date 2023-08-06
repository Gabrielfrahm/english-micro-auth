/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateRoot, Identifier } from '../entity';

interface Props {}

export interface RepositoryInterface<
  E extends AggregateRoot<Identifier, Props>,
> {
  insert(entity: E): Promise<void>;
  findById(id: string | Identifier): Promise<E>;
  findAll(id?: string): Promise<E[]>;
  update(entity: E): Promise<void>;
  delete(id: string | Identifier): Promise<void>;
}

export type SortDirection = 'asc' | 'desc';

export type SearchProps<Filter = string[], Column = string[]> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
  column?: Column | null;
};

export class SearchParams<Filter = string[], Column = string[]> {
  protected _page: number;
  protected _per_page: number = 10;
  protected _sort: string | null;
  protected _sort_dir: SortDirection | null;
  protected _filter: Filter | null;
  protected _column: Column | null;

  constructor(props: SearchProps<Filter, Column> = {}) {
    this.page = props.page;
    this.per_page = props.per_page;
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;
    this.column = props.column;
  }

  get page(): number {
    return this._page;
  }

  private set page(value: number) {
    let _page = +value;

    if (
      Number.isNaN(_page) ||
      _page <= 0 ||
      parseInt(String(_page)) !== _page
    ) {
      _page = 1;
    }
    this._page = _page;
  }

  get per_page(): number {
    return this._per_page;
  }
  private set per_page(value: number) {
    let _per_page = value === (true as any) ? this._per_page : +value;

    if (
      Number.isNaN(_per_page) ||
      _per_page <= 0 ||
      parseInt(_per_page as any) !== _per_page
    ) {
      _per_page = this._per_page;
    }
    this._per_page = _per_page;
  }

  get sort(): string | null {
    return this._sort;
  }

  private set sort(value: string | null) {
    this._sort =
      value === null || value === undefined || value === '' ? null : `${value}`;
  }

  get sort_dir(): string | null {
    return this._sort_dir;
  }

  private set sort_dir(value: string | null) {
    if (!this.sort) {
      this._sort_dir = null;
      return;
    }
    const dir = `${value}`.toLocaleLowerCase();
    this._sort_dir = dir !== 'asc' && dir !== 'desc' ? 'asc' : dir;
  }

  get filter(): Filter | null {
    return this._filter;
  }

  private set filter(value: Filter | null) {
    this._filter =
      value === null || value === undefined ? null : ([`${value}`] as Filter);
  }

  get column(): Column | null {
    return this._column;
  }

  private set column(value: Column | null) {
    this._column =
      value === null || value === undefined ? null : ([`${value}`] as Column);
  }
}

type SearchResultProps<
  E extends AggregateRoot<Identifier, Props>,
  Filter,
  Column,
> = {
  items: E[];
  total: number;
  current_page: number;
  per_page: number;
  sort: string | null;
  sort_dir: string | null;
  filter: Filter | null;
  column: Column | null;
};

export class SearchResult<
  E extends AggregateRoot<Identifier, Props>,
  Filter = string | string[],
  Column = string[],
> {
  readonly items: E[];
  readonly total: number;
  readonly current_page: number;
  readonly per_page: number;
  readonly last_page: number;
  readonly sort: string | null;
  readonly sort_dir: string | null;
  readonly filter: Filter;
  readonly column: Column | null;

  constructor(props: SearchResultProps<E, Filter, Column>) {
    this.items = props.items;
    this.total = props.total;
    this.current_page = props.current_page;
    this.per_page = props.per_page;
    this.last_page = Math.ceil(this.total / this.per_page);
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;
    this.column = props.column;
  }
  toJSON(forceEntity = false): {
    items: unknown[];
    total: number;
    current_page: number;
    per_page: number;
    last_page: number;
    sort: string;
    sort_dir: string;
    filter: Filter;
    column: Column;
  } {
    return {
      items: forceEntity ? this.items.map((item) => item.toJSON()) : this.items,
      total: this.total,
      current_page: this.current_page,
      per_page: this.per_page,
      last_page: this.last_page,
      sort: this.sort,
      sort_dir: this.sort_dir,
      filter: this.filter,
      column: this.column,
    };
  }
}

export interface SearchableRepositoryInterface<
  E extends AggregateRoot<Identifier, Props>,
  Filter = string[],
  Column = string[],
  SearchInput = SearchParams<Filter, Column>,
  SearchOutput = SearchResult<E, Filter, Column>,
> extends RepositoryInterface<E> {
  sortableFields: string[];
  search(props: SearchInput, id?: string): Promise<SearchOutput>;
}
