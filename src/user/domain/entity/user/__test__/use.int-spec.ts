import { EntityValidationError } from '@shared/domain/erros/validator-error';
import { User } from '../user';

describe('user entity integration test', () => {
  test('should a invalid user using name property', async () => {
    const switchTestEmptyName = [
      {
        name: '',
        email: 'gabriel@test.com',
        birth_date: new Date(),
        password: '123456',
      },
    ];

    try {
      await User.validate(switchTestEmptyName[0]);
    } catch (e) {
      expect(e instanceof EntityValidationError).toBeTruthy();
      expect(e.error).toStrictEqual({ name: ['name is a required field'] });
    }
  });

  test('should a invalid user using email property', async () => {
    const switchTestEmptyName = [
      {
        name: 'Gabriel',
        email: '',
        birth_date: new Date(),
        password: '123456',
      },
    ];

    try {
      await User.validate(switchTestEmptyName[0]);
    } catch (e) {
      expect(e instanceof EntityValidationError).toBeTruthy();
      expect(e.error).toStrictEqual({ email: ['email is a required field'] });
    }
  });

  test('should a invalid user using birth_date property', async () => {
    const switchTestEmptyName = [
      {
        name: 'Gabriel',
        email: 'gabriel@test.com',
        birth_date: null,
        password: '123456',
      },
    ];

    try {
      await User.validate(switchTestEmptyName[0]);
    } catch (e) {
      expect(e instanceof EntityValidationError).toBeTruthy();
      expect(e.error).toStrictEqual({
        birth_date: ['birth_date is a required field'],
      });
    }
  });

  test('should a invalid user using birth_date property', async () => {
    const switchTestEmptyName = [
      {
        name: 'Gabriel',
        email: 'gabriel@test.com',
        birth_date: new Date(),
        password: null,
      },
    ];

    try {
      await User.validate(switchTestEmptyName[0]);
    } catch (e) {
      expect(e instanceof EntityValidationError).toBeTruthy();
      expect(e.error).toStrictEqual({
        password: ['password is a required field'],
      });
    }
  });
});
