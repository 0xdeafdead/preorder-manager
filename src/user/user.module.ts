import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers';
import { UserRepository } from './repositories';
import { UserResolver } from './resolvers';
import { UserSchema } from './schemas';
import { UserService } from './services';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UserResolver, UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
