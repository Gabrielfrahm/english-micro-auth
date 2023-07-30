import * as yup from 'yup';

export type FieldsError = {
  [field: string]: string[];
};

export abstract class YupValidatorFields {
  errors: FieldsError = null;
  constructor(
    private props: unknown,
    private params: unknown
  ) {
    this.props = props;
    this.params = params;
  }
  async validate(): Promise<boolean> {
    try {
      const schema = yup.object().shape(this.params as yup.ObjectShape);
      await schema.validate(this.props, { abortEarly: false });
      return true;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        this.errors = {};
        for (const err of error.inner) {
          const field = err.path;
          this.errors[field] = err.errors;
        }
      }
      return false;
    }
  }
}
