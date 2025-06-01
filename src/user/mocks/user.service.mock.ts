import { DeepPartialMock } from '../../core/types';
import { UserService } from '../services';

export const userServiceMock = (): DeepPartialMock<UserService> => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
  remove: jest.fn(),
});
