import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { from, Observable, of, switchMap } from 'rxjs';
import { CreateUserInput, UpdateUserInput } from './inputs';
import { UserRepository } from './repositories/user.repository';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  logger: Logger;
  constructor(private readonly userRepository: UserRepository) {
    this.logger = new Logger(UserService.name);
  }

  create(createUserInput: CreateUserInput): Observable<User> {
    return from(this.userRepository.create(createUserInput));
  }

  findAll() {
    return from(this.userRepository.findAll());
  }

  findOne(id: string): Observable<User> {
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
    return from(this.userRepository.update(updateUserInput)).pipe(
      switchMap((user) => {
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return of(user);
      }),
    );
  }

  softDelete(id: string): Observable<User> {
    return from(this.userRepository.softDelete(id)).pipe(
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
