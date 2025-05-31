import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';
import { Game } from '../../core/enums';
import { PaginationParams } from '../../core/inputs';

@InputType()
export class ListPreordersInput extends PaginationParams {
  @Field(() => Game, { nullable: true })
  @IsOptional()
  @IsEnum(Game)
  tag?: Game;
}
