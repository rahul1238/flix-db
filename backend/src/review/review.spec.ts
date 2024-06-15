import { Test, TestingModule } from '@nestjs/testing';
import { Review } from './review.service';

describe('Review', () => {
  let provider: Review;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Review],
    }).compile();

    provider = module.get<Review>(Review);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
