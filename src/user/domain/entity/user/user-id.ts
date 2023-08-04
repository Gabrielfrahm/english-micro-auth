import { Identifier } from '@/shared/domain/entity';
import { v4 as uuid } from 'uuid';

export class UserID extends Identifier {
  private value: string;

  private constructor(value: string) {
    super();
    this.value = value;
  }

  public static unique(): UserID {
    return UserID.from(uuid());
  }

  public static from(anId: string): UserID {
    return new UserID(anId);
  }

  public static fromUUID(anId: string): UserID {
    return new UserID(anId.toString().toLowerCase());
  }

  public getValue(): string {
    return this.value;
  }
}
