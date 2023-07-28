import { UserID } from '../user-id';
import { v4, validate } from 'uuid';
describe('user id unit test', () => {
  it('should by generate new uuid', () => {
    const userId = UserID.unique();
    expect(userId.getValue()).toBeDefined();
    expect(validate(userId.getValue())).toBeTruthy();
  });

  it('should by generate new userID by string', () => {
    const userId = UserID.from('unique id');
    expect(userId.getValue()).toBeDefined();
    expect(userId.getValue()).toBe('unique id');
  });

  it('should by generate new userID by uuid', () => {
    const id = v4();
    const userId = UserID.fromUUID(id);
    expect(userId.getValue()).toBeDefined();
    expect(validate(userId.getValue())).toBeTruthy();
    expect(userId.getValue()).toBe(id);
  });
});
