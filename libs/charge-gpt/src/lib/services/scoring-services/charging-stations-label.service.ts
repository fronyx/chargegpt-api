import {
  FasterOptionLocation,
  FastestLocation,
  MostAvailableLocation,
  NearestLocation,
  SlowerOptionlocation,
} from '../../../../../../apps/cdk-apps/src/shared/models/general/chargegpt-translation';
import { TranslationsService } from '@fronyx/translations';
import {
  getIdsForLocationsToBeLabelled,
} from './recommendations-utils.functions';
import { ChargingStationWithScoreDetails } from '../../models/charging-stations.model';

interface LabelRecommenedChargingStationsArguments {
  locations: ChargingStationWithScoreDetails[];
  language: string;
  powerType: string;
  minPower: number;
  maxPower: number;
}

export const labelRecommendedChargingStations = (
  args: LabelRecommenedChargingStationsArguments
): ChargingStationWithScoreDetails[] => {
  if (args.locations.length < 1) return [];

  const locationsLabel = getIdsForLocationsToBeLabelled(args.locations);

  const translation = new TranslationsService(args.language.toLowerCase());
  translation.setAsset('NearestLocation', NearestLocation);
  translation.setAsset('FastestLocation', FastestLocation);
  translation.setAsset('MostAvailableLocation', MostAvailableLocation);
  translation.setAsset('SlowerOptionLocation', SlowerOptionlocation);
  translation.setAsset('FasterOptionLocation', FasterOptionLocation);

  const labelledChargingStations = args.locations.map((chargingStation) => {
    if (locationsLabel.isNearest === chargingStation.locationId) {
      chargingStation.recommendation = translation.get('NearestLocation');
    }

    if (locationsLabel.isFastest === chargingStation.locationId) {
      chargingStation.recommendation = translation.get('FastestLocation');
    }

    if (locationsLabel.isMostAvailable === chargingStation.locationId) {
      chargingStation.recommendation = translation.get('MostAvailableLocation');
    }

    return chargingStation;
  });

  if (
    args.powerType !== 'both' &&
    args.powerType !== undefined &&
    ((args.minPower === undefined && args.maxPower === undefined) ||
      (args.minPower === null && args.maxPower === null))
  ) {
    const locationsWithDesiredPowerType = labelledChargingStations.filter(
      (location) =>
        location.powerType.toLowerCase() === args.powerType.toLowerCase()
    );

    const fallbackLocations = labelledChargingStations
      .filter(
        (location) =>
          location.powerType.toLowerCase() !== args.powerType.toLowerCase()
      )
      .map((location) => {
        if (args.powerType.toLowerCase() === 'dc') {
          location.recommendation = translation.get('SlowerOptionLocation');
        } else {
          location.recommendation = translation.get('FasterOptionLocation');
        }

        return location;
      });

    return locationsWithDesiredPowerType.concat(fallbackLocations);
  }

  if (
    args.minPower !== null &&
    args.maxPower !== null &&
    args.minPower !== undefined &&
    args.maxPower !== undefined
  ) {
    const locationsWithDesiredPowerKw = labelledChargingStations.filter(
      (location) =>
        location.powerKw >= args.minPower && location.powerKw <= args.maxPower
    );

    const slowerFallbackOptions = labelledChargingStations
      .filter((location) => location.powerKw < args.minPower)
      .map((location) => {
        location.recommendation = translation.get('SlowerOptionLocation');

        return location;
      });
    const fasterFallbackOptions = labelledChargingStations
      .filter((location) => location.powerKw > args.maxPower)
      .map((location) => {
        location.recommendation = translation.get('FasterOptionLocation');

        return location;
      });
    return locationsWithDesiredPowerKw
      .concat(fasterFallbackOptions)
      .concat(slowerFallbackOptions);
  }

  if (args.powerType === 'both') {
    return labelledChargingStations;
  }

  throw new Error('Recommendation logic not implemented for this case.');
};
