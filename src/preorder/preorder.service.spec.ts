import { Test, TestingModule } from '@nestjs/testing';
import { PreorderService } from './preorder.service';

describe('PreorderService', () => {
  let service: PreorderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreorderService],
    }).compile();

    service = module.get<PreorderService>(PreorderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
