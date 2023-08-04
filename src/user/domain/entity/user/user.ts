import { AggregateRoot } from '@/shared/domain/entity';
import { UserID } from './user-id';
import { UserValidatorFactory } from '../../validator/create/user-validator';
import { EntityValidationError } from '@/shared/domain/erros/validator-error';
import { UserUpdateValidatorFactory } from '../../validator/update/user-update-validator';

export type UserProps = {
  name: string;
  email: string;
  birth_date: Date;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
};

export type UserPropsUpdate = {
  name?: string;
  email?: string;
  birth_date?: Date;
  password?: string;
  deleted_at?: Date;
};

export class User extends AggregateRoot<UserID, UserProps> {
  private constructor(
    public readonly props: UserProps,
    id?: UserID
  ) {
    User.validate(props);
    super(id, props);
    this.props.name = props.name;
    this.props.email = props.email;
    this.props.birth_date = props.birth_date;
    this.props.password = props.password;
    this.props.created_at = props.created_at || new Date();
    this.props.updated_at = props.updated_at || new Date();
    this.props.deleted_at = props.deleted_at;
  }

  static async validate(props: UserProps): Promise<void> {
    const validator = UserValidatorFactory.create(props);
    const isValid = await validator.validate();
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  public static newUser(
    name: string,
    email: string,
    birth_date: Date,
    password: string,
    id?: UserID,
    created_at?: Date,
    updated_at?: Date,
    deleted_at?: Date
  ): User {
    const user_id = id ? id : UserID.unique();
    const now = new Date();
    return new User(
      {
        name,
        birth_date,
        email,
        password,
        created_at: created_at ? created_at : now,
        updated_at: updated_at ? updated_at : now,
        deleted_at: deleted_at ? created_at : null,
      },
      user_id
    );
  }

  public async update({
    name,
    email,
    birth_date,
    password,
    deleted_at,
  }: UserPropsUpdate): Promise<void> {
    const updateValidator = UserUpdateValidatorFactory.create({
      name,
      email,
      birth_date,
      password,
      deleted_at,
    });
    const isValid = await updateValidator.validate();
    if (!isValid) {
      throw new EntityValidationError(updateValidator.errors);
    }
    if (name) {
      this.props.name = name;
    }
    if (email) {
      this.props.email = email;
    }
    if (birth_date) {
      this.props.birth_date = birth_date;
    }
    if (password) {
      this.props.password = password;
    }
    if (deleted_at) {
      this.props.deleted_at = deleted_at;
    }
  }

  getName(): string {
    return this.props.name;
  }

  getEmail(): string {
    return this.props.email;
  }

  getBirthDate(): Date {
    return this.props.birth_date;
  }

  getCreatedAt(): Date {
    return this.props.created_at;
  }

  getUpdatedAt(): Date {
    return this.props.updated_at;
  }

  getDeletedAt(): Date {
    return this.props.deleted_at;
  }

  setDeletedAt(): void {
    this.props.deleted_at = new Date();
  }
}
