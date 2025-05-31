import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '../../core/utils/paginationWrapper';
import { Order } from '../schemas/order.schema';

@ObjectType()
export class PaginatedOrders extends Paginated(Order) {}
