import {
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
} from '@/shared/domain/repository';
import { User } from '@/user/domain/entity/user';

export type Filter = string[];
export type Column = string[];
export class UserSearchParams extends SearchParams<Filter, Column> {}

export class UserSearchResult extends SearchResult<User, Filter, Column> {}

export interface UserRepository
  extends SearchableRepositoryInterface<
    User,
    Filter,
    Column,
    UserSearchParams,
    UserSearchResult
  > {}
