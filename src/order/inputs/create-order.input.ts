import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field(() => Int, { description: 'Amount of items to request' })
  quantity: number;

  @Field(() => String)
  preorderId: string;

  @Field(() => String)
  userId: string;
}
