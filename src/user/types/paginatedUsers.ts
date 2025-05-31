import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../core/utils/paginationWrapper';
import { User } from '../schemas';

@ObjectType()
export class PaginatedUsers extends Paginated(User) {}
