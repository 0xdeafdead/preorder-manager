import { coreRepositoryMock } from '../../core/mocks';
import { DeepPartialMock } from '../../core/types';
import { UserRepository } from '../repositories/user.repository';

export const userRepositoryMock = (): DeepPartialMock<UserRepository> => ({
  ...coreRepositoryMock,
  findOneByEmail: jest.fn(),
  findById: jest.fn(),
});
