import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreorderRepository } from './repositories';
import { PreorderResolver } from './resolvers';
import { PreorderSchema } from './schemas';
import { PreorderService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Preorder', schema: PreorderSchema }]),
  ],
  providers: [PreorderResolver, PreorderService, PreorderRepository],
  exports: [PreorderService],
})
export class PreorderModule {}
