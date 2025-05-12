import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Game } from '../../core/enums';
import { MongoObjectId } from '../../core/scalars/MongoObjecId';

export type PreorderDocument = HydratedDocument<Preorder>;

@Schema({ timestamps: true, collection: 'preorders' })
@ObjectType()
export class Preorder {
  @Prop({ type: Types.ObjectId })
  @Field(() => MongoObjectId)
  id: Types.ObjectId;

  @Prop()
  @Field(() => String)
  productSKU: string;

  @Prop({ required: true })
  @Field(() => String)
  productName: string;

  @Prop()
  @Field(() => Float)
  price: number;

  @Prop({ default: true })
  @Field(() => Boolean, { defaultValue: false })
  available: boolean;

  @Prop(() => Date)
  @Field(() => Date)
  releaseDate: Date;

  @Prop(() => Date)
  @Field(() => Date)
  closeDate: Date;

  @Prop({ type: Date, default: null, options: { nullable: true } })
  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Prop({ nullable: true })
  @Field(() => String, { nullable: true })
  description?: string;

  @Prop({ enum: Game, type: [String] })
  @Field(() => [Game])
  tags: Game[];
}

export const PreorderSchema = SchemaFactory.createForClass(Preorder);
