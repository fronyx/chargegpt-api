import { OcpiLocationEvseListKey } from './ocpi-location-evse-list-key';

describe('OcpiLocationEvseListKey', () => {
  test('throw error for invalid location id', () => {
    expect(() => OcpiLocationEvseListKey.create({ locationId: null as any })).toThrow();
    expect(() => OcpiLocationEvseListKey.create({ locationId: undefined as any })).toThrow();
    expect(() => OcpiLocationEvseListKey.create({ locationId: '' })).toThrow();
  });

  test('return correct key for valid location id', () => {
    const locationId = '123456';
    const key = OcpiLocationEvseListKey.create({ locationId });
    const keyValue = `${OcpiLocationEvseListKey.keyPrefix}${locationId}${OcpiLocationEvseListKey.keySuffix}`;
    expect(key.value).toEqual(keyValue);
  });
});
