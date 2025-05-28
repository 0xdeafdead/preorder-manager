import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import { buildMongoId, createMockDataFactory } from '../../core/factories';
import { User } from '../schemas/user.schema';

type UserMock = User;

const defaultData = (): UserMock => ({
  id: new ObjectId(buildMongoId()),
  fullName: faker.person.fullName(),
  email: faker.internet.email(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
  deletedAt: undefined,
  enabled: true,
});

export const UserFactory = createMockDataFactory(defaultData);
