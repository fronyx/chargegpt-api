import { isEmptyString } from './is-empty-string.function';

describe('isEmptyString', () => {
  test('true if string null',  () => {
    expect(isEmptyString(null as any)).toBeTruthy();
  });

  test('true if string empty',  () => {
    expect(isEmptyString('')).toBeTruthy();
  });

  test('true if string undefined',  () => {
    expect(isEmptyString(undefined)).toBeTruthy();
  });

  test('false if string has value',  () => {
    expect(isEmptyString('iqwo-92391-oasoakd')).toBeFalsy();
  });
});
