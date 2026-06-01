const searchPoiService = jest.requireActual('./search-poi.service');
const cardinalDirectionUtilsService = jest.requireActual(
  './cardinal-directions-utils.service'
);

describe('Search POI utils service', () => {
  describe('removePoiNameFromTerm', () => {
    it('remove business name from search term', () => {
      const term = 'KFC, London';
      const businessName = 'KFC';
      const result = searchPoiService.removePoiNameFromTerm(term, businessName);
      expect(result).toEqual({
        businessName: 'kfc',
        term: 'london',
      });
    });

    it('remove poi name from search term', () => {
      const term = 'Museum Insel, Berlin';
      const businessName = 'Museum Insel';
      const result = searchPoiService.removePoiNameFromTerm(term, businessName);
      expect(result).toEqual({
        businessName: 'museum insel',
        term: 'berlin',
      });
    });

    it('return back search term when there is no poi', () => {
      const term = 'Coburg';
      const businessName = null;
      const result = searchPoiService.removePoiNameFromTerm(
        term,
        businessName as any
      );
      expect(result).toEqual({
        businessName: undefined,
        term: 'coburg',
      });
    });
  });

  describe('getLocationBias', () => {
    const positionMock = {
      lat: 52.52343,
      lng: 13.41144,
    };
    const candidateMock = {
      geometry: {
        location: positionMock,
        viewport: {
          northeast: {
            lat: 52.6754542,
            lng: 13.7611175,
          },
          southwest: {
            lat: 52.338234,
            lng: 13.088346,
          },
        },
      },
      place_id: 'ChIJAVkDPzdOqEcRcDteW0YgIQQ',
    };

    describe('request does not contain any cardinal direction', () => {
      it('should return coordinates from the address', async () => {
        const term = 'McDonalds, Berlin';
        const businessName = 'McDonalds';
        const searchFn = jest.fn(() => ({
          status: 200,
          data: {
            status: 'OK',
            candidates: [candidateMock],
          },
        }));
        const moveCardinalDirectionSpy = jest.spyOn(
          cardinalDirectionUtilsService,
          'movePointToCardinalDirection'
        );
        const apiClientSpy = jest
          .spyOn(searchPoiService, 'getExternalApiAddressClient')
          .mockReturnValueOnce({
            search: searchFn,
          });
        const result = await searchPoiService.getLocationBias(
          term,
          businessName
        );
        expect(apiClientSpy).toHaveBeenCalledWith('findplacefromtext');
        expect(searchFn).toHaveBeenCalledWith('berlin', null, null);
        expect(result).toEqual({
          lat: positionMock.lat,
          lng: positionMock.lng,
        });
        expect(moveCardinalDirectionSpy).not.toHaveBeenCalled();
      });
    });

    describe('request contains cardinal direction', () => {
      it('should return calculated coordinates according to the cardinal directions', async () => {
        const term = 'McDonalds, Berlin, South';
        const businessName = 'McDonalds';
        const searchFn = jest.fn(() => ({
          status: 200,
          data: {
            status: 'OK',
            candidates: [candidateMock],
          },
        }));
        const moveCardinalDirectionSpy = jest.spyOn(
          cardinalDirectionUtilsService,
          'movePointToCardinalDirection'
        );
        const apiClientSpy = jest
          .spyOn(searchPoiService, 'getExternalApiAddressClient')
          .mockReturnValueOnce({
            search: searchFn,
          });
        const result = await searchPoiService.getLocationBias(
          term,
          businessName
        );
        expect(apiClientSpy).toHaveBeenCalledWith('findplacefromtext');
        expect(searchFn).toHaveBeenCalledWith('berlin', null, null);
        expect(result).toEqual({
          lat: 52.43940006,
          lng: 13.42473175,
        });
        expect(moveCardinalDirectionSpy).toHaveBeenCalledWith(
          'south',
          {
            lat: candidateMock.geometry.viewport.northeast.lat,
            lon: candidateMock.geometry.viewport.southwest.lng,
          },
          {
            lat: candidateMock.geometry.viewport.southwest.lat,
            lon: candidateMock.geometry.viewport.northeast.lng,
          }
        );
      });
    });
  });

  describe('removeWordsFromTerm', () => {
    it('should remove word(s) from term regardless of case and position', () => {
      expect(
        searchPoiService.removeWordsFromTerm(
          'berlin main station',
          'main station'
        )
      ).toEqual('berlin');
      expect(
        searchPoiService.removeWordsFromTerm(
          'berlin, main station',
          'main station'
        )
      ).toEqual('berlin');
      expect(
        searchPoiService.removeWordsFromTerm(
          'main station, berlin',
          'main station'
        )
      ).toEqual('berlin');
    });
  });

  describe('getPoiSearchTerm', () => {
    it('should remove city, cardinal directions from term', () => {
      expect(
        searchPoiService.getPoiSearchTerm('McDonalds, Coburg', 'McDonalds')
      ).toBe('mcdonalds');

      expect(
        searchPoiService.getPoiSearchTerm('BurgerKing, Coburg', 'BurgerKing')
      ).toBe('burgerking');

      expect(
        searchPoiService.getPoiSearchTerm(
          'Thai restaurant, London',
          'Thai restaurant'
        )
      ).toBe('thai restaurant');
    });
  });

  describe('searchMainTrainStation', () => {
    it('should search TomTomAPI with "main train station" as search term', async () => {
      jest
        .spyOn(searchPoiService, 'getLocationBias')
        .mockResolvedValueOnce({ lat: 123, lng: 231 });
      const searchFn = jest.fn(() => ({
        status: 200,
        data: {
          summary: { totalResults: 5 },
          results: [],
        },
      }));
      jest
        .spyOn(searchPoiService, 'getExternalApiAddressClient')
        .mockReturnValueOnce({
          search: searchFn,
        });
      await searchPoiService.searchMainTrainStation('Essen Hauptbahnhof');
      expect(searchFn).toHaveBeenCalledWith('main train station', 123, 231);
    });
  });

  describe('searchPoiName', () => {
    describe('when business name is provided with city', () => {
      it('should search TomTomAPI with business name and city as location bias', async () => {
        const getLocationBiasSpy = jest
          .spyOn(searchPoiService, 'getLocationBias')
          .mockResolvedValueOnce({ lat: 123, lng: 231 });
        const searchFn = jest.fn(() => ({
          status: 200,
          data: {
            summary: { totalResults: 5 },
            results: [],
          },
        }));
        jest
          .spyOn(searchPoiService, 'getExternalApiAddressClient')
          .mockReturnValueOnce({
            search: searchFn,
          });

        const address = 'McDonalds, Coburg';
        const businessName = 'McDonalds';

        await searchPoiService.searchPoiName(address, businessName);

        expect(getLocationBiasSpy).toHaveBeenCalledWith(
          address,
          businessName,
        );
        expect(searchFn).toHaveBeenCalledWith(
          businessName.toLowerCase(),
          123,
          231,
        );
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
