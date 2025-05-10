import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, Types } from 'mongoose';
import { CreateUserInput, UpdateUserInput } from '../inputs';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(data: CreateUserInput): Promise<User> {
    const user = new this.userModel(data);
    const newUser = (await user.save()).toObject();
    console.log('newUser', newUser);
    return { ...newUser, id: newUser._id };
  }

  async findAll(): Promise<User[]> {
    return (await this.userModel.find().exec()).map((user) => ({
      ...user.toObject(),
      id: user._id,
    }));
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    console.log('user', user);
    if (!user) {
      return null;
    }
    return plainToInstance(User, { ...user.toObject(), id: user._id });
  }

  async update(data: UpdateUserInput): Promise<User | null> {
    const { id, ...updateData } = data;
    const user = await this.userModel
      .findByIdAndUpdate(
        { _id: new Types.ObjectId(id) },
        {
          ...updateData,
          updatedAt: Date.now(),
        },
        { new: true, runValidators: true },
      )
      .exec();
    if (!user) {
      return null;
    }
    return plainToInstance(User, { ...user.toObject(), id: user._id });
  }

  async softDelete(id: string): Promise<User | null> {
    const user = await this.userModel
      .findByIdAndUpdate(
        { _id: new Types.ObjectId(id) },
        { deletedAt: Date.now(), enabled: false },
        { new: true, runValidators: true },
      )
      .exec();

    if (!user) {
      return null;
    }
    return plainToInstance(User, { ...user.toObject(), id: user._id });
  }

  async delete(id: string): Promise<User | null> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    if (!user) {
      return null;
    }
    return plainToInstance(User, { ...user.toObject(), id: user._id });
  }
}
