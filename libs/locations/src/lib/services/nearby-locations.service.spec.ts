import { getOperatorName } from './nearby-locations.service';

const location = {
  id: 'DEALLL000265296',
  type: 'UNKNOWN',
  name: 'Berlin, Zionskirchstr. 67',
  address: 'Zionskirchstr. 67',
  city: 'Berlin',
  postal_code: '10119',
  country: 'DEU',
  coordinates: { latitude: '52.532926', longitude: '13.408241' },
  related_locations: [],
  evses: [
    {
      uid: 'DEALLEGO0019181',
      evse_id: 'DEALLEGO0019181',
      status: 'REMOVED',
      capabilities: [Array],
      connectors: [Array],
      coordinates: {},
      directions: [],
      parking_restrictions: [],
      images: [],
      last_updated: '2024-08-28T19:51:55.000Z',
    },
    {
      uid: 'DEALLEGO0019182',
      evse_id: 'DEALLEGO0019182',
      status: 'REMOVED',
      capabilities: [Array],
      connectors: [Array],
      coordinates: {},
      directions: [],
      parking_restrictions: [],
      images: [],
      last_updated: '2024-08-28T19:51:55.000Z',
    },
  ],
  directions: [],
  facilities: [],
  opening_times: {
    regular_hours: [],
    exceptional_openings: [],
    exceptional_closings: [],
  },
  charging_when_closed: false,
  images: [],
  operator: { name: 'Allego' },
  suboperator: { name: 'Allego (DE)' },
  owner: { name: 'Allego (DEU)' },
  last_updated: '2024-08-31T04:38:38.390Z',
};

describe('getOperatorName', () => {
  const locationWithoutOperator = {
    ...location,
    operator: {},
  };

  const locationWithoutOperatorAndSuboperator = {
    ...locationWithoutOperator,
    suboperator: {},
  };

  it('should return the operator name from operator.name', () => {
    const result = getOperatorName(location);
    expect(result).toBe('Allego');
  });

  it('it should return the suboperator name from suboperator.name', () => {
    const result = getOperatorName(locationWithoutOperator);
    expect(result).toBe('Allego (DE)');
  });

  it('it should return the owner name', () => {
    const result = getOperatorName(locationWithoutOperatorAndSuboperator);
    expect(result).toBe('Allego (DEU)');
  });

  it('it should return the empty string', () => {
    const locationWithoutOperatorSuboperatorAndOwner = {
      ...locationWithoutOperatorAndSuboperator,
      owner: {},
    };

    const result = getOperatorName(locationWithoutOperatorSuboperatorAndOwner);
    expect(result).toBe('');
  });
});
