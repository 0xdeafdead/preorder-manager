import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  fullName?: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  email?: string;
}
