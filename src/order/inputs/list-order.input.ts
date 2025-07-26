import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Game } from '../../core/enums';
import { PaginationParams } from '../../core/inputs';

@InputType()
export class ListOrderInput extends PaginationParams {
  //TODO:AUTH remove when auth to retrieve current user from decorador
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  userId?: string;

  // @Field(() => String)
  // @IsString()
  // @IsNotEmpty()
  // userEmail?: string;

  @Field(() => Game, { nullable: true })
  @IsOptional()
  @IsEnum(Game)
  tag?: Game;
}
