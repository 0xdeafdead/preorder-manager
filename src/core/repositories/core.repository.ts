import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, RootFilterQuery, Types } from 'mongoose';

@Injectable()
export class CoreRepository<T> {
  constructor(private readonly coreModel: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const entity = new this.coreModel(data);
    const newEntity = (await entity.save()).toObject();
    return { ...newEntity, id: newEntity._id };
  }

  async findAll(): Promise<T[]> {
    return (await this.coreModel.find().sort({ createdAt: -1 }).exec()).map(
      (entity) => ({
        ...entity.toObject(),
        id: entity._id,
      }),
    );
  }

  async findById(id: string): Promise<T | null> {
    const entity = await this.coreModel.findById(id).exec();
    if (!entity) {
      return null;
    }
    return { ...entity.toObject(), id: entity._id };
  }

  async findOneBy(where: RootFilterQuery<T>): Promise<T | null> {
    const entity = await this.coreModel.findOne(where).exec();
    if (!entity) {
      return null;
    }
    return { ...entity.toObject(), id: entity._id };
  }

  async findOneOrThrow(id: string): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new Error('Entity not found');
    }
    return entity;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const entity = await this.coreModel
      .findByIdAndUpdate(
        { _id: new Types.ObjectId(id) },
        {
          ...data,
          updatedAt: Date.now(),
        },
        { new: true, runValidators: true },
      )
      .exec();
    if (!entity) {
      throw new NotFoundException(`Entity not found`);
    }
    return { ...entity.toObject(), id: entity._id };
  }

  async delete(id: string): Promise<T> {
    const entity = await this.coreModel.findByIdAndDelete(id).exec();
    if (!entity) {
      throw new NotFoundException(`Entity not found`);
    }
    return { ...entity.toObject(), id: entity._id };
  }
}
