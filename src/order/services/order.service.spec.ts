import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { of } from 'rxjs';
import { buildMongoId } from '../../core/factories';
import { DeepPartialMock } from '../../core/types';
import { OrderFactory } from '../factories';
import { CreateOrderInput, UpdateOrderInput } from '../inputs';
import { orderRepositoryMock } from '../mocks';
import { OrderRepository } from '../repositories';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: DeepPartialMock<OrderRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useFactory: orderRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get(OrderRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(orderRepository).toBeDefined();
  });

  describe('create', () => {
    const input: CreateOrderInput = {
      userId: buildMongoId(),
      preorderId: buildMongoId(),
      quantity: 2,
    };
    const order = OrderFactory.build();
    it('should call orderRepository.create and return an order', (done) => {
      orderRepository.create?.mockResolvedValue(order);
      service.create(input).subscribe({
        next: (result) => {
          expect(orderRepository.create).toHaveBeenCalledWith({
            quantity: input.quantity,
            user: new Types.ObjectId(input.userId),
            preorder: new Types.ObjectId(input.preorderId),
          });
          expect(result).toEqual(order);
          done();
        },
      });
    });
  });

  describe('findAll', () => {
    const orders = OrderFactory.buildMany(3);
    it('should return orders', (done) => {
      orderRepository.findAll?.mockResolvedValue(orders);
      service.findAll().subscribe({
        next: (result) => {
          expect(result).toEqual(orders);
          done();
        },
      });
    });
    it('should throw NotFoundException if no orders', (done) => {
      orderRepository.findAll?.mockResolvedValue(null);
      service.findAll().subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });
  });

  describe('findOne', () => {
    const id = buildMongoId();
    const order = OrderFactory.build();
    it('should return an order', (done) => {
      orderRepository.findOneOrThrow?.mockResolvedValue(order);
      service.findOne(id).subscribe({
        next: (result) => {
          expect(orderRepository.findOneOrThrow).toHaveBeenCalledWith(id);
          expect(result).toEqual(order);
          done();
        },
      });
    });
  });

  describe('update', () => {
    const id = buildMongoId();
    const input: UpdateOrderInput = { id, quantity: 1 };
    const order = OrderFactory.build({ id, quantity: 2 });
    const updated = OrderFactory.build({ id, quantity: 1 });

    const spyFindOne: jest.SpyInstance = jest.spyOn(
      OrderService.prototype,
      'findOne',
    );
    it('should update order if quantity is less', (done) => {
      spyFindOne.mockReturnValueOnce(of(order));
      orderRepository.update?.mockResolvedValue(updated);
      service.update(input).subscribe({
        next: (result) => {
          expect(orderRepository.update).toHaveBeenCalledWith(id, {
            quantity: 1,
          });
          expect(result).toEqual(updated);
          done();
        },
      });
    });
    it('should throw BadRequestException if quantity is not less', (done) => {
      spyFindOne.mockReturnValueOnce(of(order));
      service.update({ id, quantity: 3 }).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(BadRequestException);
          done();
        },
      });
    });
  });

  describe('remove', () => {
    const id = buildMongoId();
    const order = OrderFactory.build({ id });
    jest.useFakeTimers();
    const now = new Date();
    jest.setSystemTime(now);
    it('should call update with deletedAt', (done) => {
      orderRepository.update?.mockResolvedValue(order);
      service.remove(id).subscribe({
        next: (result) => {
          expect(orderRepository.update).toHaveBeenCalledWith(
            id,
            expect.objectContaining({ deletedAt: now }),
          );
          expect(result).toEqual(order);
          done();
        },
      });
    });
  });
});
