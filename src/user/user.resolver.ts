import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { CreateUserInput, ListUsersInput, UpdateUserInput } from './inputs';
import { User } from './schemas/user.schema';
import { UserService } from './services';
import { PaginatedUsers } from './types';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('input') input: CreateUserInput): Observable<User> {
    return this.userService.create(input);
  }

  @Query(() => [User])
  getAllUsers() {
    return this.userService.findAll();
  }

  @Query(() => PaginatedUsers, { name: 'listUsers' })
  listUsers(@Args('input') input: ListUsersInput): Observable<PaginatedUsers> {
    return this.userService.list(input);
  }

  @Query(() => User)
  getUserById(@Args('id') id: string): Observable<User> {
    return this.userService.findById(id);
  }

  @Query(() => User)
  getUserByEmail(@Args('email') email: string): Observable<User> {
    return this.userService.findByEmail(email);
  }

  @Mutation(() => User)
  updateUser(@Args('input') input: UpdateUserInput): Observable<User> {
    return this.userService.update(input);
  }

  @Mutation(() => User)
  deactivateUser(@Args('id') id: string): Observable<User> {
    return this.userService.softDelete(id);
  }

  @Mutation(() => User)
  removeUser(@Args('id') id: string): Observable<User> {
    return this.userService.remove(id);
  }
}
