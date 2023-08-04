import { UserDrizzleRepository } from '../user-drizzle';
import { Connection } from '@/shared/infra/db/drizzle/connection';
import { users } from '@/shared/infra/db/drizzle/schemas/user/schema';
import { User } from '@/user/domain/entity/user';
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

    // const model = await prismaClient.user.findUnique({
    //   where: {
    //     id: user.id,
    //   },
    // });
    // expect(user.toJSON()).toStrictEqual({
    //   id: model.id,
    //   email: model.email,
    //   email_confirmation: model.email_confirmation,
    //   name: model.name,
    //   password: model.password,
    //   created_at: model.created_at,
    // });
  });
});
