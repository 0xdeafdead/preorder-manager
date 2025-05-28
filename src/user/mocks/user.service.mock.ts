import { DeepPartialMock } from '../../core/types';
import { UserService } from '../services';

export const userServiceMock = (): DeepPartialMock<UserService> => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
  remove: jest.fn(),
});
