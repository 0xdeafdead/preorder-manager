import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field(() => String, { nullable: true })
  @ValidateIf((o) => o.fullName !== undefined)
  @IsString()
  @IsNotEmpty()
  fullName?: string;

  @Field(() => String, { nullable: true })
  @ValidateIf((o) => o.email !== undefined)
  @IsEmail()
  @IsNotEmpty()
  email?: string;
}
