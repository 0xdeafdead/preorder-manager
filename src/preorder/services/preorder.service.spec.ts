import { faker } from '@faker-js/faker/.';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { buildMongoId } from '../../core/factories';
import { DeepPartialMock } from '../../core/types';
import { PreorderFactory } from '../factories/preorder.factory';
import { CreatePreorderInput, UpdatePreorderInput } from '../input';
import { preorderRepositoryMock } from '../mocks';
import { PreorderRepository } from '../repositories/preorder.repository';
import { PreorderService } from './preorder.service';

describe('PreorderService', () => {
  let service: PreorderService;
  let preorderRepository: DeepPartialMock<PreorderRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PreorderService,
        {
          provide: PreorderRepository,
          useFactory: preorderRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<PreorderService>(PreorderService);
    preorderRepository = module.get(PreorderRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(preorderRepository).toBeDefined();
  });

  describe('create', () => {
    const input: CreatePreorderInput = {
      productSKU: faker.string.alphanumeric(8),
      productName: faker.commerce.productName(),
      price: faker.number.float({ min: 10, max: 100 }),
      releaseDate: new Date(),
      closeDate: new Date(),
      tags: [],
    };
    const preorder = PreorderFactory.build();
    it('should call preorderRepository.create and return a preorder', (done) => {
      preorderRepository.create?.mockResolvedValue(preorder);
      service.create(input).subscribe({
        next: (result) => {
          expect(preorderRepository.create).toHaveBeenCalledWith(input);
          expect(result).toEqual(preorder);
          done();
        },
      });
    });
  });

  describe('findAll', () => {
    const preorders = PreorderFactory.buildMany(3);
    it('should return preorders', (done) => {
      preorderRepository.findAll?.mockResolvedValue(preorders);
      service.findAll().subscribe({
        next: (result) => {
          expect(result).toEqual(preorders);
          done();
        },
      });
    });
  });

  describe('findOne', () => {
    const id = buildMongoId();
    const preorder = PreorderFactory.build();
    it('should return a preorder', (done) => {
      preorderRepository.findById?.mockResolvedValue(preorder);
      service.findOne(id).subscribe({
        next: (result) => {
          expect(preorderRepository.findById).toHaveBeenCalledWith(id);
          expect(result).toEqual(preorder);
          done();
        },
      });
    });
    it('should throw NotFoundException if not found', (done) => {
      preorderRepository.findById?.mockResolvedValue(null);
      service.findOne(id).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });
  });

  describe('update', () => {
    const id = buildMongoId();
    const input: UpdatePreorderInput = {
      id,
      productName: faker.commerce.productName(),
    };
    const preorder = PreorderFactory.build({ ...input });
    it('should update preorder', (done) => {
      preorderRepository.update?.mockResolvedValue(preorder);
      service.update(input).subscribe({
        next: (result) => {
          expect(preorderRepository.update).toHaveBeenCalledWith(id, {
            productName: input.productName,
          });
          expect(result).toEqual(preorder);
          done();
        },
      });
    });
    it('should throw NotFoundException if not found', (done) => {
      preorderRepository.update?.mockResolvedValue(null);
      service.update(input).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });
  });

  describe('changeAvailability', () => {
    const id = buildMongoId();
    const preorder = PreorderFactory.build({ id, available: true });
    it('should change availability', (done) => {
      preorderRepository.changeAvailability?.mockResolvedValue(preorder);
      service.changeAvailability(id).subscribe({
        next: (result) => {
          expect(preorderRepository.changeAvailability).toHaveBeenCalledWith(
            id,
          );
          expect(result).toEqual(preorder);
          done();
        },
      });
    });
    it('should throw NotFoundException if not found', (done) => {
      preorderRepository.changeAvailability?.mockResolvedValue(null);
      service.changeAvailability(id).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });
  });

  describe('softDelete', () => {
    const id = buildMongoId();
    const preorder = PreorderFactory.build({ id, deletedAt: new Date() });

    jest.useFakeTimers();
    const now = new Date();
    jest.setSystemTime(now);
    it('should soft delete preorder', (done) => {
      preorderRepository.update?.mockResolvedValue(preorder);
      service.softDelete(id).subscribe({
        next: (result) => {
          expect(preorderRepository.update).toHaveBeenCalledWith(
            id,
            expect.objectContaining({ deletedAt: now }),
          );
          expect(result).toEqual(preorder);
          done();
        },
      });
    });
    it('should throw NotFoundException if not found', (done) => {
      preorderRepository.update?.mockResolvedValue(null);
      service.softDelete(id).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });
  });

  describe('remove', () => {
    const id = buildMongoId();
    const preorder = PreorderFactory.build({ id });
    it('should remove preorder', (done) => {
      preorderRepository.delete?.mockResolvedValue(preorder);
      service.remove(id).subscribe({
        next: (result) => {
          expect(preorderRepository.delete).toHaveBeenCalledWith(id);
          expect(result).toEqual(preorder);
          done();
        },
      });
    });
    it('should throw NotFoundException if not found', (done) => {
      preorderRepository.delete?.mockResolvedValue(null);
      service.remove(id).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });
  });
});
