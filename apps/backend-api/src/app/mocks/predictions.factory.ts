import { EvsePredictionResponseSerializer, PredictionDetails } from '../../../../../apps/cdk-apps/src/shared';

export class PredictionsFactory {
    static generatePredictions(status: string, lastUpdated: Date, timeframe?: number): PredictionDetails[] {
        let predictions: PredictionDetails[] = [];
        if (timeframe) {
            predictions.push({
                timestamp: new Date(EvsePredictionResponseSerializer.addTimeframeToTimestamp(timeframe, lastUpdated)).toISOString(),
                status: status as any,
            });
        } else {
            const maxTimeframe = 1440;
            let currentTimeframe = 0;

            predictions = [];
            while (currentTimeframe <= maxTimeframe) {
                predictions.push({
                    timestamp: new Date(EvsePredictionResponseSerializer.addTimeframeToTimestamp(currentTimeframe, lastUpdated)).toISOString(),
                    status: status as any,
                });

                currentTimeframe += 15;
            }
        }

        return predictions;
    }
}