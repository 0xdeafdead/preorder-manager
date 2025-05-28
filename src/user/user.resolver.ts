import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { CreateUserInput, UpdateUserInput } from './inputs';
import { User } from './schemas/user.schema';
import { UserService } from './services';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('input') input: CreateUserInput): Observable<User> {
    return this.userService.create(input);
  }

  @Query(() => [User], { name: 'listUsers' })
  getAllUsers() {
    return this.userService.findAll();
  }

  @Query(() => User)
  getUserById(@Args('id') id: string): Observable<User> {
    return this.userService.findOne(id);
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
