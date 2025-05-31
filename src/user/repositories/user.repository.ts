import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, RootFilterQuery } from 'mongoose';
import { CoreRepository } from '../../core/repositories/core.repository';
import { ListUsersInput } from '../inputs';
import { User } from '../schemas/user.schema';
import { PaginatedUsers } from '../types';

@Injectable()
export class UserRepository extends CoreRepository<User> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super(userModel);
  }

  async listUsers(input: ListUsersInput): Promise<PaginatedUsers> {
    const { page, pageSize, search } = input;
    const whereClause: RootFilterQuery<User> = {
      enabled: true,
    };
    if (search) {
      whereClause.fullName = { $regex: search, $options: 'i' };
      whereClause.email = { $regex: search, $options: 'i' };
    }
    const results = await this.userModel
      .find(whereClause)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec()
      .then((docs) =>
        docs.map((doc) =>
          plainToInstance(User, { ...doc.toObject(), id: doc._id }),
        ),
      );
    const count = await this.userModel.countDocuments(whereClause).exec();
    return {
      edges: results,
      total: count,
      page,
      pageSize,
    };
  }
}
