import { Location } from '../../models/prompt';
import { labelRecommendedChargingStations } from './charging-stations-label.service';
const locations: Location[] = [
  {
    locationId: 'DE-CHC-DEBSWE604125125A',
    distance: 417.81801017129476,
    link: 'https://www.google.com/maps/search/?api=1&query=52.526205,13.407276',
    lat: 52.526205,
    lng: 13.407276,
    powerType: 'AC',
    probability: 0,
    powerKw: 22,
    connectorTypes: ['IEC_62196_T2'],
    operatorName: 'IONITY',
  },
  {
    locationId: 'DE-CHC-DEBSWE604106106A',
    distance: 529.2198489568368,
    link: 'https://www.google.com/maps/search/?api=1&query=52.518791,13.413188',
    lat: 52.518732,
    lng: 13.413188,
    powerType: 'AC',
    probability: 0,
    powerKw: 22,
    connectorTypes: ['IEC_62196_T2'],
    operatorName: 'IONITY',
  },
  {
    locationId: 'DE-CHC-DEBSWE604107107',
    distance: 529.2198489568368,
    link: 'https://www.google.com/maps/search/?api=1&query=52.518791,13.413188',
    lat: 52.518791,
    lng: 13.413188,
    powerType: 'AC',
    probability: 0,
    powerKw: 22,
    connectorTypes: ['IEC_62196_T2'],
    operatorName: 'IONITY',
  },
];

describe('labelRecommendedChargingStations', () => {
  describe('request with min 30kw power value and AC/DC power type', () => {
    it('should return 1 location with fastest label', () => {
      const payload = {
        locations: [
          {
            ...locations[0],
            powerKw: 50,
            powerType: 'DC',
            recommendation: undefined,
            score: 0,
          },
          {
            ...locations[1],
            powerKw: 30,
            powerType: 'DC',
            recommendation: undefined,
            score: 0,
          },
          {
            ...locations[2],
            powerKw: 35,
            powerType: 'DC',
            recommendation: undefined,
            score: 0,
          },
        ],
        language: 'en',
        powerType: 'both',
        minPower: 30,
        maxPower: 500,
        featureFlags: {
          chargegpt_recommendations_power_type_fallback: false,
        },
      };

      const locationsWithLabel = labelRecommendedChargingStations(payload);

      expect(locationsWithLabel[0].recommendation).toBe('Fastest');
      expect(locationsWithLabel[1].recommendation).toBeUndefined();
      expect(locationsWithLabel[2].recommendation).toBeUndefined();
    });
  });
});
