import { expectedOutputToIdentifiedFilters } from './help-agent-test-utils';

describe('Recommendation Help Agent Test Utils', () => {
  describe('expectedOutputToIdentifiedFilters', () => {
    it('should return undefined if no identified filters', () => {
      expect(
        expectedOutputToIdentifiedFilters({
          cat1: null,
          cat7: null,
          cat8: null,
          address: null,
          addressSubcomponent: null,
        })
      ).toBeUndefined();

      expect(expectedOutputToIdentifiedFilters(undefined)).toBeUndefined();

      expect(expectedOutputToIdentifiedFilters({})).toBeUndefined();
    });
  });
});
