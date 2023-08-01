import { YupValidatorFields } from '@shared/domain/validator/yup-validator';
import * as yup from 'yup';
import { UserPropsUpdate } from '../../entity/user';
export const userUpdateRules = {
  name: yup
    .string()
    .optional()
    .max(60, 'maximum number of characters for the name is 60'),
  email: yup
    .string()
    .email('must be a valid email')
    .optional()
    .max(60, 'maximum number of characters for the email is 60'),
  birth_date: yup.date().optional(),
  password: yup.string().optional().min(6, 'must be 6 characters'),
  deleted_at: yup.date().optional(),
};

export class UserUpdateValidator extends YupValidatorFields {}

export class UserUpdateValidatorFactory {
  static create(props: UserPropsUpdate): UserUpdateValidator {
    return new UserUpdateValidator(props, userUpdateRules);
  }
}
