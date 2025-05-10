import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLError } from 'graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoObjectId } from './core/scalars/MongoObjecId';
import { OriginalError } from './core/types';
import { OrderModule } from './order/order.module';
import { PreorderModule } from './preorder/preorder.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/preorder-manager', {
      authSource: 'admin',
      user: 'root',
      pass: 'password',
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => {
        return {
          autoSchemaFile: 'schema.gql',
          sortSchema: true,
          introspection: true,
          playground: false,
          context: ({ req, res }: { req: Request; res: Response }) => ({
            req,
            res,
          }),
          formatError: (error: GraphQLError) => {
            const originalError = error?.extensions
              ?.originalError as OriginalError;
            if (!originalError) {
              return {
                message: error.message,
                code: error.extensions?.code,
                status: error.extensions?.status,
              };
            }
            return {
              message: originalError.message,
              code: originalError.statusCode,
              status: originalError.error,
            };
          },
        };
      },
    }),
    MongoObjectId,
    UserModule,
    PreorderModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
