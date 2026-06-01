import { Test, TestingModule } from '@nestjs/testing';
import { PredictionsQueryService } from './predictions-query.service';

describe('PredictionsQueryService', () => {
  let service: PredictionsQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PredictionsQueryService],
    }).compile();

    service = module.get<PredictionsQueryService>(PredictionsQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
