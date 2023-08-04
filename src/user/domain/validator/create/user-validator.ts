import { YupValidatorFields } from '@/shared/domain/validator/yup-validator';
import * as yup from 'yup';
import { UserProps } from '../../entity/user';
export const userRules = {
  name: yup
    .string()
    .required()
    .max(60, 'maximum number of characters for the name is 60'),
  email: yup
    .string()
    .email('must be a valid email')
    .required()
    .max(60, 'maximum number of characters for the email is 60'),
  birth_date: yup.date().required(),
  password: yup.string().required().min(6, 'must be 6 characters'),
  created_at: yup.date().optional(),
  updated_at: yup.date().optional(),
  deleted_at: yup.date().optional().nullable(),
};

export class UserValidator extends YupValidatorFields {}

export class UserValidatorFactory {
  static create(props: UserProps): UserValidator {
    return new UserValidator(props, userRules);
  }
}
