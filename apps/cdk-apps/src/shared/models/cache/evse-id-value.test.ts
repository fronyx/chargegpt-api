import { EvseIDValue } from './evse-id-value';

describe('EvseIDValue', () => {
  test('contain evse id value', () => {
    const evseId = '1234';
    expect(EvseIDValue.create({ value: evseId }).value).toEqual(`${EvseIDValue.prefix}${evseId}`);
  });

  test('null converted to empty string', () => {
    const evseId: any = null;
    expect(EvseIDValue.create({ value: evseId }).value).toEqual(EvseIDValue.prefix);
  });
});
