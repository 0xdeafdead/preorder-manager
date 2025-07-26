import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field(() => String, { nullable: true })
  @ValidateIf((o: { fullName: string }) => typeof o.fullName !== 'undefined')
  @IsString()
  @IsNotEmpty()
  fullName?: string;
}
