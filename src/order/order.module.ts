import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderResolver } from './order.resolver';
import { OrderRepository } from './repositories/order.repository';
import { OrderSchema } from './schemas/order.schema';
import { OrderService } from './services/order.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  providers: [OrderResolver, OrderService, OrderRepository],
})
export class OrderModule {}
