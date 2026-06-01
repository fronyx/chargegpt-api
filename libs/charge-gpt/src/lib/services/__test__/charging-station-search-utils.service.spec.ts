import { applyDateTimeOffset } from '../search-charging-stations-service/charging-station-search.service';

describe('applyDateTimeOffset', () => {
    const ExpectedErrorMessage = 'Invalid timezone offset';

    describe('invalid offset value', () => {
        it('should throw an error', () => {
            expect(() => applyDateTimeOffset(new Date('2021-01-01T00:00:00Z'), Number('invalid'))).toThrowError(ExpectedErrorMessage);
            expect(() => applyDateTimeOffset(new Date('2021-01-01T00:00:00Z'), Number(undefined))).toThrowError(ExpectedErrorMessage);
        })
    });

    describe('valid offset value', () => {
        it('should not throw an error', () => {
            expect(() => applyDateTimeOffset(new Date('2021-01-01T00:00:00Z'), Number(null))).not.toThrowError(ExpectedErrorMessage);
            expect(() => applyDateTimeOffset(new Date('2021-01-01T00:00:00Z'), Number(''))).not.toThrowError(ExpectedErrorMessage);
            expect(() => applyDateTimeOffset(new Date('2021-01-01T00:00:00Z'), Number(120))).not.toThrowError(ExpectedErrorMessage);
        });
    });
});