import { Entity } from './entity';
import { Identifier } from './identifier';

export abstract class AggregateRoot<
  ID extends Identifier,
  Props,
> extends Entity<ID, Props> {
  protected constructor(id: ID, props: Props) {
    super(id, props);
  }
}
