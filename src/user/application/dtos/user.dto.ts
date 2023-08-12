import { UserID } from '@/user/domain/entity/user';

export type UserOutput = {
  id: UserID;
  name: string;
  email: string;
  birth_date: Date;
  password: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
};
