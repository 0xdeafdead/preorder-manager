import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, PipelineStage, Types } from 'mongoose';
import { CoreRepository } from '../../core/repositories/core.repository';
import { PreorderDocument } from '../../preorder/schemas';
import { UserDocument } from '../../user/schemas';
import { ListOrderInput } from '../inputs';
import { Order, OrderDocument } from '../schemas';
import { PaginatedOrders } from '../types';

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

  async listOrders(input: ListOrderInput): Promise<PaginatedOrders> {
    const { page, pageSize, tag, search, userId } = input;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          user: new Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'preorders',
          localField: 'preorder',
          foreignField: '_id',
          as: 'preorder',
        },
      },
      {
        $unwind: '$preorder',
      },
    ];

    if (tag) {
      pipeline.push({
        $match: {
          'preorder.tags': { $in: [tag] },
        },
      });
    }

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            {
              'preorder.productName': { $regex: search, $options: 'i' },
            },
            {
              'preorder.productSKU': { $regex: search, $options: 'i' },
            },
          ],
        },
      });
    }

    pipeline.push({
      $facet: {
        data: [
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * pageSize },
          { $limit: pageSize },
        ],
        total: [{ $count: 'count' }],
      },
    });

    //TODO: move this type to its own file
    const result = await this.orderModel.aggregate<{
      data: OrderDocument[];
      total: {
        count: number;
      }[];
    }>(pipeline);

    //Change this if by any reason really big sets are returned
    const edges = result[0].data.map((order) =>
      plainToInstance(Order, {
        ...order,
        preorder: { ...order.preorder, id: order.preorder._id },
        id: order._id,
      }),
    );

    return {
      edges,
      total: result[0].total[0]?.count ?? 0,
      page,
      pageSize,
    };
  }
}
