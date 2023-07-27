import { Identifier } from './identifier';

export abstract class Entity<ID extends Identifier> {
  protected id: ID;

  protected constructor(id: ID) {
    this.id = id;
  }

  public getID(): ID {
    return this.id;
  }
}
