import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { from, Observable, of, switchMap } from 'rxjs';
import { CreateOrderInput } from '../inputs/create-order.input';
import { ListOrderInput } from '../inputs/list-order.input';
import { UpdateOrderInput } from '../inputs/update-order.input';
import { OrderRepository } from '../repositories/order.repository';
import { Order } from '../schemas/order.schema';
import { PaginatedOrders } from '../types/paginatedOrders';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  create(input: CreateOrderInput): Observable<Order> {
    const { userId, preorderId, quantity } = input;
    return from(
      this.orderRepository.create({
        quantity,
        user: new Types.ObjectId(userId),
        preorder: new Types.ObjectId(preorderId),
      }),
    ).pipe(switchMap((order) => of(order)));
  }

  findAll(): Observable<Order[]> {
    return from(this.orderRepository.findAll()).pipe(
      switchMap((orders) => {
        if (!orders) {
          throw new NotFoundException('Orders not found');
        }
        return of(orders);
      }),
    );
  }

  list(input: ListOrderInput): Observable<PaginatedOrders> {
    return from(this.orderRepository.listOrders(input));
  }

  findOne(id: string): Observable<Order> {
    return from(this.orderRepository.findOneOrThrow(id)).pipe(
      switchMap((order) => of(order)),
    );
  }

  update(input: UpdateOrderInput): Observable<Order> {
    const { id, ...data } = input;
    return this.findOne(id).pipe(
      switchMap((order) => {
        if (data.quantity > 0 && input.quantity < order.quantity) {
          return from(this.orderRepository.update(id, data));
        }
        throw new BadRequestException(
          `Cannot increase quantity for an existing order. A new order must be created`,
        );
      }),
    );
  }

  remove(id: string) {
    return from(
      this.orderRepository.update(id, { deletedAt: new Date() }),
    ).pipe(switchMap((order) => of(order)));
  }
}
