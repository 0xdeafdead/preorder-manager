import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';
import { buildMongoId } from '../core/factories';
import { DeepPartialMock } from '../core/types';
import { CreateOrderInput, UpdateOrderInput } from './inputs';
import { orderServiceMock } from './mocks/order.service.mock';
import { OrderResolver } from './order.resolver';
import { OrderService } from './services/order.service';

describe('OrderResolver', () => {
  let resolver: OrderResolver;
  let orderService: DeepPartialMock<OrderService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderResolver,
        {
          provide: OrderService,
          useFactory: orderServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<OrderResolver>(OrderResolver);
    orderService = module.get(OrderService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(orderService).toBeDefined();
  });

  describe('createOrder', () => {
    const input: CreateOrderInput = {
      userId: buildMongoId(),
      preorderId: buildMongoId(),
      quantity: faker.number.int({ min: 1, max: 10 }),
    };
    it('should call orderService.create', () => {
      resolver.createOrder(input);
      expect(orderService.create).toHaveBeenCalledWith(input);
    });
  });

  describe('getAllOrders', () => {
    it('should call orderService.findAll', () => {
      resolver.getAllOrders();
      expect(orderService.findAll).toHaveBeenCalled();
    });
  });

  describe('getOrderById', () => {
    it('should call orderService.findOne', () => {
      resolver.getOrderById('o1');
      expect(orderService.findOne).toHaveBeenCalledWith('o1');
    });
  });

  describe('updateOrder', () => {
    const input: UpdateOrderInput = {
      id: buildMongoId(),
      quantity: faker.number.int({ min: 1, max: 10 }),
    };
    it('should call orderService.update', () => {
      resolver.updateOrder(input);
      expect(orderService.update).toHaveBeenCalledWith(input);
    });
  });

  describe('removeOrder', () => {
    const id = buildMongoId();
    it('should call orderService.remove', () => {
      resolver.removeOrder(id);
      expect(orderService.remove).toHaveBeenCalledWith(id);
    });
  });
});
