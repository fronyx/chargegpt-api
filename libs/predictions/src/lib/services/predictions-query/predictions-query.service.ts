import { Injectable } from '@nestjs/common';
import {
  ChargingStationPrediction,
  EvsePrediction,
  EvsePredictionResponseSerializer,
} from '../../../../../../apps/cdk-apps/src/shared';
import { EvsePredictionsService } from '../evse-predictions/evse-predictions.service';
import { EvsesService } from '../evses/evses.service';
import { LocationsService } from '../locations/locations.service';
import { isNull } from '../../../../../../apps/cdk-apps/src/shared/utils/is-null.function';
import { ToolkitProject } from '@fronyx/toolkit';

@Injectable()
export class PredictionsQueryService {

  constructor(
    private readonly locationsService: LocationsService,
    private readonly evsesService: EvsesService,
    private readonly evsePredictionsService: EvsePredictionsService,
  ) {
  }

  async getEvsePredictionsByLocationIdsEvseIds(
    locationIdsEvseIds: string[],
    project: ToolkitProject,
    timeframe?: number
  ): Promise<EvsePrediction[]> {
    let firstErrorOccured: Error = null;
    const locationIdsUids = [];
    const primaryId2EvseIdMap: Record<string, string> = {};

    for (const locationIdEvseId of locationIdsEvseIds) {
      const [locationId, evseId] = locationIdEvseId.split('_');
      try {
        const primaryId = await this.evsesService.getByLocationIdEvseId({ locationId, evseId });
        locationIdsUids.push(primaryId);
        primaryId2EvseIdMap[primaryId] = evseId;
      } catch (err) {
        if (firstErrorOccured === null) {
          firstErrorOccured = err as Error;
        }
      }
    }

    let predictions: EvsePrediction[] = [];

    try {
      predictions = await this.getEvsePredictionsByLocationIdsUids(locationIdsUids, project, timeframe);
    } catch (err) {
      if (firstErrorOccured === null) {
        firstErrorOccured = err as Error;
      }
    }

    if (predictions.length < 1 && firstErrorOccured) {
      throw firstErrorOccured;
    }

    return predictions.map(val => new EvsePrediction({
      evseId: primaryId2EvseIdMap[`${val.locationId}_${val.uid}`],
      uid: val.uid,
      locationId: val.locationId,
      predictions: val.predictions,
    }));
  }

  async getEvsePredictionsByLocationIdsUids(
    locationIdsUids: string[],
    project: ToolkitProject,
    timeframe?: number
  ): Promise<EvsePrediction[]> {
    let firstErrorOccured = null;
    const predictions = [];
    const serializer = new EvsePredictionResponseSerializer({ project });

    for (const locationIdUid of locationIdsUids) {
      const [locationId, uid] = locationIdUid.split('_');

      try {
        const evsePredictions = await this.evsePredictionsService.get(locationId, uid, project.prediction_frequency);

        predictions.push(
          new EvsePrediction({
            uid,
            locationId,
            predictions: evsePredictions
              .values()
              .filter((val) => {
                if (!isNull(timeframe)) {
                  return Number(val.timeframe) === Number(timeframe);
                } else {
                  return true;
                }
              })
              .filter(
                (val) => val.timeframe <= Number(project.max_timeframe)
              )
              .map((val) =>
                serializer.serialize({
                  timeframe: val.timeframe,
                  timestamp: val.updated_at,
                  status: val.status,
                  probability: val.probability,
                })
              ),
          })
        );
      } catch (err) {
        if (firstErrorOccured === null) {
          firstErrorOccured = err;
        }
      }
    }

    if (predictions.length < 1 && firstErrorOccured !== null) {
      throw firstErrorOccured;
    }

    return predictions;
  }

  async getEvsePredictionsByEvseIds(
    evseIds: string[],
    project: ToolkitProject,
    timeframe?: number
  ): Promise<EvsePrediction[]> {
    let firstErrorOccured = null;
    const locationIdsUids = [];
    const primaryIdToEvseIdMap = {};

    for (const evseId of evseIds) {
      try {
        const primaryId = await this.evsesService.getByEvseId({ evseId });
        primaryIdToEvseIdMap[primaryId] = evseId;
        locationIdsUids.push(primaryId);
      } catch (err) {
        if (firstErrorOccured === null) {
          firstErrorOccured = err;
        }
      }
    }

    let predictions = [];

    try {
      predictions = await this.getEvsePredictionsByLocationIdsUids(locationIdsUids, project, timeframe);
    } catch (err) {
      if (firstErrorOccured === null) {
        firstErrorOccured = err;
      }
    }

    if (predictions.length < 1 && firstErrorOccured !== null) {
      throw firstErrorOccured;
    }

    return predictions.map(prediction => ({
      ...prediction,
      evseId: primaryIdToEvseIdMap[`${prediction.locationId}_${prediction.uid}`],
    }));
  }

  async getLocationsPredictions(
    locationIds: string[],
    project: ToolkitProject,
    timeframe?: number
  ): Promise<ChargingStationPrediction[]> {
    let firstErrorOccured = null;
    const predictions: ChargingStationPrediction[] = [];
    const locationId2QueryIdMap = {};

    for (const locationId of locationIds) {
      try {
        const location = await this.locationsService.getById(locationId);
        locationId2QueryIdMap[location.id] = locationId;
        const locationIdsUids = location.evses.map(({ uid }) => `${location.id}_${uid}`);
        const evses = await this.getEvsePredictionsByLocationIdsUids(locationIdsUids, project, timeframe);

        predictions.push(
          new ChargingStationPrediction({
            id: locationId2QueryIdMap[location.id],
            evses,
          }),
        );
      } catch (err) {
        if (firstErrorOccured === null) {
          firstErrorOccured = err;
        }
      }
    }

    if (predictions.length < 1 && firstErrorOccured !== null) {
      throw firstErrorOccured;
    }

    return predictions;
  }
}
