import { ApiToken } from './api-token';

describe('ApiToken', () => {
  test('value contain api token', () => {
    const token = 'dummytoken';
    expect(ApiToken.create({ token }).value).toEqual(token);
  });

  test('exception is thrown ', () => {
    expect(() => ApiToken.create({ token: null as any })).toThrow();
    expect(() => ApiToken.create({ token: '' })).toThrow();
    expect(() => ApiToken.create({ token: undefined as any})).toThrow();
  });
});
