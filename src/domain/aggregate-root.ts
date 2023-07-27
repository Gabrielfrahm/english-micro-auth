import { Entity } from './entity';
import { Identifier } from './identifier';

export abstract class AggregateRoot<ID extends Identifier> extends Entity<ID> {
  protected constructor(id: ID) {
    super(id);
  }
}
