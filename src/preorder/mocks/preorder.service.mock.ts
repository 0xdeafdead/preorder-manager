export const preorderServiceMock = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  changeAvailability: jest.fn(),
  softDelete: jest.fn(),
  remove: jest.fn(),
});
