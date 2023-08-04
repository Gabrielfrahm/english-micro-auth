/* eslint-disable @typescript-eslint/no-unused-vars */
import { Identifier } from '@/shared/domain/entity';

import { users } from '@/shared/infra/db/drizzle/schemas/user/schema';
import { User } from '@/user/domain/entity/user';
import {
  UserRepository,
  UserSearchParams,
  UserSearchResult,
} from '@/user/domain/repository';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export class UserDrizzleRepository implements UserRepository {
  sortableFields: string[] = [
    'email',
    'name',
    'created_at',
    'updated_at',
    'deleted_at',
  ];
  constructor(private userDrizzle: NodePgDatabase) {}

  search(props: UserSearchParams, id?: string): Promise<UserSearchResult> {
    throw new Error('Method not implemented.');
  }
  async insert(entity: User): Promise<void> {
    const user = await this.userDrizzle
      .insert(users)
      .values({
        id: entity.getID().getValue(),
        name: entity.props.name,
        email: entity.props.email,
        birth_date: entity.props.birth_date,
        password: entity.props.password,
        created_at: entity.props.created_at,
        updated_at: entity.props.updated_at,
        deleted_at: entity.props.deleted_at,
      })
      .returning();
    console.log('user', user);
  }
  findById(id: string | Identifier): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findAll(id?: string): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  update(entity: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string | Identifier): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
