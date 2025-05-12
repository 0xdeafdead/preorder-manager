import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Game } from '../../core/enums';

@InputType()
export class CreatePreorderInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  productSKU: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  productName: string;

  @Field(() => Float)
  @IsPositive()
  price: number;

  @Field(() => Date)
  // @Transform(({ value }) => new Date(value))
  releaseDate: Date;

  @Field(() => Date)
  // @Transform(({ value }) => new Date(value))
  closeDate: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => [Game])
  @IsArray()
  @IsNotEmpty()
  @IsEnum(Game, { each: true })
  tags: Game[];
}
