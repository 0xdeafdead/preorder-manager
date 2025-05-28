import { faker } from '@faker-js/faker/.';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { buildMongoId } from '../../core/factories';
import { DeepPartialMock } from '../../core/types';
import { UserFactory } from '../factories';
import { CreateUserInput, UpdateUserInput } from '../inputs';
import { userRepositoryMock } from '../mocks';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let userRepository: DeepPartialMock<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useFactory: userRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    const input: CreateUserInput = {
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
    };

    const user = UserFactory.build();
    it('should call userRepository.create and return a user', (done) => {
      userRepository.create?.mockResolvedValue(user);

      //Act & Assert
      service.create(input).subscribe({
        next: (result) => {
          expect(userRepository.create).toHaveBeenCalledWith(input);
          expect(result).toEqual(user);
          done();
        },
      });
    });
  });

  describe('findAll', () => {
    const users = UserFactory.buildMany(3);
    it('should return a list of users', (done) => {
      userRepository.findAll?.mockResolvedValue(users);

      //Act & Assert
      service.findAll().subscribe({
        next: (result) => {
          expect(result).toEqual(users);
          done();
        },
      });
    });
  });

  describe('findOne', () => {
    const id = buildMongoId();
    const user = UserFactory.build();
    it('should return a user', (done) => {
      userRepository.findById?.mockResolvedValue(user);

      //Act & Assert
      service.findOne(id).subscribe({
        next: (result) => {
          expect(userRepository.findById).toHaveBeenCalledWith(id);
          expect(result).toEqual(user);
          done();
        },
      });
    });

    it('should throw NotFoundException if not found', (done) => {
      userRepository.findById?.mockResolvedValue(null);

      //Act & Assert
      service.findOne(id).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });
  });

  describe('update', () => {
    const input: UpdateUserInput = {
      id: buildMongoId(),
      fullName: faker.person.fullName(),
    };
    const user = UserFactory.build();
    it('should user updated', (done) => {
      const { id, ...data } = input;
      userRepository.update?.mockResolvedValue(user);

      //Act & Assert
      service.update(input).subscribe({
        next: (result) => {
          expect(userRepository.update).toHaveBeenCalledWith(id, data);
          expect(result).toEqual(user);
          done();
        },
      });
    });

    it('should throw NotFoundException if user not found', (done) => {
      userRepository.update?.mockResolvedValue(null);

      //Act & Assert
      service.update(input).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });
  });

  describe('softDelete', () => {
    const id = buildMongoId();

    jest.useFakeTimers();
    const now = new Date();
    jest.setSystemTime(now);
    const user = UserFactory.build();
    it('should update the user enable status', (done) => {
      userRepository.update?.mockResolvedValue(user);

      //Act & Assert
      service.softDelete(id).subscribe({
        next: (result) => {
          expect(userRepository.update).toHaveBeenCalledWith(
            id,
            expect.objectContaining({
              enabled: false,
              deletedAt: now,
            }),
          );
          expect(result).toEqual(user);
          done();
        },
      });
    });

    it('should throw NotFoundException if not found', (done) => {
      userRepository.update?.mockResolvedValue(null);

      service.softDelete(id).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });
  });

  describe('remove', () => {
    const id = buildMongoId();
    const user = UserFactory.build();
    it('should remove user', (done) => {
      userRepository.delete?.mockResolvedValue(user);
      service.remove(id).subscribe({
        next: (result) => {
          expect(userRepository.delete).toHaveBeenCalledWith(id);
          expect(result).toEqual(user);
          done();
        },
      });
    });
    it('should throw NotFoundException if not found', (done) => {
      userRepository.delete?.mockResolvedValue(null);
      service.remove(id).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });
  });
});
