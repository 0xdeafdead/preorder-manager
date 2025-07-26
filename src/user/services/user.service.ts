import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { from, Observable, of, switchMap } from 'rxjs';
import { CreateUserInput, ListUsersInput, UpdateUserInput } from '../inputs';
import { UserRepository } from '../repositories';
import { User } from '../schemas';
import { PaginatedUsers } from '../types';

@Injectable()
export class UserService {
  logger: Logger;
  constructor(private readonly userRepository: UserRepository) {
    this.logger = new Logger(UserService.name);
  }

  create(createUserInput: CreateUserInput): Observable<User> {
    return from(this.userRepository.create(createUserInput));
  }

  upsert(createUserInput: CreateUserInput): Observable<User> {
    return from(this.userRepository.upsertUser(createUserInput));
  }

  findAll(): Observable<User[]> {
    return from(this.userRepository.findAll());
  }

  list(listUserInput: ListUsersInput): Observable<PaginatedUsers> {
    return from(this.userRepository.listUsers(listUserInput));
  }

  findByEmail(email: string): Observable<User> {
    return from(this.userRepository.findOneByEmail(email)).pipe(
      switchMap((user) => {
        return of(user);
      }),
    );
  }

  findById(id: string): Observable<User> {
    return from(this.userRepository.findById(id)).pipe(
      switchMap((user) => {
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return of(user);
      }),
    );
  }

  update(updateUserInput: UpdateUserInput): Observable<User> {
    const { id, ...data } = updateUserInput;
    return from(this.userRepository.update(id, data)).pipe(
      switchMap((user) => {
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return of(user);
      }),
    );
  }

  softDelete(id: string): Observable<User> {
    return from(
      this.userRepository.update(id, { enabled: false, deletedAt: new Date() }),
    ).pipe(
      switchMap((user) => {
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return of(user);
      }),
    );
  }

  remove(id: string): Observable<User> {
    return from(this.userRepository.delete(id)).pipe(
      switchMap((user) => {
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return of(user);
      }),
    );
  }
}
