import { isDestinationEqual, parseUnconfirmedAddresses, replaceWithSpace, splitAndSort } from './address-identifier-helper.utils';

describe('replaceWithSpace', () => {
    it('should replace all occurrences of a symbol with a space', () => {
        expect(replaceWithSpace('.', 'something str. 16')).toBe('something str 16');
        expect(replaceWithSpace(',', 'Berlin, hbf')).toBe('Berlin hbf');
        expect(replaceWithSpace('-', 'Berlin-hbf')).toBe('Berlin hbf');
    });
});

describe('splitAndSort', () => {
    it('should split by space and sort the array', () => {
        expect(splitAndSort('something str 16')).toEqual(['16', 'something', 'str']);
        expect(splitAndSort('Berlin hbf')).toEqual(['Berlin', 'hbf']);
    });
});

describe('parseUnconfirmedAddresses', () => {
    it('should parse unconfirmed addresses into comparable string', () => {
        expect(parseUnconfirmedAddresses('Berlin-hbf')).toBe('berlin||hbf');
        expect(parseUnconfirmedAddresses('Berlin, hbf')).toBe('berlin||hbf');
        expect(parseUnconfirmedAddresses('something str. 16')).toBe('16||something||str');
        expect(parseUnconfirmedAddresses('Berlin, {city}')).toBe('berlin||{city}');
        expect(parseUnconfirmedAddresses('Restaurante Lisboa - Noite, Lisbon')).toBe('lisboa||lisbon||noite||restaurante');
        expect(parseUnconfirmedAddresses('Boavista avenue')).toBe('avenue||boavista');
        expect(parseUnconfirmedAddresses('Boavista Avenue')).toBe('avenue||boavista');
        expect(parseUnconfirmedAddresses('Mcdonald\'s')).toBe('mcdonalds');
        expect(parseUnconfirmedAddresses('~Euref~')).toBe('euref');
    });

    it('should return null if no addresses are provided', () => {
        expect(parseUnconfirmedAddresses('')).toBeNull();
        expect(parseUnconfirmedAddresses(null)).toBeNull();
        expect(parseUnconfirmedAddresses(undefined)).toBeNull();
    });
});

describe('isDestinationEqual', () => {
    it('should compare destination string according to test manager formatting', () => {
        expect(isDestinationEqual('~Euref campus~', 'campus||euref', 'berlin||campus||euref')).toBeTruthy();
    });
});