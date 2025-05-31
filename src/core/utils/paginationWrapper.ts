import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PaginatedResults } from '../types';

export function Paginated<T>(classRef: Type<T>): Type<PaginatedResults<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements PaginatedResults<T> {
    @Field(() => [classRef], { nullable: true })
    edges: T[];

    @Field(() => Int, { nullable: true })
    total: number;

    @Field(() => Int, { nullable: true })
    page: number;

    @Field(() => Int, { nullable: true })
    pageSize: number;
  }
  return PaginatedType as Type<PaginatedResults<T>>;
}
