import { FieldsError } from '../validator/yup-validator';

export class EntityValidationError extends Error {
  constructor(public error: FieldsError) {
    super('Entity Validation Error');
    this.name = 'EntityValidationError';
  }
}
