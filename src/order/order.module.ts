import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreorderModule } from '../preorder/preorder.module';
import { UserModule } from '../user/user.module';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { OrderRepository } from './repositories/order.repository';
import { OrderSchema } from './schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    UserModule,
    PreorderModule,
  ],
  providers: [OrderResolver, OrderService, OrderRepository],
})
export class OrderModule {}
