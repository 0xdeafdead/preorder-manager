import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { PermissionGuard } from '../../core/guards';
import { CreateOrderInput, ListOrderInput, UpdateOrderInput } from '../inputs';
import { Order } from '../schemas';
import { OrderService } from '../services';
import { PaginatedOrders } from '../types';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Order)
  @UseGuards(PermissionGuard(['create:order']))
  createOrder(@Args('input') input: CreateOrderInput): Observable<Order> {
    return this.orderService.create(input);
  }

  @Query(() => PaginatedOrders)
  // Admins can see all orders, user should only be able to list their own
  @UseGuards(PermissionGuard(['read:order-list']))
  listOrders(
    @Args('input') input: ListOrderInput,
  ): Observable<PaginatedOrders> {
    return this.orderService.list(input);
  }

  @Query(() => Order)
  // User should be able to check an order they own
  @UseGuards(PermissionGuard(['read:order']))
  getOrderById(@Args('id') id: string): Observable<Order> {
    return this.orderService.findOne(id);
  }

  @Mutation(() => Order)
  // User should be able to update their own order, restrictions handle by FE and service logic enforces
  @UseGuards(PermissionGuard(['update:order']))
  updateOrder(@Args('input') input: UpdateOrderInput): Observable<Order> {
    return this.orderService.update(input);
  }

  @Mutation(() => Order)
  // User should be able to delete their own order
  @UseGuards(PermissionGuard(['delete:order']))
  removeOrder(@Args('id') id: string): Observable<Order> {
    return this.orderService.remove(id);
  }
}
