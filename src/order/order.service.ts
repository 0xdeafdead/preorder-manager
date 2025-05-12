import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { forkJoin, from, Observable, of, switchMap } from 'rxjs';
import { PreorderService } from '../preorder/preorder.service';
import { UserService } from '../user/user.service';
import { CreateOrderInput } from './inputs/create-order.input';
import { UpdateOrderInput } from './inputs/update-order.input';
import { OrderRepository } from './repositories/order.repository';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userService: UserService,
    private readonly preorderService: PreorderService,
  ) {}

  create(input: CreateOrderInput): Observable<Order> {
    const $user = this.userService.findOne(input.userId).pipe(
      switchMap((user) => {
        if (!user) {
          throw new Error('User not found');
        }
        return of(user);
      }),
    );
    const $preorder = this.preorderService.findOne(input.preorderId).pipe(
      switchMap((preorder) => {
        if (!preorder) {
          throw new Error('Preorder not found');
        }
        return of(preorder);
      }),
    );
    return forkJoin([$user, $preorder]).pipe(
      switchMap(async ([user, preorder]) => {
        const order = await this.orderRepository.create({
          ...input,
          user,
          preorder,
        });
        return order;
      }),
    );
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
