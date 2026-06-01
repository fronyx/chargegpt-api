import { isRightOfLine } from './route-search.service';

describe('route-search.service', () => {
  describe('isRightOfLine', () => {
    it('should return if a point is right of the line', () => {
      expect(
        isRightOfLine(
          {
            a: {
              lat: 50.274353,
              lng: 10.955456,
            },
            b: {
              lat: 50.25965,
              lng: 10.957259,
            },
          },
          {
            lat: 50.267057,
            lng: 10.95065,
          }
        )
      ).toBeTruthy();

      expect(
        isRightOfLine(
          {
            a: {
              lat: 50.25965,
              lng: 10.957259,
            },
            b: {
              lat: 50.274353,
              lng: 10.955456,
            },
          },
          {
            lat: 50.278193,
            lng: 10.963782,
          }
        )
      ).toBeTruthy();

      expect(
        isRightOfLine(
          {
            a: {
              lat: 50.308522,
              lng: 11.027034,
            },
            b: {
              lat: 50.305342,
              lng: 11.045574,
            },
          },
          {
            lat: 50.304684,
            lng: 11.036218,
          }
        )
      ).toBeTruthy();

      expect(
        isRightOfLine(
          {
            a: {
              lat: 50.305342,
              lng: 11.045574,
            },
            b: {
              lat: 50.308522,
              lng: 11.027034,
            },
          },
          {
            lat: 50.309125,
            lng: 11.040767,
          }
        )
      ).toBeTruthy();

      expect(
        isRightOfLine(
          {
            a: {
              lat: 50.305342,
              lng: 11.050294,
            },
            b: {
              lat: 50.308467,
              lng: 11.027206,
            },
          },
          {
            lat: 50.308522,
            lng: 11.035446,
          }
        )
      ).toBeTruthy();

      expect(
        isRightOfLine(
          {
            a: {
              lat: 51.50175,
              lng: 6.99651,
            },
            b: {
              lat: 51.51926,
              lng: 7.06557,
            },
          },
          {
            lat: 51.503688,
            lng: 7.008918,
          }
        )
      ).toBeTruthy();

      
      
      expect(
        isRightOfLine(
          {
            a: {
              lat: 50.305342,
              lng: 11.050294,
            },
            b: {
              lat: 50.308467,
              lng: 11.027206,
            },
          },
          {
            lat: 50.306787,
            lng: 11.034997,
          }
        )
      ).toBeFalsy();
    });
  });
});
