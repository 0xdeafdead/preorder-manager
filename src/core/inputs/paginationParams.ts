import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class PaginationParams {
  @Field(() => Int)
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @Field(() => Int)
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize: number = 10;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  search?: string;
}
