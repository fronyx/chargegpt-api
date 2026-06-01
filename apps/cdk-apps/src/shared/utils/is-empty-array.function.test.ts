import { isEmptyArray } from './is-empty-array.function';

describe('isEmptyArray', () => {
  test('true if array is null',  () => {
    expect(isEmptyArray(null as any)).toBeTruthy();
  });

  test('true if array is empty',  () => {
    expect(isEmptyArray([])).toBeTruthy();
  });

  test('true if string undefined',  () => {
    expect(isEmptyArray(undefined)).toBeTruthy();
  });

  test('false if string has value',  () => {
    expect(isEmptyArray(['foo'])).toBeFalsy();
  });
});
