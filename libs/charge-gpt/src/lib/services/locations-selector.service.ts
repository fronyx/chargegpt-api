import { Injectable } from '@nestjs/common';
import { Location } from '@fronyx/data-transfer-object';
import { PredictionsQueryService } from '@fronyx/predictions';
import { ChargingStationPrediction } from '../../../../../apps/cdk-apps/src/shared';
import { MAX_GENERATED_TIMESTAMP as MAX_GENERATED_TIMEFRAME } from '../models/predictions';
import { MODEL_MIN_DAYS, MODEL_MIN_WEEKS } from '../models/general-statistics';
import { GeneralStatistics as GENERAL_STATISTICS } from '../models/general-statistics';
import { getStatisticsByPrimaryId } from './primary-ids-statistics.service';
import { ToolkitProject } from '@fronyx/toolkit';

export const chooseAvailableLocations = async (
  values: Location[],
  currentTimestamp: Date,
  requestTimestamp: Date
) => {
  const timeframe = getPredictionsTimeframe(currentTimestamp, requestTimestamp),
    considerCurrentAvailability = timeframe <= 60;

  // ignore probability and statistics of considering current availability of charging stations
  if (considerCurrentAvailability) {
    const locations = values.filter(
      ({ isCurrentlyAvailable }) => isCurrentlyAvailable
    );

    return getAvailableLocations(locations);
  } else {
    return getAvailableLocations(
      await enrichLocationsWithStatistics(values, requestTimestamp)
    );
  }
};

const getAvailableLocations = (values: Location[]): Location[] => {
  if (!values?.length) return [];

  const locations = values
    .filter(({ probability }) => probability < 0.5)
    .sort(({ probability: a }, { probability: b }) => a - b);

  return locations;
};

const getPredictionsTimeframe = (
  currentTimestamp: Date,
  requestTimestamp: Date
): number => {
  const coeff = 1000 * 60 * 15;
  const start = new Date(
    Math.floor(currentTimestamp.getTime() / coeff) * coeff
  );
  const end = new Date(Math.ceil(requestTimestamp.getTime() / coeff) * coeff);

  return (end.getTime() - start.getTime()) / 1000 / 60;
};

const enrichLocationsWithStatistics = async (
  values: Location[],
  requestTimestamp: Date
): Promise<Location[]> => {
  if (values.length < 1) return [];

  const locations = [];

  const { locationsWithStatistics, locationWithoutStatistics } =
    await separateLocationsWithStatistics(values, requestTimestamp);

  locations.push(...locationsWithStatistics);

  if (locations.length > 3) {
    return locations;
  }

  const locationsWithGeneralStatistics =
    await enrichLocationsWithGeneralStatistics(
      locationWithoutStatistics,
      requestTimestamp
    );
  locations.push(...locationsWithGeneralStatistics);

  return locations;
};

const enrichLocationsWithGeneralStatistics = (
  values: Location[],
  requestTimestamp: Date
): Location[] => {
  if (values.length < 1) return [];

  const weeklyIndex = getWeeklyObservedIndex(requestTimestamp);

  return values.map((location) => {
    return {
      ...location,
      probability: GENERAL_STATISTICS[location.powerType][weeklyIndex],
    };
  });
};

const getDailyObservedIndex = (date: Date): number => {
  const hour = date.getHours();
  const minutes = date.getMinutes();

  return hour * 4 + Math.floor(minutes / 15);
};

const getWeeklyObservedIndex = (date: Date): number => {
  const day = date.getDay();
  return day * 24 * 4 + getDailyObservedIndex(date);
};

