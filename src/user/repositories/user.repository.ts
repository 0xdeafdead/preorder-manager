import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, Types } from 'mongoose';
import { CreateUserInput, UpdateUserInput } from '../inputs';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(data: CreateUserInput): Promise<User> {
    const user = new this.userModel(data);
    const newUser = (await user.save()).toObject();
    return newUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      return null;
    }
    return plainToInstance(User, { ...user.toObject(), id: user._id });
  }

  async update(data: UpdateUserInput): Promise<User | null> {
    const { id, ...updateData } = data;
    return this.userModel
      .findByIdAndUpdate({ _id: new Types.ObjectId(id) }, data)
      .exec();
  }

  async softDelete(id: string): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, { deletedAt: Date.now() })
      .exec();
  }

  async delete(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
