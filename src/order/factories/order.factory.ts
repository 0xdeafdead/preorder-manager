import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import { buildMongoId, createMockDataFactory } from '../../core/factories';
import { Order } from '../schemas';

export const OrderFactory = createMockDataFactory<Order>(() => ({
  id: new Types.ObjectId(buildMongoId()),
  quantity: faker.number.int({ min: 1, max: 10 }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  deletedAt: undefined,
  preorder: new Types.ObjectId(buildMongoId()),
  user: new Types.ObjectId(buildMongoId()),
}));
