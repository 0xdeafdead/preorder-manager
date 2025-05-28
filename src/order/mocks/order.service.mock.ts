import { DeepPartialMock } from '../../core/types';
import { OrderService } from '../order.service';

export const orderServiceMock = (): DeepPartialMock<OrderService> => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});
