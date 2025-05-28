import { Primitive } from 'ts-essentials';

type GenericFunction = (...args: any[]) => any;

export type DeepPartialMock<T> = {
  [P in keyof T]?: T[P] extends GenericFunction | Primitive
    ? jest.Mock
    : DeepPartialMock<T[P]>;
};