const separateLocationsWithStatistics = async (
  values: Location[],
  requestTimestamp: Date
): Promise<{
  locationsWithStatistics: Location[];
  locationWithoutStatistics: Location[];
}> => {
  const locationsWithStatistics = [];
  const locationWithoutStatistics = [];

  for (const location of values) {
    const probabilities = [];

    for (const primaryId of location.primaryIds) {
      const statistics = await getStatisticsByPrimaryId(primaryId);
      if (!statistics) {
        continue;
      }

      const dailyIndex = getDailyObservedIndex(requestTimestamp);
      const weeklyIndex = getWeeklyObservedIndex(requestTimestamp);
      if (
        statistics.weekly_observed[weeklyIndex] < MODEL_MIN_WEEKS &&
        statistics.daily_observed[dailyIndex] < MODEL_MIN_DAYS
      ) {
        continue;
      }

      if (statistics.weekly_observed[weeklyIndex] >= MODEL_MIN_WEEKS) {
        probabilities.push(
          statistics.weekly_occupied[weeklyIndex] /
            statistics.weekly_observed[weeklyIndex]
        );
        continue;
      }

      if (statistics.daily_observed[dailyIndex] >= MODEL_MIN_DAYS) {
        probabilities.push(
          statistics.daily_occupied[dailyIndex] /
            statistics.daily_observed[dailyIndex]
        );
        continue;
      }
    }

    if (probabilities.length < 1) {
      locationWithoutStatistics.push({ ...location, probability: null });
      continue;
    }

    locationsWithStatistics.push({
      ...location,
      probability:
        probabilities.reduce((acc, val) => acc + val, 0) / probabilities.length,
    });
  }

  return { locationsWithStatistics, locationWithoutStatistics };
};

// #######
// Old implementation, need to revisit
// #######
@Injectable()
export class LocationsSelectorService {
  constructor(
    private readonly predictionsQueryService: PredictionsQueryService
  ) {}

  async choose(
    values: Location[],
    currentTimestamp: Date,
    requestTimestamp: Date
  ): Promise<Location[]> {
    const timeframe = getPredictionsTimeframe(
        currentTimestamp,
        requestTimestamp
      ),
      considerCurrentAvailability = timeframe <= 60;

    // ignore probability and statistics of considering current availability of charging stations
    if (considerCurrentAvailability) {
      const locations = values.filter(
        ({ isCurrentlyAvailable }) => isCurrentlyAvailable
      );

      return getAvailableLocations(locations);
    } else {
      const { scopedLocations, notScopedLocations } =
          await this.separateScopedLocations(values),
        locations = [];

      if (timeframe <= MAX_GENERATED_TIMEFRAME) {
        try {
          const locationIds = scopedLocations.map(
            ({ locationId }) => locationId
          );
          const predictions = await this.getLocationsPredictions(
            locationIds,
            timeframe
          );

          const locationWithPredictionIdMap = predictions.reduce((acc, val) => {
            const [{ probability }] = val.predictions;
            acc[val.id] = probability;
            return acc;
          }, {} as Record<string, number>);
          const locationsWithoutPredictions = scopedLocations.filter(
            ({ locationId }) => !locationWithPredictionIdMap[locationId]
          );

          notScopedLocations.push(...locationsWithoutPredictions);

          const locationsWithPredictions = scopedLocations
            .filter(({ locationId }) => locationWithPredictionIdMap[locationId])
            .map((location) => ({
              ...location,
              probability: locationWithPredictionIdMap[location.locationId],
            }));

          locations.push(...locationsWithPredictions);
        } catch (err) {
          notScopedLocations.push(...scopedLocations);
        }
      } else {
        notScopedLocations.push(...scopedLocations);
      }

      const nearestLocations = getAvailableLocations(locations);

      if (nearestLocations.length > 2) {
        return nearestLocations;
      }

      const locationsWithStatistics = await enrichLocationsWithStatistics(
        notScopedLocations,
        requestTimestamp
      );
      locations.push(...locationsWithStatistics);

      return getAvailableLocations(locations);
    }
  }

  private async separateScopedLocations(
    values: Location[]
  ): Promise<{ scopedLocations: Location[]; notScopedLocations: Location[] }> {
    const scopedLocations = [];
    const notScopedLocations = [];

    return {
      scopedLocations,
      notScopedLocations,
    };
  }

  private async getLocationsPredictions(
    locationIds: string[],
    timeframe: number
  ): Promise<ChargingStationPrediction[]> {
    const project = {
      response: [
        {
          name: 'probability',
          value: 1,
        },
        {
          name: 'timeframe',
          value: 1,
        },
        {
          name: 'status',
          value: 1,
        },
        {
          name: 'id',
          value: 1,
        },
      ],
      prediction_frequency: 'PERIODIC',
      max_timeframe: 1440,
    } as unknown as ToolkitProject;

    return this.predictionsQueryService.getLocationsPredictions(
      locationIds,
      project,
      timeframe
    );
  }
}
