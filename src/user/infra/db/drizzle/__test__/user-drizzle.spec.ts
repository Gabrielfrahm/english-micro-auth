import { AlreadyExisting, NotFoundError } from '@/shared/domain/erros';
import { UserDrizzleRepository } from '../user-drizzle';
import { Connection } from '@/shared/infra/db/drizzle/connection';
import { users } from '@/shared/infra/db/drizzle/schemas/user/schema';
import { User, UserID } from '@/user/domain/entity/user';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

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
});
