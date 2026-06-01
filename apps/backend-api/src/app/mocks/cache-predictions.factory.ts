export class CachePredictionsFactory {
    static generatePredictions(lastUpdated: Date): Record<number, string> {
        const predictions = {};
        const maxTimeframe = 1440;

        let timeframe = 0;
        while (timeframe <= maxTimeframe) {
            predictions[timeframe] = `AVAILABLE:0.9000:${lastUpdated.getTime()}`;
            timeframe += 15;
        }

        return predictions;
    }
}