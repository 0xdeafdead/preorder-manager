import { Injectable } from '@nestjs/common';
import { forkJoin, Observable, of, switchMap } from 'rxjs';
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

  findAll() {
    return this.orderRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderInput: UpdateOrderInput) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
