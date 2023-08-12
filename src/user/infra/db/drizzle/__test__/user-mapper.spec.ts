import { Hasher } from '@/shared/infra/adapters/cryptography/cryptography.interface';
import { Connection } from '@/shared/infra/db/drizzle/connection';
import { users } from '@/shared/infra/db/drizzle/schemas/user/schema';
import { User, UserID } from '@/user/domain/entity/user';

import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { UserMapper } from '../user-mapper';

class StubHasher implements Hasher {
  async hash(): Promise<string> {
    return await Promise.resolve('hashed_password');
  }
}
describe('user mapper unit test', () => {
  let db_connection: NodePgDatabase;
  beforeEach(async () => {
    db_connection = await Connection.getConnection();
    await db_connection.delete(users);
  });

  afterEach(async () => {
    await db_connection.delete(users);
  });

  afterAll(async () => {
    await Connection.connectionDriver.end();
  });

  it('should convert a user to a user entity', async () => {
    const hasher = new StubHasher();
    const user = User.newUser(
      hasher,
      'some name',
      'test@mail.com',
      new Date('02/07/1999'),
      'some password'
    );

    const model = await db_connection
      .insert(users)
      .values({
        id: user.getID().getValue(),
        name: user.props.name,
        email: user.props.email,
        birth_date: user.props.birth_date,
        password: user.props.password,
        created_at: user.props.created_at,
        updated_at: user.props.updated_at,
        deleted_at: user.props.deleted_at,
      })
      .returning()
      .prepare('model')
      .execute();

    const entity = UserMapper.toEntity(model[0]);

    const {
      id,
      birth_date,
      email,
      name,
      password,
      created_at,
      deleted_at,
      updated_at,
    } = model[0];

    const user_id = UserID.from(id);

    expect(entity.toJSON()).toStrictEqual(
      User.newUser(
        hasher,
        name,
        email,
        birth_date,
        password,
        user_id,
        created_at,
        updated_at,
        deleted_at
      ).toJSON()
    );
  });
});
