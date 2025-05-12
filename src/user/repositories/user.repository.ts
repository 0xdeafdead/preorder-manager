import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoreRepository } from '../../core/repositories/core.repository';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserRepository extends CoreRepository<User> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super(userModel);
  }
}
