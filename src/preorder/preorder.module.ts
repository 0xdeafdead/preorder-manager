import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreorderResolver } from './preorder.resolver';
import { PreorderRepository } from './repositories/preorder.repository';
import { PreorderSchema } from './schemas/preorder.schema';
import { PreorderService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Preorder', schema: PreorderSchema }]),
  ],
  providers: [PreorderResolver, PreorderService, PreorderRepository],
  exports: [PreorderService],
})
export class PreorderModule {}
