export interface Encrypter {
  encrypt: (value: string) => Promise<string>;
}

export interface HashCompare {
  compare: (value: string, hash: string) => Promise<boolean>;
}

export interface Hasher {
  hash: (value: string) => Promise<string>;
}
