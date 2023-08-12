import { BcryptAdapter } from '@/shared/infra/adapters/cryptography/bcrypter';
import { Connection } from '@/shared/infra/db/drizzle/connection';
import { users } from '@/shared/infra/db/drizzle/schemas/user/schema';
import { UserDrizzleRepository } from '@/user/infra/db/drizzle/user-drizzle';

import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { CreateUserUseCase } from '../create-user.usecase';

describe('create use case integration test', () => {
  let repository: UserDrizzleRepository;
  let useCase: CreateUserUseCase.UseCase;
  let db_connection: NodePgDatabase;
  const hasher = new BcryptAdapter.HasherAdapter(12);

  beforeEach(async () => {
    db_connection = await Connection.getConnection();
    repository = new UserDrizzleRepository(db_connection);
    useCase = new CreateUserUseCase.UseCase(repository, hasher);
    await db_connection.delete(users);
  });

  afterEach(async () => {
    await db_connection.delete(users);
  });
  it('should create a user ', async () => {
    const spyRepository = jest.spyOn(repository, 'insert');
    const output = await useCase.execute({
      name: 'gabriel',
      email: 'teste@test.com',
      birth_date: new Date(),
      password: 'some password',
    });

    const entity = await repository.findById(output.id.getValue());
    expect(spyRepository).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.getID(),
      name: entity.getName(),
      birth_date: entity.getBirthDate(),
      email: entity.getEmail(),
      password: entity.password,
      created_at: entity.getCreatedAt(),
      updated_at: entity.getUpdatedAt(),
      deleted_at: entity.getDeletedAt(),
    });
  });
});
