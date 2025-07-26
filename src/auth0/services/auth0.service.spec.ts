import { HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepPartialMock } from '../../core/types';
import { redisServiceMock } from '../../redis/mocks';
import { RedisService } from '../../redis/service';
import { Auth0Service } from './auth0.service';

describe('Auth0Service', () => {
  let service: Auth0Service;
  let httpService: HttpService;
  let redisService: DeepPartialMock<RedisService>;

  const httpServiceMock = {
    post: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Auth0Service,
        {
          provide: HttpService,
          useValue: httpServiceMock,
        },
        {
          provide: RedisService,
          useFactory: redisServiceMock,
        },
      ],
    }).compile();

    service = module.get<Auth0Service>(Auth0Service);
    httpService = module.get(HttpService);
    redisService = module.get(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(httpService).toBeDefined();
    expect(redisService).toBeDefined();
  });
});
