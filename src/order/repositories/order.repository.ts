import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoreRepository } from '../../core/repositories/core.repository';
import { PreorderDocument } from '../../preorder/schemas/preorder.schema';
import { UserDocument } from '../../user/schemas/user.schema';
import { Order } from '../schemas/order.schema';

@Injectable()
export class OrderRepository extends CoreRepository<Order> {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {
    super(orderModel);
  }

  async create(data: Partial<Order>): Promise<Order> {
    const order = new this.orderModel(data);

    const savedOrder = await order.save();

    const populatedOrder = await savedOrder.populate([
      {
        path: 'user',
        transform: (doc: UserDocument) => ({
          ...doc.toObject(),
          id: doc._id,
        }),
      },
      {
        path: 'preorder',
        transform: (doc: PreorderDocument) => ({
          ...doc.toObject(),
          id: doc._id,
        }),
      },
    ]);
    const plainOrder = populatedOrder.toObject();
    return { ...plainOrder, id: plainOrder._id };
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.orderModel
      .findById(id)
      .populate({
        path: 'user',
        transform: (doc: UserDocument) => ({ ...doc.toObject(), id: doc._id }),
      })
      .populate({
        path: 'preorder',
        transform: (doc: PreorderDocument) => ({
          ...doc.toObject(),
          id: doc._id,
        }),
      })
      .exec();
    if (!order) {
      return null;
    }
    return { ...order.toObject(), id: order._id };
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.orderModel
      .find()
      .populate({
        path: 'user',
        transform: (doc: UserDocument) => ({ ...doc.toObject(), id: doc._id }),
      })
      .populate({
        path: 'preorder',
        transform: (doc: PreorderDocument) => ({
          ...doc.toObject(),
          id: doc._id,
        }),
      })
      .exec();
    return orders.map((order) => ({ ...order.toObject(), id: order._id }));
  }
}
