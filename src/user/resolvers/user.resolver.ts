import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { PermissionGuard } from 'src/core/guards';
import { CreateUserInput, ListUsersInput, UpdateUserInput } from '../inputs';
import { User } from '../schemas/user.schema';
import { UserService } from '../services';
import { PaginatedUsers } from '../types';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  //Only admins can create users
  @UseGuards(PermissionGuard(['create:user']))
  createUser(@Args('input') input: CreateUserInput): Observable<User> {
    return this.userService.create(input);
  }

  @Query(() => PaginatedUsers, { name: 'listUsers' })
  // Endpoint for backoffice
  @UseGuards(PermissionGuard(['read:list-user']))
  listUsers(@Args('input') input: ListUsersInput): Observable<PaginatedUsers> {
    return this.userService.list(input);
  }

  @Query(() => User)
  // Only admins and users themselves can see their own profile
  @UseGuards(PermissionGuard(['read:user']))
  getUserById(@Args('id') id: string): Observable<User> {
    return this.userService.findById(id);
  }

  @Query(() => User)
  // Endpoint for backoffice
  @UseGuards(PermissionGuard(['read:user']))
  getUserByEmail(@Args('email') email: string): Observable<User> {
    return this.userService.findByEmail(email);
  }

  @Mutation(() => User)
  @UseGuards(PermissionGuard(['update:user']))
  updateUser(@Args('input') input: UpdateUserInput): Observable<User> {
    return this.userService.update(input);
  }

  @Mutation(() => User)
  //Only admins and users themselves can change their own status
  @UseGuards(PermissionGuard(['delete:user']))
  deactivateUser(@Args('id') id: string): Observable<User> {
    return this.userService.softDelete(id);
  }

  @Mutation(() => User)
  //Only admins can delete users
  @UseGuards(PermissionGuard(['delete:user']))
  removeUser(@Args('id') id: string): Observable<User> {
    return this.userService.remove(id);
  }
}
