import { EvsesValue } from './evses.value';
import { EvseFactory } from '../../../../utils/test/evse.factory';

describe('EvsesValue', () => {
  test('filter evse with missing required property', () => {
    EvsesValue.requiredProperties.forEach(property => {
      const evses = [EvseFactory.omit({ property })];
      const results = EvsesValue.create({ evses }).value;
      expect(results.length).toEqual(0);
    });
  });

  test('filter evse with no valid connector', () => {
    const evse = EvseFactory.omit({ property: 'connectors' });
    evse.connectors = [];
    const evses = [evse];
    const results = EvsesValue.create({ evses }).value;
    expect(results.length).toEqual(0);
  });

  test('return valid evses with all required properties', () => {
    const results = EvsesValue.create({ evses: [EvseFactory.omit({ property: null as any }), EvseFactory.omit({ property: null as any }), EvseFactory.omit({ property: null as any })] }).value;
    expect(results.length).toEqual(3);
  });
});
