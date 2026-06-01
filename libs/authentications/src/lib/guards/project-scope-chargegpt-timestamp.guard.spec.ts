import { isDateWithinRange } from './project-scope-chargegpt-timestamp.guard';

describe('isDateWithinRange', () => {
  it('should check for date within range', () => {
    expect(isDateWithinRange(String(Date.now() + (10 * 60 * 1000)))).toBe(true);
    expect(isDateWithinRange(String(Date.now() - (10 * 60 * 1000)))).toBe(true);
    expect(isDateWithinRange(String(Date.now() - (15 * 60 * 1000)))).toBe(true);
    expect(isDateWithinRange(String(Date.now() + (15 * 60 * 1000)))).toBe(true);
    expect(isDateWithinRange(String(Date.now() + (20 * 60 * 1000)))).toBe(false);
    expect(isDateWithinRange(String(Date.now() - (20 * 60 * 1000)))).toBe(false);
    expect(isDateWithinRange(String(Date.now()))).toBe(true);
  });
});