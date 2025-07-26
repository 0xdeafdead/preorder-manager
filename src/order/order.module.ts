import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { OrderRepository } from './repositories';
import { OrderResolver } from './resolvers';
import { OrderSchema } from './schemas';
import { OrderService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    PassportModule,
  ],
  providers: [OrderResolver, OrderService, OrderRepository],
})
export class OrderModule {}
