import { LocationIDValue } from './location-id-value';

describe('LocationIDValue', () => {
  test('contain id value', () => {
    const id = 'dummyid';
    const value = LocationIDValue.create({ id }).value;
    expect(value).toEqual(`${LocationIDValue.prefix}${id}`);
  });

  test('throw exception if empty uid', () => {
    expect(() => LocationIDValue.create({ id: null as any })).toThrow();
    expect(() => LocationIDValue.create({ id: '' })).toThrow();
    expect(() => LocationIDValue.create({ id: undefined as any })).toThrow();
  });
});
