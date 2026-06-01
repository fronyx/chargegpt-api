import { labelAndScoreRecommendedChargingStations } from './recommendations-type.functions';
import { Location } from '../../models/prompt';

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

describe('enrichLocationsWithRecommendationType', () => {
  describe('request with exact kw power value and power type is both', () => {
    describe('all location is a fallback locations', () => {
      it('should return all locations with slower options label', () => {
        const payload = {
          locations,
          language: 'en',
          powerType: 'both',
          minPower: 30,
          maxPower: 30,
          featureFlags: {
            chargegpt_recommendations_power_type_fallback: true,
          },
        };

        const locationsWithLabel =
          labelAndScoreRecommendedChargingStations(payload);

        expect(locationsWithLabel[0].recommendation).toBe('Slower option');
        expect(locationsWithLabel[1].recommendation).toBe('Slower option');
        expect(locationsWithLabel[2].recommendation).toBe('Slower option');
      });
    });

    describe('not all location is a fallback locations', () => {
      it('should return all locations with nearest and slower options label', () => {
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
              recommendation: undefined,
              score: 0,
            },
          ],
          language: 'en',
          powerType: 'both',
          minPower: 30,
          maxPower: 30,
          featureFlags: {
            chargegpt_recommendations_power_type_fallback: true,
          },
        };

        const locationsWithLabel =
          labelAndScoreRecommendedChargingStations(payload);

        expect(locationsWithLabel[0].recommendation).toBe(undefined);
        expect(locationsWithLabel[1].recommendation).toBe('Faster option');
        expect(locationsWithLabel[2].recommendation).toBe('Slower option');
      });
    });
  });

  describe('min 50kW and max 100kW power value and power type is both', () => {
    describe('all location is a fallback locations', () => {
      it('should return all locations with slower options label', () => {
        const payload = {
          locations: [
            {
              ...locations[0],
              recommendation: undefined,
              score: 0,
            },
            {
              ...locations[1],
              recommendation: undefined,
              score: 0,
            },
            {
              ...locations[2],
              recommendation: undefined,
              score: 0,
            },
          ],
          language: 'en',
          powerType: 'both',
          minPower: 50,
          maxPower: 100,
          featureFlags: {
            chargegpt_recommendations_power_type_fallback: true,
          },
        };

        const locationsWithLabel =
          labelAndScoreRecommendedChargingStations(payload);

        expect(locationsWithLabel[0].recommendation).toBe('Slower option');
        expect(locationsWithLabel[1].recommendation).toBe('Slower option');
        expect(locationsWithLabel[2].recommendation).toBe('Slower option');
      });
    });

    describe('not all location is a fallback locations', () => {
      it('should return all locations with fastest and slower option', () => {
        const payload = {
          locations: [
            {
              ...locations[0],
              powerKw: 70,
              powerType: 'DC',
              recommendation: undefined,
              score: 0,
            },
            {
              ...locations[1],
              recommendation: undefined,
              score: 0,
            },
            {
              ...locations[2],
              recommendation: undefined,
              score: 0,
            },
          ],
          language: 'en',
          powerType: 'both',
          minPower: 50,
          maxPower: 100,
          featureFlags: {
            chargegpt_recommendations_power_type_fallback: true,
          },
        };

        const locationsWithLabel =
          labelAndScoreRecommendedChargingStations(payload);

        expect(locationsWithLabel[0].recommendation).toBe('Fastest');
        expect(locationsWithLabel[1].recommendation).toBe('Slower option');
        expect(locationsWithLabel[2].recommendation).toBe('Slower option');
      });
    });
  });

  describe('min 50kW and max 100kW power value and power type is DC', () => {
    describe('all location is a fallback locations', () => {
      it('should return all locations with slower options label', () => {
        const payload = {
          locations: [
            {
              ...locations[0],
              recommendation: undefined,
              score: 0,
            },
            {
              ...locations[1],
              recommendation: undefined,
              score: 0,
            },
            {
              ...locations[2],
              recommendation: undefined,
              score: 0,
            },
          ],
          language: 'en',
          powerType: 'DC',
          minPower: 50,
          maxPower: 100,
          featureFlags: {
            chargegpt_recommendations_power_type_fallback: true,
          },
        };

        const locationsWithLabel =
          labelAndScoreRecommendedChargingStations(payload);

        expect(locationsWithLabel[0].recommendation).toBe('Slower option');
        expect(locationsWithLabel[1].recommendation).toBe('Slower option');
        expect(locationsWithLabel[2].recommendation).toBe('Slower option');
      });
    });

    describe('not all location is a fallback locations', () => {
      it('should return all locations with fastest and slower option', () => {
        const payload = {
          locations: [
            {
              ...locations[0],
              powerType: 'DC',
              powerKw: 70,
              recommendation: undefined,
              score: 0,
            },
            {
              ...locations[1],
              recommendation: undefined,
              score: 0,
            },
            {
              ...locations[2],
              recommendation: undefined,
              score: 0,
            },
          ],
          language: 'en',
          powerType: 'DC',
          minPower: 50,
          maxPower: 100,
          featureFlags: {
            chargegpt_recommendations_power_type_fallback: true,
          },
        };

        const locationsWithLabel =
          labelAndScoreRecommendedChargingStations(payload);

        expect(locationsWithLabel[0].recommendation).toBe('Fastest');
        expect(locationsWithLabel[1].recommendation).toBe('Slower option');
        expect(locationsWithLabel[2].recommendation).toBe('Slower option');
      });
    });
  });

  describe('min 50kW and max 100kW power value and power type is AC', () => {
    describe('all location is a fallback locations', () => {
      it('should return all locations with slower options label', () => {
        const payload = {
          locations: [
            {
              ...locations[0],
              recommendation: undefined,
              score: 0,
            },
            {
              ...locations[1],
              recommendation: undefined,
              score: 0,
            },
            {
              ...locations[2],
              recommendation: undefined,
              score: 0,
            },
          ],
          language: 'en',
          powerType: 'AC',
          minPower: 50,
          maxPower: 100,
          featureFlags: {
            chargegpt_recommendations_power_type_fallback: true,
          },
        };

        const locationsWithLabel =
          labelAndScoreRecommendedChargingStations(payload);

        expect(locationsWithLabel[0].recommendation).toBe('Slower option');
        expect(locationsWithLabel[1].recommendation).toBe('Slower option');
        expect(locationsWithLabel[2].recommendation).toBe('Slower option');
      });
    });

    describe('not all location is a fallback locations', () => {
      it('should return all locations with fastest and slower option', () => {
        const payload = {
          locations: [
            {
              ...locations[0],
              powerType: 'DC',
              powerKw: 70,
              recommendation: undefined,
              score: 0,
            },
            {
              ...locations[1],
              recommendation: undefined,
              score: 0,
            },
            {
              ...locations[2],
              recommendation: undefined,
              score: 0,
            },
          ],
          language: 'en',
          powerType: 'AC',
          minPower: 50,
          maxPower: 100,
          featureFlags: {
            chargegpt_recommendations_power_type_fallback: true,
          },
        };

        const locationsWithLabel =
          labelAndScoreRecommendedChargingStations(payload);

        expect(locationsWithLabel[0].recommendation).toBe('Fastest');
        expect(locationsWithLabel[1].recommendation).toBe('Slower option');
        expect(locationsWithLabel[2].recommendation).toBe('Slower option');
      });
    });
  });

  describe('min 0kW and max 20kW power value and power type is AC', () => {
    describe('all location is a fallback locations', () => {
      it('should return all locations with faster options label', () => {
        const payload = {
          locations: [
            {
              ...locations[0],
              recommendation: undefined,
              score: 0,
            },
            {
              ...locations[1],
              recommendation: undefined,
              score: 0,
            },
            {
              ...locations[2],
              recommendation: undefined,
              score: 0,
            },
          ],
          language: 'en',
          powerType: 'AC',
          minPower: 0,
          maxPower: 20,
          featureFlags: {
            chargegpt_recommendations_power_type_fallback: true,
          },
        };

        const locationsWithLabel =
          labelAndScoreRecommendedChargingStations(payload);

        expect(locationsWithLabel[0].recommendation).toBe('Faster option');
        expect(locationsWithLabel[1].recommendation).toBe('Faster option');
        expect(locationsWithLabel[2].recommendation).toBe('Faster option');
      });
    });

    describe('not all location is a fallback locations', () => {
      it('should return all locations with fastest and faster option', () => {
        const payload = {
          locations: [
            {
              ...locations[0],
              powerType: 'AC',
              powerKw: 20,
              recommendation: undefined,
              score: 0,
            },
            {
              ...locations[1],
              recommendation: undefined,
              score: 0,
            },
            {
              ...locations[2],
              recommendation: undefined,
              score: 0,
            },
          ],
          language: 'en',
          powerType: 'AC',
          minPower: 0,
          maxPower: 20,
          featureFlags: {
            chargegpt_recommendations_power_type_fallback: true,
          },
        };

        const locationsWithLabel =
          labelAndScoreRecommendedChargingStations(payload);

        expect(locationsWithLabel[0].recommendation).toBe('Nearest');
        expect(locationsWithLabel[1].recommendation).toBe('Faster option');
        expect(locationsWithLabel[2].recommendation).toBe('Faster option');
      });
    });
  });

  describe('no power value and power type is both', () => {
    it('should return only nearest label', () => {
      const payload = {
        locations: [
          {
            ...locations[0],
            recommendation: undefined,
            score: 0,
          },
          {
            ...locations[1],
            recommendation: undefined,
            score: 0,
          },
          {
            ...locations[2],
            recommendation: undefined,
            score: 0,
          },
        ],
        language: 'en',
        powerType: 'both',
        minPower: undefined,
        maxPower: undefined,
        featureFlags: {
          chargegpt_recommendations_power_type_fallback: true,
        },
      };

      const labeledLocations = labelAndScoreRecommendedChargingStations(payload);

      expect(labeledLocations[0].recommendation).toBe('Nearest');
      expect(labeledLocations[1].recommendation).toBe(undefined);
      expect(labeledLocations[2].recommendation).toBe(undefined);
    });

    it('should return only fastest label', () => {
      const payload = {
        locations: [
          {
            ...locations[0],
            powerKw: 150,
            powerType: 'DC',
            recommendation: undefined,
            score: 0,
          },
          {
            ...locations[1],
            recommendation: undefined,
            score: 0,
          },
          {
            ...locations[2],
            recommendation: undefined,
            score: 0,
          },
        ],
        language: 'en',
        powerType: 'both',
        minPower: undefined,
        maxPower: undefined,
        featureFlags: {
          chargegpt_recommendations_power_type_fallback: true,
        },
      };

      const labeledLocations = labelAndScoreRecommendedChargingStations(payload);

      expect(labeledLocations[0].recommendation).toBe('Fastest');
      expect(labeledLocations[1].recommendation).toBe(undefined);
      expect(labeledLocations[2].recommendation).toBe(undefined);
    });
  });

  describe('no power value and power type is DC', () => {
    it('should return only nerest label', () => {
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
            recommendation: undefined,
            powerKw: 50,
            powerType: 'DC',
            score: 0,
          },
          {
            ...locations[2],
            powerKw: 50,
            powerType: 'DC',
            recommendation: undefined,
            score: 0,
          },
        ],
        language: 'en',
        powerType: 'DC',
        minPower: undefined,
        maxPower: undefined,
        featureFlags: {
          chargegpt_recommendations_power_type_fallback: true,
        },
      };

      const labeledLocations = labelAndScoreRecommendedChargingStations(payload);

      expect(labeledLocations[0].recommendation).toBe('Nearest');
      expect(labeledLocations[1].recommendation).toBe(undefined);
      expect(labeledLocations[2].recommendation).toBe(undefined);
    });

    it('should return only fastest label', () => {
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
            recommendation: undefined,
            powerKw: 49,
            powerType: 'DC',
            score: 0,
          },
          {
            ...locations[2],
            powerKw: 49,
            powerType: 'DC',
            recommendation: undefined,
            score: 0,
          },
        ],
        language: 'en',
        powerType: 'DC',
        minPower: undefined,
        maxPower: undefined,
        featureFlags: {
          chargegpt_recommendations_power_type_fallback: true,
        },
      };

      const labeledLocations = labelAndScoreRecommendedChargingStations(payload);

      expect(labeledLocations[0].recommendation).toBe('Fastest');
      expect(labeledLocations[1].recommendation).toBe(undefined);
      expect(labeledLocations[2].recommendation).toBe(undefined);
    });
  });
});
