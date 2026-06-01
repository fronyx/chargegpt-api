import { Test, TestingModule } from '@nestjs/testing';
import { PredictionsReportRequestService } from 'libs/persistence/src/lib/services/predictions-report-request.service';

describe('PredictionsReportRequestService', () => {
  let service: PredictionsReportRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PredictionsReportRequestService],
    }).compile();

    service = module.get<PredictionsReportRequestService>(
      PredictionsReportRequestService
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
