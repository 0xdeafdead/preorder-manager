import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, RootFilterQuery, Types } from 'mongoose';
import { CoreRepository } from '../../core/repositories/core.repository';
import { ListPreordersInput } from '../input';
import { Preorder } from '../schemas/preorder.schema';
import { PaginatedPreorders } from '../types';

@Injectable()
export class PreorderRepository extends CoreRepository<Preorder> {
  constructor(
    @InjectModel(Preorder.name) private readonly preorderModel: Model<Preorder>,
  ) {
    super(preorderModel);
  }

  async changeAvailability(id: string): Promise<Preorder | null> {
    const preorder = await this.preorderModel
      .findById({ _id: new Types.ObjectId(id) })
      .exec();

    if (!preorder) {
      return null;
    }
    preorder.available = !preorder.available;
    const newPreorder = await preorder.save();
    return { ...newPreorder.toObject(), id: newPreorder._id };
  }

  async listPreorders(input: ListPreordersInput): Promise<PaginatedPreorders> {
    console.log('input', input);
    const { page, pageSize, search, tag } = input;

    const whereClause: RootFilterQuery<Preorder> = {
      deletedAt: null,
    };

    if (tag) {
      whereClause.tags = { $in: [tag] };
    }

    if (search) {
      whereClause.productName = { $regex: search, $options: 'i' };
      whereClause.productSKU = { $regex: search, $options: 'i' };
    }
    const results = await this.preorderModel
      .find(whereClause)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec()
      .then((docs) =>
        docs.map((doc) =>
          plainToInstance(Preorder, { ...doc.toObject(), id: doc._id }),
        ),
      );

    const count = await this.preorderModel.countDocuments(whereClause).exec();
    return {
      edges: results,
      total: count,
      page,
      pageSize,
    };
  }

  // async create(data: CreatePreorderInput): Promise<Preorder> {
  //   const preorder = new this.preorderModel(data);
  //   const newPreorder = (await preorder.save()).toObject();
  //   return {
  //     ...newPreorder,
  //   };
  // }

  // async findAll(): Promise<Preorder[]> {
  //   return this.preorderModel.find().exec();
  // }

  // async findById(id: string): Promise<Preorder | null> {
  //   const preorder = await this.preorderModel.findById(id).exec();
  //   if (!preorder) {
  //     return null;
  //   }
  //   return plainToInstance(Preorder, {
  //     ...preorder.toObject(),
  //     id: preorder._id,
  //   });
  // }

  // async update(data: UpdatePreorderInput): Promise<Preorder | null> {
  //   const { id, ...updateData } = data;
  //   return this.preorderModel
  //     .findByIdAndUpdate({ _id: new Types.ObjectId(id) }, data)
  //     .exec();
  // }

  // async softDelete(id: string): Promise<Preorder | null> {
  //   return this.preorderModel
  //     .findByIdAndUpdate(id, { deletedAt: Date.now() })
  //     .exec();
  // }

  // async delete(id: string): Promise<Preorder | null> {
  //   return this.preorderModel.findByIdAndDelete(id).exec();
  // }
}
