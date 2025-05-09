import { CreatePreorderInput } from './create-preorder.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePreorderInput extends PartialType(CreatePreorderInput) {
  @Field(() => Int)
  id: number;
}
