export type DefaultUser = {
  id: number;
  name: string;
  age: number;
};

export type PostingUser = {
  name: string;
  age: number;
};

export type UpdatingUser = {
  id?: number;
  name: string;
  age: number;
};
