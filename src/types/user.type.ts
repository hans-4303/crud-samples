export type DefaultUser = {
  id: number;
  name: string;
  age: number;
};

export type UpdatingUser = {
  name: string;
  age: number;
};

export type EditingUser = {
  id?: number;
  name: string;
  age: number;
};
