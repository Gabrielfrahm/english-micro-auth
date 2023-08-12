import { UseCase as UseCaseInterface } from '@/shared/application/usecase';
import { BcryptAdapter } from '@/shared/infra/adapters/cryptography/bcrypter';
import { User } from '@/user/domain/entity/user';
import { UserRepository } from '@/user/domain/repository';

import { UserOutput } from '../dtos/user.dto';
import UserOutputMapper from '../mapper/user-output.mapper';
export namespace CreateUserUseCase {
  export class UseCase implements UseCaseInterface<Input, Output> {
    constructor(
      private userRepository: UserRepository,
      private hasher: BcryptAdapter.HasherAdapter
    ) {}

    async execute(input: Input): Promise<UserOutput> {
      const entity = User.newUser(
        this.hasher,
        input.name,
        input.email,
        input.birth_date,
        input.password,
        null,
        input.created_at,
        input.updated_at,
        input.deleted_at
      );
      entity.setPassword(input.password);
      await this.userRepository.insert(entity);
      return UserOutputMapper.toOutput(entity);
    }
  }

  export type Input = {
    name: string;
    email: string;
    birth_date: Date;
    password: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
  };

  export type Output = UserOutput;
}
