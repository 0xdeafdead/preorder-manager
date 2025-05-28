import { DeepPartialMock } from '../../core/types/deepPartialMock';
import { PreorderRepository } from '../repositories/preorder.repository';

export const preorderRepositoryMock =
  (): DeepPartialMock<PreorderRepository> => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    changeAvailability: jest.fn(),
  });
