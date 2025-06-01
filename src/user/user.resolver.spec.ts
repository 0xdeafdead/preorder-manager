import { faker } from '@faker-js/faker/.';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { buildMongoId } from '../core/factories';
import { DeepPartialMock } from '../core/types';
import { UserFactory } from './factories';
import { CreateUserInput, UpdateUserInput } from './inputs';
import { userServiceMock } from './mocks';
import { UserService } from './services/user.service';
import { UserResolver } from './user.resolver';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let userService: DeepPartialMock<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useFactory: userServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    const input: CreateUserInput = {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
    };
    const user = UserFactory.build();
    it('should call userService.create', (done) => {
      userService.create?.mockReturnValueOnce(of(user));
      resolver.createUser(input).subscribe({
        next: (result) => {
          expect(userService.create).toHaveBeenCalledWith(input);
          expect(result).toEqual(user);
          done();
        },
      });
    });
  });

  describe('getAllUsers', () => {
    const users = UserFactory.buildMany(3);
    it('should call userService.findAll', (done) => {
      userService.findAll?.mockReturnValueOnce(of(users));
      resolver.getAllUsers().subscribe({
        next: (results) => {
          expect(userService.findAll).toHaveBeenCalled();
          expect(results).toEqual(users);
          done();
        },
      });
    });
  });

  describe('getUserById', () => {
    const id = buildMongoId();
    const user = UserFactory.build();
    it('should call userService.findOne', (done) => {
      userService.findById?.mockReturnValueOnce(of(user));
      resolver.getUserById(id).subscribe({
        next: (user) => {
          expect(userService.findById).toHaveBeenCalledWith(id);
          expect(user).toEqual(user);
          done();
        },
      });
    });
  });

  describe('getUserByEmail', () => {
    const email = faker.internet.email();
    const user = UserFactory.build();
    it('should call userService.findByEmail', (done) => {
      userService.findByEmail?.mockReturnValueOnce(of(user));
      resolver.getUserByEmail(email).subscribe({
        next: (user) => {
          expect(userService.findByEmail).toHaveBeenCalledWith(email);
          expect(user).toEqual(user);
          done();
        },
      });
    });
  });

  describe('updateUser', () => {
    const input: UpdateUserInput = {
      id: buildMongoId(),
      fullName: faker.person.fullName(),
    };
    const user = UserFactory.build(input);
    it('should call userService.update', (done) => {
      userService.update?.mockReturnValueOnce(of(user));
      resolver.updateUser(input).subscribe({
        next: (user) => {
          expect(userService.update).toHaveBeenCalledWith(input);
          expect(user).toEqual(user);
          done();
        },
      });
    });
  });

  describe('deactivateUser', () => {
    const id = buildMongoId();
    const user = UserFactory.build();
    it('should call userService.softDelete', (done) => {
      userService.softDelete?.mockReturnValueOnce(of(user));
      resolver.deactivateUser(id).subscribe({
        next: (user) => {
          expect(userService.softDelete).toHaveBeenCalledWith(id);
          expect(user).toEqual(user);
          done();
        },
      });
    });
  });

  describe('removeUser', () => {
    const id = buildMongoId();
    const user = UserFactory.build();
    it('should call userService.remove', (done) => {
      userService.remove?.mockReturnValueOnce(of(user));
      resolver.removeUser(id).subscribe({
        next: (user) => {
          expect(userService.remove).toHaveBeenCalledWith(id);
          expect(user).toEqual(user);
          done();
        },
      });
    });
  });
});
