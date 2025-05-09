import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateOrderInput {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { description: 'Amount of items to request' })
  quantity: number;
}
