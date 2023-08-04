import { EntityValidationError } from '@/shared/domain/erros';
import { LoadEntityError } from '@/shared/domain/erros/load-entity';
import { User, UserID } from '@/user/domain/entity/user';
import { User as UserDrizzle } from '@/shared/infra/db/drizzle/schemas/user/schema';

export class UserMapper {
  static toEntity(model: UserDrizzle): User {
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
