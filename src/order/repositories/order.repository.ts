import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoreRepository } from '../../core/repositories/core.repository';
import { Order } from '../schemas/order.schema';

@Injectable()
export class OrderRepository extends CoreRepository<Order> {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {
    super(orderModel);
  }
}
