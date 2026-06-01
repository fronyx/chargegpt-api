import { EvseUIDValue } from './evse-uid-value';


describe('EvseUIDValue', () => {
  test('contain uid value', () => {
    const uid = 'dummyuid';
    const value = EvseUIDValue.create({ uid }).value;
    expect(value).toEqual(`${EvseUIDValue.prefix}${uid}`);
  });

  test('throw exception if empty uid', () => {
    expect(() => EvseUIDValue.create({ uid: null as any })).toThrow();
    expect(() => EvseUIDValue.create({ uid: '' })).toThrow();
    expect(() => EvseUIDValue.create({ uid: undefined as any })).toThrow();
  });
});
