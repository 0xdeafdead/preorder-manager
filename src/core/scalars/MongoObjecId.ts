import { Scalar } from '@nestjs/graphql';
import { ASTNode, Kind } from 'graphql';
import { ObjectId } from 'mongodb';

@Scalar('MongoObjectId')
export class MongoObjectId {
  description = 'Mongo Object Id';
  parseValue(value: string) {
    return new ObjectId(value);
  }

  serialize(value: ObjectId): string {
    return value.toHexString();
  }

  parseLiteral(ast: ASTNode) {
    if (ast.kind === Kind.STRING) {
      return new ObjectId(ast.value);
    }
    return null;
  }
}
