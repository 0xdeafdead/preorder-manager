import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';

@InputType()
export class UpdateOrderInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field(() => Int, {
    description:
      'Amount of items to request. Must be lower than actual order, but greater than 0',
  })
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
