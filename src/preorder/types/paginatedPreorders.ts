import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../core/utils/paginationWrapper';
import { Preorder } from '../schemas/preorder.schema';

@ObjectType()
export class PaginatedPreorders extends Paginated(Preorder) {}
