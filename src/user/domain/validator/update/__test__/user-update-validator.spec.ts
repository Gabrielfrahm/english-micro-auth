import { UserUpdateValidatorFactory } from '../user-update-validator';

describe('user update validator unit test', () => {
  test('invalid case for name field ', async () => {
    const switchTestEmptyName = [
      {
        name: null,
        email: 'gabriel@test.com',
        birth_date: new Date(),
        password: '123456',
      },
    ];

    switchTestEmptyName.forEach(async (item) => {
      const validator = UserUpdateValidatorFactory.create(item);
      const isValid = await validator.validate();

      expect(isValid).toBeFalsy();
    });

    const switchTestLengthName = [
      {
        name: 'a'.repeat(61),
        email: 'gabriel@test.com',
        birth_date: new Date(),
        password: '123456',
      },
    ];

    switchTestLengthName.forEach(async (item) => {
      const validator = UserUpdateValidatorFactory.create(item);
      expect(await validator.validate()).toBeFalsy();
      expect(validator.errors).toStrictEqual({
        name: ['maximum number of characters for the name is 60'],
      });
    });
  });

  test('invalid case for email field ', async () => {
    const switchTestInvalidEmail = [
      {
        name: '',
        email: null,
        birth_date: new Date(),
        password: '',
      },
      {
        name: '',
        email: 'aaa',
        birth_date: new Date(),
        password: '',
      },
      {
        name: '',
        email: 'gabriel@test.com'.repeat(61),
        birth_date: new Date(),
        password: '',
      },
    ];

    switchTestInvalidEmail.forEach(async (item) => {
      const validator = UserUpdateValidatorFactory.create(item);
      expect(await validator.validate()).toBeFalsy();

      expect(
        !!Object.values(validator.errors).find(
          (item) =>
            item.includes('email cannot be null') ||
            item.includes('must be a valid email') ||
            item.includes('maximum number of characters for the email is 60')
        )
      ).toBeTruthy();
    });
  });

  test('invalid case for birth_date field ', async () => {
    const switchTestInvalidBirthDate = [
      {
        name: '',
        email: '',
        birth_date: null,
        password: '',
      },
    ];
    switchTestInvalidBirthDate.forEach(async (item) => {
      const validator = UserUpdateValidatorFactory.create(item);
      expect(await validator.validate()).toBeFalsy();

      expect(
        !!Object.values(validator.errors).find((item) =>
          item.includes('birth_date cannot be null')
        )
      ).toBeTruthy();
    });
  });

  test('invalid case for password field ', async () => {
    const switchTestInvalidBirthDate = [
      {
        name: '',
        email: '',
        birth_date: null,
        password: '',
      },
      {
        name: '',
        email: '',
        birth_date: null,
        password: '123',
      },
    ];
    switchTestInvalidBirthDate.forEach(async (item) => {
      const validator = UserUpdateValidatorFactory.create(item);
      expect(await validator.validate()).toBeFalsy();

      expect(
        !!Object.values(validator.errors).find(
          (item) =>
            item.includes('password is a required field') ||
            item.includes('must be 6 characters')
        )
      ).toBeTruthy();
    });
  });
});
