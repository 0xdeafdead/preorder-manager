import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { Preorder } from '../../preorder/schemas/preorder.schema';
import { User } from '../../user/schemas/user.schema';
import { Order } from '../schemas/order.schema';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async create(data: {
    quantity: number;
    preorder: Preorder;
    user: User;
  }): Promise<Order> {
    const order = new this.orderModel({
      preorder: data.preorder,
      user: data.user,
      quantity: data.quantity,
    });
    const newOrder = (await order.save()).toObject();
    return plainToInstance(Order, { ...newOrder, id: newOrder._id });
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }
}
