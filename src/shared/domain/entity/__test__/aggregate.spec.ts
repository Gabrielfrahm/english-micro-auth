import { AggregateRoot } from '@shared/domain/entity';

describe('Aggregate root unit test', () => {
  it('class extends aggregate root', () => {
    class Shape extends AggregateRoot<string> {
      constructor(
        public id: string,
        private height: number,
        private width: number
      ) {
        super(id);
        this.height = height;
        this.width = width;
      }

      public calcAre(): number {
        return this.width * this.height;
      }
    }
    const shape = new Shape('uniq id', 10, 5);
    expect(shape.calcAre()).toBe(50);
    expect(shape.getID()).toBe('uniq id');
  });
});
