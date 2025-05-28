import { faker } from '@faker-js/faker';
import { DeepPartial } from 'ts-essentials';

export const createMockDataFactory = <T extends object>(
  defaultData: () => T,
) => {
  return {
    build: (params?: DeepPartial<T>): T => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-misused-promises
      const base = defaultData();
      return {
        ...base,
        ...params,
      };
    },

    buildMany: (amount: number, params?: DeepPartial<T>): T[] => {
      return Array.from(Array(amount), () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-misused-promises
        const base = defaultData();
        return {
          ...base,
          ...params,
        };
      });
    },
  };
};

export const buildMongoId = () =>
  faker.string.hexadecimal({ casing: 'lower', length: 24, prefix: '' });
