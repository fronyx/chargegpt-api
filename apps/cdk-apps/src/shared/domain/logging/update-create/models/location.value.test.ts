import { LocationFactory } from '../../../../utils/test/location.factory';
import { LocationValue } from './location.value';


describe('LocationValue', () => {
  test('filter location with missing required property', () => {
    LocationValue.requiredProperties.forEach(property => {
      const location = [LocationFactory.omit({ property })];
      const results = LocationValue.create({ location }).value;
      expect(results).toBeNull();
    });
  });

  test('filter location with no valid evse', () => {
    const location = LocationFactory.omit({ property: 'evses' });
    location.evses = [];
    const result = LocationValue.create({ location }).value;
    expect(result).toBeNull();
  });

  test('return valid location with all required properties', () => {
    const result = LocationValue.create({ location: LocationFactory.omit({ property: null as any }) });
    expect(result).not.toBeNull();
  });
});
