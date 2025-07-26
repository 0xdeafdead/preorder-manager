import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { PermissionGuard } from '../../core/guards';
import {
  CreatePreorderInput,
  ListPreordersInput,
  UpdatePreorderInput,
} from '../input';
import { Preorder } from '../schemas';
import { PreorderService } from '../services';
import { PaginatedPreorders } from '../types';

@Resolver(() => Preorder)
export class PreorderResolver {
  constructor(private readonly preorderService: PreorderService) {}

  @Mutation(() => Preorder)
  // Only admins can create preorders
  @UseGuards(PermissionGuard(['create:preorder']))
  createPreorder(
    @Args('input') input: CreatePreorderInput,
  ): Observable<Preorder> {
    return this.preorderService.create(input);
  }

  @Query(() => PaginatedPreorders, { name: 'listPreorders' })
  // All users can fetch preorders
  @UseGuards(PermissionGuard(['read:list-preorder']))
  listPreorders(
    @Args('input') input: ListPreordersInput,
  ): Observable<PaginatedPreorders> {
    return this.preorderService.list(input);
  }

  @Query(() => Preorder)
  // All users can fetch preorders
  @UseGuards(PermissionGuard(['read:preorder']))
  findPreorderById(@Args('id') id: string): Observable<Preorder> {
    return this.preorderService.findOne(id);
  }

  @Mutation(() => Preorder)
  // Only admins can update preorders, backoffice exclusive
  @UseGuards(PermissionGuard(['update:preorder']))
  updatePreorder(
    @Args('input') input: UpdatePreorderInput,
  ): Observable<Preorder> {
    return this.preorderService.update(input);
  }

  @Mutation(() => Preorder)
  // Only admins can update preorders
  @UseGuards(PermissionGuard(['update:preorder']))
  changeAvailability(@Args('id') id: string): Observable<Preorder> {
    return this.preorderService.changeAvailability(id);
  }

  @Mutation(() => Preorder)
  // Only admins can update preorders
  @UseGuards(PermissionGuard(['update:preorder']))
  softDeletePreorder(@Args('id') id: string): Observable<Preorder> {
    return this.preorderService.softDelete(id);
  }

  @Mutation(() => Preorder)
  // Only admins can update preorders
  @UseGuards(PermissionGuard(['update:preorder']))
  removePreorder(@Args('id') id: string): Observable<Preorder> {
    return this.preorderService.remove(id);
  }
}
