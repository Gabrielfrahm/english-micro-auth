import { User } from '../user';

describe('user entity unit test', () => {
  beforeEach(() => {
    User.validate = jest.fn();
  });
  it('should by create new user', () => {
    const user = User.newUser(
      'Gabriel',
      'gabriel@mail.com',
      new Date('07/02/1999'),
      '123456'
    );
    const userProps = {
      id: user.getID(),
      name: user.getName(),
      email: user.getEmail(),
      birth_date: user.getBirthDate(),
      password: '123456',
      created_at: user.getCreatedAt(),
      updated_at: user.getUpdatedAt(),
      deleted_at: user.getDeletedAt(),
    };
    expect(user).toBeDefined();
    expect(User.validate).toHaveBeenCalled();
    expect(user.toJSON()).toStrictEqual(userProps);
  });

  it('should be update user', async () => {
    const user = User.newUser(
      'Gabriel',
      'gabriel@mail.com',
      new Date('07/02/1999'),
      '123456'
    );

    expect(user.getName()).toBe('Gabriel');
    await user.update({
      name: 'Gabriel Updated',
      email: 'gabrielUpdate@mail.com',
      birth_date: new Date('08/02/1999'),
    });

    expect(user.getName()).toBe('Gabriel Updated');
    expect(user.getEmail()).toBe('gabrielUpdate@mail.com');
    expect(user.getBirthDate()).toStrictEqual(new Date('08/02/1999'));
  });

  it('should by possible set deleted at', () => {
    const user = User.newUser(
      'Gabriel',
      'gabriel@mail.com',
      new Date('07/02/1999'),
      '123456'
    );
    const spy = jest.spyOn(user, 'setDeletedAt');
    user.setDeletedAt();
    expect(user.getDeletedAt()).toBeDefined();
    expect(User.validate).toHaveBeenCalled();
    expect(spy).toBeCalledTimes(1);
  });
});
