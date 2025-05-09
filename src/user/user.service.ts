import { Injectable, Logger } from '@nestjs/common';
import { from, Observable } from 'rxjs';
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

  findOne(id: string): Observable<User | null> {
    return from(this.userRepository.findById(id));
  }

  update(updateUserInput: UpdateUserInput) {
    return from(this.userRepository.update(updateUserInput));
  }

  softDelete(id: string) {
    return from(this.userRepository.softDelete(id));
  }

  remove(id: string) {
    return from(this.userRepository.delete(id));
  }
}
