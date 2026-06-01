import { Test, TestingModule } from '@nestjs/testing';
import { EvsePredictionsService } from './evse-predictions.service';

describe('EvsePredictionsService', () => {
  let service: EvsePredictionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvsePredictionsService],
    }).compile();

    service = module.get<EvsePredictionsService>(EvsePredictionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
