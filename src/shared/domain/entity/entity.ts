import { Identifier } from './identifier';

export abstract class Entity<T extends Identifier, Props> {
  protected id: T;

  protected constructor(
    id: T,
    readonly props: Props
  ) {
    this.id = id;
  }

  public getID(): T {
    return this.id;
  }

  toJSON(): Required<{ id: T }> & Props {
    return {
      id: this.id,
      ...this.props,
    } as Required<{ id: T }> & Props;
  }
}
