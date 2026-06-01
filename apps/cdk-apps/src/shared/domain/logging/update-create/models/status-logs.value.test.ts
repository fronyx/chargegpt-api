import { StatusLogsValue } from './status-logs.value';
import { OcpiLocationFactory } from '../../../../utils/test/ocpi-location.factory';

describe('StatusLogsValue', () => {
  test('filter invalid logs', () => {
    const location = { ocpi: OcpiLocationFactory.omit({ property: 'city' }) };
    expect(StatusLogsValue.createFromOcpiLocation({ location }).value.length).toEqual(0);
  });

  test('return all valid logs', () => {
    const location = { ocpi: OcpiLocationFactory.omit({ property: null }) };
    expect(StatusLogsValue.createFromOcpiLocation({ location }).value.length).toEqual(1);
  });
});
