import { ConnectorsValue } from './connectors.value';
import { ConnectorFactory } from '../../../../utils/test/connector.factory';

describe('ConnectorsValue', () => {
  test('filter connectors with missing required property', () => {
    ConnectorsValue.requiredProperties.forEach(property => {
      const connectors = [ConnectorFactory.omit({ property })];
      const results = ConnectorsValue.create({ connectors }).value;
      expect(results.length).toEqual(0);
    });
  });

  test('return connectors with required properties', () => {
    const results = ConnectorsValue.create({ connectors: [ConnectorFactory.omit({ property: null }), ConnectorFactory.omit({ property: null }), ConnectorFactory.omit({ property: null })] }).value;
    expect(results.length).toEqual(3);
  });
});
