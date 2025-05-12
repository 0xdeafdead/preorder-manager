import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { CreateOrderInput } from './inputs/create-order.input';
import { UpdateOrderInput } from './inputs/update-order.input';
import { OrderService } from './order.service';
import { Order } from './schemas/order.schema';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Order)
  createOrder(@Args('input') input: CreateOrderInput): Observable<Order> {
    return this.orderService.create(input);
  }

  @Query(() => [Order])
  listOrders(): Observable<Order[]> {
    return this.orderService.findAll();
  }

  @Query(() => Order)
  getOrderById(@Args('id') id: string): Observable<Order> {
    return this.orderService.findOne(id);
  }

  @Mutation(() => Order)
  updateOrder(@Args('input') input: UpdateOrderInput): Observable<Order> {
    return this.orderService.update(input);
  }

  @Mutation(() => Order)
  removeOrder(@Args('id') id: string): Observable<Order> {
    return this.orderService.remove(id);
  }
}
