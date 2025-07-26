import { DeepPartialMock } from 'src/core/types';
import { Auth0Service } from '../services';

export const auth0ServiceMock = (): DeepPartialMock<Auth0Service> => ({
  getMgmtAccessToken: jest.fn(),
  getUserPermissions: jest.fn(),
  _getMgmtAccessToken: jest.fn(),
});
