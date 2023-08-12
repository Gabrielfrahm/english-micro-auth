/* eslint-disable @typescript-eslint/no-unused-vars */
import { Identifier } from '@/shared/domain/entity';
import { AlreadyExisting, NotFoundError } from '@/shared/domain/errors';
import { users } from '@/shared/infra/db/drizzle/schemas/user/schema';
import { User as UserDrizzle } from '@/shared/infra/db/drizzle/schemas/user/schema';
import { User } from '@/user/domain/entity/user';
import {
  UserRepository,
  UserSearchParams,
  UserSearchResult,
} from '@/user/domain/repository';

import { randomUUID } from 'crypto';
import { and, asc, desc, eq, like, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { UserMapper } from './user-mapper';

export class UserDrizzleRepository implements UserRepository {
  sortableFields: string[] = [
    'email',
    'name',
    'created_at',
    'updated_at',
    'deleted_at',
  ];
  constructor(private userDrizzle: NodePgDatabase) {}

  async search(
    props: UserSearchParams,
    id?: string
  ): Promise<UserSearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;

    const [filter_name, filter_email, filter_birth_date] =
      props.filter[0].split(',');

    const usersSearch = await this.userDrizzle
      .select()
      .from(users)
      .where(eq(users.deleted_at, null))
      .where(
        filter_name !== '' || filter_email !== '' || filter_birth_date !== ''
          ? and(
              filter_name !== ''
                ? sql.raw(`lower(name) LIKE lower('%${filter_name}%')`)
                : undefined,
              filter_email !== ''
                ? like(users.email, `%${filter_email}%`)
                : undefined,
              filter_birth_date !== ''
                ? sql.raw(
                    `CAST(birth_date as text) LIKE '%${filter_birth_date}%'`
                  )
                : undefined
            )
          : null
      )
      .orderBy(
        props.sort_dir === 'asc'
          ? asc(users[props.sort] ?? users.created_at)
          : desc(users[props.sort] ?? users.created_at)
      )
      .limit(limit)
      .offset(offset)
      .prepare(randomUUID())
      .execute();

    const count = await this.userDrizzle
      .select({
        count: sql.raw(`count(*)`),
      })
      .from(users)
      .where(eq(users.deleted_at, null))
      .where(
        filter_name !== '' || filter_email !== '' || filter_birth_date !== ''
          ? and(
              filter_name !== ''
                ? sql.raw(`lower(name) LIKE lower('%${filter_name}%')`)
                : undefined,
              filter_email !== ''
                ? like(users.email, `%${filter_email}%`)
                : undefined,
              filter_birth_date !== ''
                ? sql.raw(
                    `CAST(birth_date as text) LIKE '%${filter_birth_date}%'`
                  )
                : undefined
            )
          : null
      )
      .orderBy(
        props.sort_dir === 'asc'
          ? asc(users[props.sort] ?? users.created_at)
          : desc(users[props.sort] ?? users.created_at)
      )
      .groupBy(users.id)
      .prepare(randomUUID())
      .execute();

    return new UserSearchResult({
      items: usersSearch.map((item) => UserMapper.toEntity(item)),
      current_page: props.page,
      per_page: props.per_page,
      total: count.length,
      filter: props.filter,
      sort: props.sort,
      sort_dir: props.sort_dir,
      column: props.column,
    });
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

  async update(entity: User): Promise<void> {
    await this._checkEmail(entity.props.email, entity.getID().getValue());
    await this._get(entity.getID().getValue());
    await this.userDrizzle
      .update(users)
      .set({
        name: entity.props.name,
        email: entity.props.email,
        birth_date: entity.props.birth_date,
        password: entity.props.password,
        created_at: entity.props.created_at,
        updated_at: entity.props.updated_at,
        deleted_at: entity.props.deleted_at,
      })
      .where(eq(users.id, entity.getID().getValue()))
      .prepare('update_user')
      .execute();
  }

  async delete(id: string | Identifier): Promise<void> {
    const _id = `${id}`;
    await this._get(_id);
    await this.userDrizzle.delete(users).where(eq(users.id, _id));
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
      .where(eq(users.deleted_at, null))
      .where(eq(users.id, id))
      .prepare('user_by_id')
      .execute();

    if (!user[0]) {
      throw new NotFoundError(`Entity Not Found Using ID ${id}`);
    }
    return user[0];
  }
}
