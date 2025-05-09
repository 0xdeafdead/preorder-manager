import { Test, TestingModule } from '@nestjs/testing';
import { PreorderResolver } from './preorder.resolver';
import { PreorderService } from './preorder.service';

describe('PreorderResolver', () => {
  let resolver: PreorderResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreorderResolver, PreorderService],
    }).compile();

    resolver = module.get<PreorderResolver>(PreorderResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
