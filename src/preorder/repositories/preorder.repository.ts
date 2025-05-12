import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CoreRepository } from '../../core/repositories/core.repository';
import { Preorder } from '../schemas/preorder.schema';

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
