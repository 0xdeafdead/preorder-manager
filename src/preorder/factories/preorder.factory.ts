import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { buildMongoId, createMockDataFactory } from '../../core/factories';
import { Preorder } from '../schemas/preorder.schema';

export const PreorderFactory = createMockDataFactory<Preorder>(() => ({
  id: new Types.ObjectId(buildMongoId()),
  productSKU: faker.string.alphanumeric(8),
  productName: faker.commerce.productName(),
  price: faker.number.float({ min: 10, max: 100 }),
  available: faker.datatype.boolean(),
  releaseDate: faker.date.future(),
  closeDate: faker.date.future(),
  deletedAt: undefined,
  description: faker.commerce.productDescription(),
  tags: [],
}));
