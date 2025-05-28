import { DeepPartialMock } from '../../core/types/deepPartialMock';
import { OrderRepository } from '../repositories/order.repository';

export const orderRepositoryMock = (): DeepPartialMock<OrderRepository> => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findOneOrThrow: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});
