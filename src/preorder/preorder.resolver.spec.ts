import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';
import { buildMongoId } from '../core/factories';
import { DeepPartialMock } from '../core/types';
import { CreatePreorderInput, UpdatePreorderInput } from './input';
import { preorderServiceMock } from './mocks';
import { PreorderResolver } from './preorder.resolver';
import { PreorderService } from './services';

describe('PreorderResolver', () => {
  let resolver: PreorderResolver;
  let preorderService: DeepPartialMock<PreorderService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreorderResolver,
        {
          provide: PreorderService,
          useFactory: preorderServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<PreorderResolver>(PreorderResolver);
    preorderService = module.get(PreorderService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(preorderService).toBeDefined();
  });

  describe('createPreorder', () => {
    const input: CreatePreorderInput = {
      productSKU: 'sku',
      productName: 'name',
      price: 1,
      releaseDate: new Date(),
      closeDate: new Date(),
      tags: [],
    };
    it('should call preorderService.create', () => {
      resolver.createPreorder(input);
      expect(preorderService.create).toHaveBeenCalledWith(input);
    });
  });

  describe('listPreorders', () => {
    it('should call preorderService.findAll', () => {
      resolver.getAllPreorders();
      expect(preorderService.findAll).toHaveBeenCalled();
    });
  });

  describe('findPreorderById', () => {
    const id = buildMongoId();
    it('should call preorderService.findOne', () => {
      resolver.findPreorderById(id);
      expect(preorderService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('updatePreorder', () => {
    const input: UpdatePreorderInput = {
      id: buildMongoId(),
      productName: faker.commerce.productName(),
    };
    it('should call preorderService.update', () => {
      resolver.updatePreorder(input);
      expect(preorderService.update).toHaveBeenCalledWith(input);
    });
  });

  describe('changeAvailability', () => {
    const id = buildMongoId();
    it('should call preorderService.changeAvailability', () => {
      resolver.changeAvailability(id);
      expect(preorderService.changeAvailability).toHaveBeenCalledWith(id);
    });
  });

  describe('softDeletePreorder', () => {
    const id = buildMongoId();
    it('should call preorderService.softDelete', () => {
      resolver.softDeletePreorder(id);
      expect(preorderService.softDelete).toHaveBeenCalledWith(id);
    });
  });

  describe('removePreorder', () => {
    const id = buildMongoId();
    it('should call preorderService.remove', () => {
      resolver.removePreorder(id);
      expect(preorderService.remove).toHaveBeenCalledWith(id);
    });
  });
});
