import * as yup from 'yup';

import { YupValidatorFields } from '../yup-validator';

class StubValidation extends YupValidatorFields {}

describe('yup validation class unit test', () => {
  it('should initialize erros null', async () => {
    const params = {
      name: yup.string().required(),
      email: yup.string().email(),
    };
    const props = {
      name: null,
      email: null,
    };
    const validator = new StubValidation(props, params);
    expect(validator.errors).toBeNull();
  });

  it('should be capture erros', async () => {
    const params = {
      name: yup.string().required(),
      email: yup.string().email(),
    };
    const props = {
      name: null,
      email: null,
    };
    const validator = new StubValidation(props, params);

    expect(await validator.validate()).toBeFalsy();
    expect(validator.errors).toBeDefined();

    expect(validator.errors).toStrictEqual({
      email: ['email cannot be null'],
      name: ['name is a required field'],
    });
  });

  it('should be validate and no return erros', async () => {
    const params = {
      name: yup.string().required(),
      email: yup.string().email(),
    };
    const props = {
      name: 'valid name',
      email: 'valid@email.com',
    };
    const validator = new StubValidation(props, params);

    expect(await validator.validate()).toBeTruthy();
    expect(validator.errors).toBeNull();
  });
});
