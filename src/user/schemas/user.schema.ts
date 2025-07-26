import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now, Types } from 'mongoose';
import { MongoObjectId } from '../../core/scalars/MongoObjecId';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'users' })
@ObjectType()
export class User {
  @Prop({ type: Types.ObjectId })
  @Field(() => MongoObjectId)
  id: Types.ObjectId;

  @Prop()
  @Field(() => String)
  fullName: string;

  @Prop({ unique: true, index: true })
  @Field(() => String)
  email: string;

  @Prop({ default: true })
  @Field(() => Boolean, { defaultValue: true })
  enabled: boolean;

  @Prop({ default: now() })
  @Field(() => Date)
  createdAt: Date;

  @Prop({ default: now() })
  @Field(() => Date)
  updatedAt: Date;

  @Prop({ type: Date, default: null, options: { nullable: true } })
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
