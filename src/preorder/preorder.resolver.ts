import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { CreatePreorderInput } from './input/create-preorder.input';
import { UpdatePreorderInput } from './input/update-preorder.input';
import { PreorderService } from './preorder.service';
import { Preorder } from './schemas/preorder.schema';

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
  listPreorders(): Observable<Preorder[]> {
    return this.preorderService.findAll();
  }

  @Query(() => Preorder)
  findPreorderById(@Args('id') id: string): Observable<Preorder> {
    return this.preorderService.findOne(id);
  }

  @Mutation(() => Preorder)
  updatePreorder(
    @Args('input') input: UpdatePreorderInput,
  ): Observable<Preorder> {
    console.log('input', input);
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
