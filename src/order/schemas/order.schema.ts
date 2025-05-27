import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now, Types } from 'mongoose';
import { MongoObjectId } from '../../core/scalars/MongoObjecId';
import { Preorder } from '../../preorder/schemas/preorder.schema';
import { User } from '../../user/schemas/user.schema';

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  timestamps: true,
  collection: 'orders',
})
@ObjectType()
export class Order {
  @Prop({ type: Types.ObjectId })
  @Field(() => MongoObjectId)
  id: Types.ObjectId;

  @Prop()
  @Field(() => Int)
  quantity: number;

  @Prop({ default: now })
  @Field(() => Date)
  createdAt: Date;

  @Prop({ default: now })
  @Field(() => Date)
  updatedAt: Date;

  @Prop({ type: Date, default: null, options: { nullable: true } })
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Preorder' })
  @Field(() => Preorder)
  preorder: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  @Field(() => User)
  user: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
