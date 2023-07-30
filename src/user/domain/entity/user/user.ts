import { AggregateRoot } from '@shared/domain/entity';
import { UserID } from './user-id';
import { UserValidatorFactory } from '../../validator/user-validator';
import { EntityValidationError } from '@shared/domain/erros/validator-error';

export type UserProps = {
  name: string;
  email: string;
  birth_date: Date;
  password: string;
  created_at?: Date;
  updated_at?: Date;
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
    this.props.deleted_at = props.deleted_at || new Date();
  }

  static validate(props: UserProps): void {
    const validator = UserValidatorFactory.create(props);
    const isValid = validator.validate();
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  public static newUser(
    name: string,
    email: string,
    birth_date: Date,
    password: string
  ): User {
    const id = UserID.unique();
    const now = new Date();
    return new User(
      {
        name,
        birth_date,
        email,
        password,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      },
      id
    );
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
