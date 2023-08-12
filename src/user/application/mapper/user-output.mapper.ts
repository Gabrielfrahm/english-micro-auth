import { User } from '@/user/domain/entity/user';

import { UserOutput } from '../dtos/user.dto';

export default class UserOutputMapper {
  static toOutput(entity: User): UserOutput {
    return entity.toJSON();
  }
}
