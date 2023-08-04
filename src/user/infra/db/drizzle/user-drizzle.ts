/* eslint-disable @typescript-eslint/no-unused-vars */
import { Identifier } from '@/shared/domain/entity';
import { AlreadyExisting, NotFoundError } from '@/shared/domain/erros';

import { users } from '@/shared/infra/db/drizzle/schemas/user/schema';
import { User } from '@/user/domain/entity/user';
import {
  UserRepository,
  UserSearchParams,
  UserSearchResult,
} from '@/user/domain/repository';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { UserMapper } from './user-mapper';
import { User as UserDrizzle } from '@/shared/infra/db/drizzle/schemas/user/schema';

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
    await this._checkEmail(entity.props.email);
    await this.userDrizzle
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
      .prepare('create_user')
      .execute();
  }

  async findById(id: string | Identifier): Promise<User> {
    const _id = `${id}`;
    const model = await this._get(_id);
    if (model) {
      return UserMapper.toEntity(model);
    }
  }

  async findAll(id?: string): Promise<User[]> {
    const usersFind = await this.userDrizzle
      .select()
      .from(users)
      .prepare('all_users')
      .execute();

    return usersFind.map((item) => UserMapper.toEntity(item));
  }

  update(entity: User): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(id: string | Identifier): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private async _checkEmail(email: string, id?: string): Promise<void> {
    if (id) {
      const userExistWithId = await this.userDrizzle
        .select()
        .from(users)
        .where(eq(users.id, id))
        .prepare('userExistWithId')
        .execute();

      if (userExistWithId[0] && userExistWithId[0].id !== id) {
        throw new AlreadyExisting(`Email already existing`);
      }
    } else {
      const userExits = await this.userDrizzle
        .select()
        .from(users)
        .where(eq(users.email, email))
        .prepare('userExits')
        .execute();

      if (userExits[0]) {
        throw new AlreadyExisting(`Email already existing`);
      }
    }
  }

  private async _get(id: string): Promise<UserDrizzle> {
    const user = await this.userDrizzle
      .select()
      .from(users)
      .where(eq(users.id, id))
      .prepare('user_by_id')
      .execute();

    if (!user[0]) {
      throw new NotFoundError(`Entity Not Found Using ID ${id}`);
    }
    return user[0];
  }
}
