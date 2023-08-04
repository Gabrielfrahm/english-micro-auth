import {
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
} from '@/shared/domain/repository';
import { User } from '@/user/domain/entity/user';

export type Filter = string | string[];

export class UserSearchParams extends SearchParams<Filter> {}

export class UserSearchResult extends SearchResult<User, Filter> {}

export interface UserRepository
  extends SearchableRepositoryInterface<
    User,
    Filter,
    UserSearchParams,
    UserSearchResult
  > {}
