import { getHighwayName } from './highway-search-utils.service';

describe('HighwaySearchUtilsService', () => {
  describe('getHighwayName', () => {
    it('should return the highway name from the address', () => {
      expect(getHighwayName('A9 Köschinger Forst')).toEqual('A9');
      expect(getHighwayName('A23 Köschinger Forst')).toEqual('A23');
    });
  });
});
