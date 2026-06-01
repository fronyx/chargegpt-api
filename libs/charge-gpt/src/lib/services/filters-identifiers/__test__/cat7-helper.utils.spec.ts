import { getValidOperatorName } from '../request-identifier-cat7.service';
import {
    dayNameToNumber,
  getDateFromCalendarWeek,
  getNextCalendarWeek,
  isTimeWithin15Mins,
  translateResponseDateTimeToExpectedTime,
} from './cat7-helper.utils';

describe('getValidOperatorName', () => {
  it('should return identified value', () => {
    expect(getValidOperatorName('allego')).toBe('allego');
    expect(getValidOperatorName('ionity')).toBe('ionity');
    expect(getValidOperatorName('null')).toBe(undefined);
    expect(getValidOperatorName(undefined)).toBe(undefined);
    expect(getValidOperatorName(null)).toBe(undefined);
    expect(getValidOperatorName('Setubal')).toBe(undefined);
    expect(getValidOperatorName('Stadtwerke München')).toBe(
      'Stadtwerke München'
    );
  });
});

describe('translateResponseDateTimeToExpectedTime', () => {
  it('should throw error if unexpected format is provided', () => {
    const currentTimestamp = 1717590617360;
    expect(() =>
      translateResponseDateTimeToExpectedTime('12:00', currentTimestamp)
    ).toThrowError();
    expect(() =>
      translateResponseDateTimeToExpectedTime('null', currentTimestamp)
    ).toThrowError();
    expect(() =>
      translateResponseDateTimeToExpectedTime(undefined, currentTimestamp)
    ).toThrowError();
    expect(() =>
      translateResponseDateTimeToExpectedTime(null, currentTimestamp)
    ).toThrowError();
    expect(() =>
      translateResponseDateTimeToExpectedTime('12:00 +1', currentTimestamp)
    ).not.toThrowError();
    expect(() =>
      translateResponseDateTimeToExpectedTime('+00:00', currentTimestamp)
    ).not.toThrowError();
  });

  it('should give exact time', () => {
    const currentTimestamp = 1717590617360;
    expect(
      translateResponseDateTimeToExpectedTime('12:00 +1', currentTimestamp)
    ).toBe('2024-06-06 12:00:00');
    expect(
      translateResponseDateTimeToExpectedTime('12:00 +0', currentTimestamp)
    ).toBe('2024-06-05 12:00:00');
    expect(
      translateResponseDateTimeToExpectedTime('23:00 +5', currentTimestamp)
    ).toBe('2024-06-10 23:00:00');
  });

  it('should add duration from current time stamp', () => {
    const currentTimestamp = 1717590617360; // 2024-06-05 14:30:17
    expect(
      translateResponseDateTimeToExpectedTime('+00:30', currentTimestamp)
    ).toBe('2024-06-05 15:00:17');
    expect(
      translateResponseDateTimeToExpectedTime('+00:180', currentTimestamp)
    ).toBe('2024-06-05 17:30:17');
    expect(
      translateResponseDateTimeToExpectedTime('+00:00', currentTimestamp)
    ).toBe('2024-06-05 14:30:17');
  });

  it('should return correct date and time based on week count', () => {
    const expectedOutput = 'Friday +0 08:00';
    const expectedDate = '2024-08-09 08:00:00'; // Friday the current week from 2024-08-05
    const currentTimestamp = new Date(2024, 7, 5).getTime();
    expect(
      translateResponseDateTimeToExpectedTime(expectedOutput, currentTimestamp)
    ).toBe(expectedDate);
  });
});

describe('isTimeWithin15Mins', () => {
  it('should return false if expectedString or receivedString is not provided', () => {
    expect(isTimeWithin15Mins(undefined, '2024-06-05 14:30:17')).toBeFalsy();
    expect(isTimeWithin15Mins('2024-06-05 14:30:17', undefined)).toBeFalsy();
    expect(isTimeWithin15Mins(undefined, undefined)).toBeFalsy();
    expect(isTimeWithin15Mins(null, undefined)).toBeFalsy();
  });

  it('should return true if difference is less than 15 minutes', () => {
    expect(
      isTimeWithin15Mins('2024-06-05 14:30:17', '2024-06-05 14:30:17')
    ).toBeTruthy();
    expect(
      isTimeWithin15Mins('2024-06-05 14:30:17', '2024-06-05 14:45:17')
    ).toBeTruthy();
    expect(
      isTimeWithin15Mins('2024-06-05 14:30:17', '2024-06-05 14:31:17')
    ).toBeTruthy();
    expect(
      isTimeWithin15Mins('2024-06-05 14:31:17', '2024-06-05 14:30:17')
    ).toBeTruthy();
  });
});

describe('getDateFromCalendarWeek', () => {
  it('should return the correct next week date', () => {
    const expectedDate = new Date(2024, 7, 16); // Friday the next week from 2024-08-05
    const currentTimestamp = new Date(2024, 7, 5).getTime();
    expect(
      getDateFromCalendarWeek(
        getNextCalendarWeek(1, currentTimestamp),
        dayNameToNumber('friday'),
        currentTimestamp
      )
    ).toEqual(expectedDate);
  });

  it('should return the correct next week date', () => {
    const expectedDate = new Date(2024, 7, 9); // Friday the current week from 2024-08-05
    const currentTimestamp = new Date(2024, 7, 5).getTime();
    expect(
      getDateFromCalendarWeek(
        getNextCalendarWeek(0, currentTimestamp),
        dayNameToNumber('friday'),
        currentTimestamp
      )
    ).toEqual(expectedDate);
  });
});
