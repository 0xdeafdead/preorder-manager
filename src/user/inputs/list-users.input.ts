import { InputType } from '@nestjs/graphql';
import { PaginationParams } from '../../core/inputs';

@InputType()
export class ListUsersInput extends PaginationParams {}
