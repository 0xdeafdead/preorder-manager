import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { ListPreordersInput } from './input';
import { CreatePreorderInput } from './input/create-preorder.input';
import { UpdatePreorderInput } from './input/update-preorder.input';
import { Preorder } from './schemas/preorder.schema';
import { PreorderService } from './services/preorder.service';
import { PaginatedPreorders } from './types';

@Resolver(() => Preorder)
export class PreorderResolver {
  constructor(private readonly preorderService: PreorderService) {}

  @Mutation(() => Preorder)
  createPreorder(
    @Args('input') input: CreatePreorderInput,
  ): Observable<Preorder> {
    return this.preorderService.create(input);
  }

  @Query(() => [Preorder])
  getAllPreorders(): Observable<Preorder[]> {
    return this.preorderService.findAll();
  }

  @Query(() => PaginatedPreorders, { name: 'listPreorders' })
  listPreorders(
    @Args('input') input: ListPreordersInput,
  ): Observable<PaginatedPreorders> {
    return this.preorderService.list(input);
  }

  @Query(() => Preorder)
  findPreorderById(@Args('id') id: string): Observable<Preorder> {
    return this.preorderService.findOne(id);
  }

  @Mutation(() => Preorder)
  updatePreorder(
    @Args('input') input: UpdatePreorderInput,
  ): Observable<Preorder> {
    return this.preorderService.update(input);
  }

  @Mutation(() => Preorder)
  changeAvailability(@Args('id') id: string): Observable<Preorder> {
    return this.preorderService.changeAvailability(id);
  }

  @Mutation(() => Preorder)
  softDeletePreorder(@Args('id') id: string): Observable<Preorder> {
    return this.preorderService.softDelete(id);
  }

  @Mutation(() => Preorder)
  removePreorder(@Args('id') id: string): Observable<Preorder> {
    return this.preorderService.remove(id);
  }
}
