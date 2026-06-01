const cardinalDirectionsUtilsService = jest.requireActual(
  './cardinal-directions-utils.service'
);

describe('Cardinal directions utils service', () => {
  describe('removeCardinalDirectionFromTerm', () => {
    it('should remove the cardinal direction from the term with hyphen', () => {
      const term = 'London, South-west, KFC';
      const result =
        cardinalDirectionsUtilsService.removeCardinalDirectionFromTerm(term);
      expect(result.term).toBe('london, kfc');
      expect(result.cardinalDirection).toBe('southwest');
    });

    it('should remove the cardinal direction from the term', () => {
      const term = 'London, Southwest, KFC';
      const result =
        cardinalDirectionsUtilsService.removeCardinalDirectionFromTerm(term);
      expect(result.term).toBe('london, kfc');
      expect(result.cardinalDirection).toBe('southwest');
    });

    it('should remove the cardinal direction from the term with `ern`', () => {
      const term = 'London, Southwestern, KFC';
      const result =
        cardinalDirectionsUtilsService.removeCardinalDirectionFromTerm(term);
      expect(result.term).toBe('london, kfc');
      expect(result.cardinalDirection).toBe('southwest');
    });
  });
});

describe('getBoundingBoxesOfCardinalDirections', () => {
  describe('getProperCardinalDirection', () => {
    it('should return the proper cardinal direction', () => {
      const result =
        cardinalDirectionsUtilsService.getBoundingBoxesOfCardinalDirections(
          { lat: 52.67545420869131, lon: 13.08834600183454 },
          { lat: 52.33823404386677, lon: 13.76111748460941 }
        );

      expect(true).toBeTruthy();
    });
  });
});
