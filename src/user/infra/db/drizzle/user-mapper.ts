import { EntityValidationError } from '@/shared/domain/errors';
import { LoadEntityError } from '@/shared/domain/errors/load-entity';
import { BcryptAdapter } from '@/shared/infra/adapters/cryptography/bcrypter';
import { User as UserDrizzle } from '@/shared/infra/db/drizzle/schemas/user/schema';
import { User, UserID } from '@/user/domain/entity/user';

export class UserMapper {
  static toEntity(model: UserDrizzle): User {
    const hasher = new BcryptAdapter.HasherAdapter(12);
    const {
      id,
      birth_date,
      email,
      name,
      password,
      created_at,
      deleted_at,
      updated_at,
    } = model;
    try {
      const user_id = UserID.from(id);
      return User.newUser(
        hasher,
        name,
        email,
        birth_date,
        password,
        user_id,
        created_at,
        updated_at,
        deleted_at
      );
    } catch (e) {
      if (e instanceof EntityValidationError) {
        throw new LoadEntityError(e.error);
      }
      throw e;
    }
  }
}
