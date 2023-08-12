import { BcryptAdapter } from '@/shared/infra/adapters/cryptography/bcrypter';
import { User } from '@/user/domain/entity/user';

import UserOutputMapper from '../user-output.mapper';

describe('User output mapper unit test', () => {
  it('should convert a user in output', async () => {
    const hasher = new BcryptAdapter.HasherAdapter(12);
    const entity = User.newUser(
      hasher,
      'Gabriel',
      'teste@teste.com',
      new Date(),
      'some password'
    );

    const spyToJson = jest.spyOn(entity, 'toJSON');
    const output = UserOutputMapper.toOutput(entity);

    expect(spyToJson).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.getID(),
      name: entity.getName(),
      email: entity.getEmail(),
      birth_date: entity.getBirthDate(),
      password: entity.password,
      created_at: entity.getCreatedAt(),
      updated_at: entity.getUpdatedAt(),
      deleted_at: entity.getDeletedAt(),
    });
  });
});
