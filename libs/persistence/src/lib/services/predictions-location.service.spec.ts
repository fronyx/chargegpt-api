import { Test, TestingModule } from '@nestjs/testing';
import { PredictionsLocationService } from "@fronyx/persistence";

describe('PredictionsLocationService', () => {
  let service: PredictionsLocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PredictionsLocationService],
    }).compile();

    service = module.get<PredictionsLocationService>(
      PredictionsLocationService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
