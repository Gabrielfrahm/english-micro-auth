export class AlreadyExisting extends Error {
  constructor(message?: string) {
    super(message || 'Already Existing');
    this.name = 'AlreadyExisting';
  }
}

export default AlreadyExisting;
