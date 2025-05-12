import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Game } from '../../core/enums';

@InputType()
export class UpdatePreorderInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field(() => String, { nullable: true })
  @ValidateIf((o) => o.productSKU !== undefined)
  @IsString()
  @IsNotEmpty()
  productSKU?: string;

  @Field(() => String, { nullable: true })
  @ValidateIf((o) => o.productName !== undefined)
  @IsString()
  @IsNotEmpty()
  productName?: string;

  @Field(() => Float, { nullable: true })
  @ValidateIf((o) => o.price !== undefined)
  @IsPositive()
  price?: number;

  @Field(() => Date, { nullable: true })
  @ValidateIf((o) => o.releaseDate !== undefined)
  @IsNotEmpty()
  releaseDate?: Date;

  @Field(() => Date, { nullable: true })
  @ValidateIf((o) => o.closeDate !== undefined)
  @IsNotEmpty()
  @IsDate()
  closeDate?: Date;

  @Field(() => String, { nullable: true })
  @ValidateIf((o) => o.description !== undefined)
  description?: string;

  @Field(() => [Game], { nullable: true })
  @ValidateIf((o) => o.tags !== undefined)
  @IsEnum(Game, { each: true })
  tags?: Game[];
}
