import { AlreadyExisting, NotFoundError } from '@/shared/domain/erros';
import { UserDrizzleRepository } from '../user-drizzle';
import { Connection } from '@/shared/infra/db/drizzle/connection';
import { users } from '@/shared/infra/db/drizzle/schemas/user/schema';
import { User, UserID } from '@/user/domain/entity/user';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { UserSearchParams } from '@/user/domain/repository';

describe('user drizzle unit test', () => {
  let repository: UserDrizzleRepository;
  let db_connection: NodePgDatabase;
  beforeEach(async () => {
    db_connection = await Connection.getConnection();
    repository = new UserDrizzleRepository(db_connection);
    await db_connection.delete(users);
  });

  afterEach(async () => {
    await db_connection.delete(users);
  });

  afterAll(async () => {
    await Connection.connectionDriver.end();
  });

  it('Should be inserts a user', async () => {
    const user = User.newUser(
      'some name',
      'test@mail.com',
      new Date('02/07/1999'),
      'some password'
    );

    await repository.insert(user);

    const model = await db_connection
      .select()
      .from(users)
      .where(eq(users.id, user.getID().getValue()))
      .prepare('model')
      .execute();

    expect(user.toJSON()).toStrictEqual({
      id: UserID.from(model[0].id),
      name: model[0].name,
      email: model[0].email,
      password: model[0].password,
      birth_date: model[0].birth_date,
      created_at: model[0].created_at,
      updated_at: model[0].updated_at,
      deleted_at: model[0].deleted_at,
    });
  });

  it('Should throw erro when add duplicated user email', async () => {
    const user = User.newUser(
      'some name',
      'test@mail.com',
      new Date('02/07/1999'),
      'some password'
    );

    await repository.insert(user);

    await expect(repository.insert(user)).rejects.toThrow(
      new AlreadyExisting(`Email already existing`)
    );
  });

  it('should throw erro when invalid uuid', async () => {
    await expect(repository.findById('fake id')).rejects.toThrow(
      new NotFoundError('invalid input syntax for type uuid: "fake id"')
    );
    const uuid = UserID.unique();
    await expect(repository.findById(uuid.getValue())).rejects.toThrow(
      new NotFoundError(`Entity Not Found Using ID ${uuid.getValue()}`)
    );
  });

  it('should be find user by id', async () => {
    const user = User.newUser(
      'some name',
      'test@mail.com',
      new Date('02/07/1999'),
      'some password'
    );
    await repository.insert(user);
    let entityFound = await repository.findById(user.getID().getValue());
    expect(user.toJSON()).toStrictEqual(entityFound.toJSON());
    entityFound = await repository.findById(user.getID().getValue());
    expect(user.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it('should list all users', async () => {
    const user = User.newUser(
      'some name',
      'test@mail.com',
      new Date('02/07/1999'),
      'some password'
    );
    const user2 = User.newUser(
      'some name',
      'test2@mail.com',
      new Date('02/07/1999'),
      'some password'
    );
    await repository.insert(user);
    await repository.insert(user2);

    const entities = await repository.findAll();
    expect(entities).toHaveLength(2);
    expect(entities[0].toJSON()).toStrictEqual(user.toJSON());
    expect(entities[1].toJSON()).toStrictEqual(user2.toJSON());
  });

  it('should updated user', async () => {
    const user = User.newUser(
      'some name',
      'test@mail.com',
      new Date('02/07/1999'),
      'some password'
    );

    await repository.insert(user);
    await user.update({
      name: 'user updated',
    });

    await repository.update(user);
    const foundCategory = await repository.findById(user.getID().getValue());
    expect(user.toJSON()).toStrictEqual(foundCategory.toJSON());
  });

  it('should delete user', async () => {
    const user = User.newUser(
      'some name',
      'test@mail.com',
      new Date('02/07/1999'),
      'some password'
    );

    await repository.insert(user);
    await repository.delete(user.getID().getValue());

    const usersFound = await db_connection.select().from(users);
    expect(usersFound).toHaveLength(0);
  });

  it('should search user', async () => {
    const created_at = new Date();

    const userProps = [
      {
        id: '0d2d9aba-cc11-412e-aa2e-358bca445cb2',
        name: 'some name 1',
        email: 'email@email.com',
        birth_date: new Date('07/02/1999'),
        password: 'some image 1',
        created_at: created_at,
        updated_at: new Date(),
        deleted_at: null,
      },
      {
        id: 'bcfc9d83-f5cf-4e64-8d4f-709f9bcdc520',
        name: 'some name 2',
        email: 'email2@email.com',
        birth_date: new Date('07/02/1998'),
        password: 'some image 2',
        created_at: created_at,
        updated_at: new Date(),
        deleted_at: null,
      },
    ];

    const arrayUsers = [];
    for (const us of userProps) {
      const user = await db_connection
        .insert(users)
        .values({
          id: us.id,
          name: us.name,
          email: us.email,
          birth_date: us.birth_date,
          password: us.password,
          created_at: us.created_at,
          updated_at: us.updated_at,
          deleted_at: us.deleted_at,
        })
        .prepare('create_user')
        .execute();

      arrayUsers.push(user);
    }
    const result = await repository.search(
      new UserSearchParams({
        page: 1,
        per_page: 2,
        // sort: 'name',
        column: ['name', 'email', 'birth_date'],
        filter: ['', '', ''],
      })
    );

    console.log(result.items);
  });
});
