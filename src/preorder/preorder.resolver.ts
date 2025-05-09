import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePreorderInput } from './input/create-preorder.input';
import { UpdatePreorderInput } from './input/update-preorder.input';
import { PreorderService } from './preorder.service';
import { Preorder } from './schemas/preorder.schema';

@Resolver(() => Preorder)
export class PreorderResolver {
  constructor(private readonly preorderService: PreorderService) {}

  @Mutation(() => Preorder)
  createPreorder(@Args('input') input: CreatePreorderInput) {
    return this.preorderService.create(input);
  }

  @Query(() => [Preorder], { name: 'preorders' })
  findAll() {
    return this.preorderService.findAll();
  }

  @Query(() => Preorder, { name: 'preorder' })
  findOne(@Args('id') id: string) {
    return this.preorderService.findOne(id);
  }

  @Mutation(() => Preorder)
  updatePreorder(@Args('input') input: UpdatePreorderInput) {
    return this.preorderService.update(input);
  }

  @Mutation(() => Preorder)
  removePreorder(@Args('id') id: string) {
    return this.preorderService.remove(id);
  }
}
