import { ProcessedPrediction } from '../logging/update-create/models/processed-prediction';

const fifteenMinutes = 900000;

export function filterOldPredictions(args: ProcessedPrediction[]): ProcessedPrediction[] {
  // Discard predictions older than 15 minutes
  return args.filter(({ updated_at }) => {
    const now = Date.now();
    const last = updated_at.getTime();

    return (now - last) < fifteenMinutes;
  });
}
