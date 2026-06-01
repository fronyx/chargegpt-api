import { useTryAsync } from 'no-try';
import { AddressOutOfScopeError } from '../models/address-search-error';

describe('validateCurrentCoordinates', () => {
  const projectFilters = [{ attribute: 'country', value: 'DEU' }];

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error if currentCoordinates is not provided', async () => {
    const FiltersAgentService = await import('./conversations-agent.service');
    await expect(
      FiltersAgentService.validateCurrentCoordinates(null, projectFilters)
    ).rejects.toThrow('No current coordinates in history.');
  });

  it('should throw an error if country code is invalid', async () => {
    const SearchPoiService = await import(
      './address-services/search-poi.service'
    );
    // Mock the function to return null
    jest
      .spyOn(SearchPoiService, 'queryCountryCodeFromCurrentCoordinates')
      .mockResolvedValue('');

    const currentCoordinates = { lat: 0, lng: 0 };

    const FiltersAgentService = await import('./conversations-agent.service');
    const [err] = await useTryAsync(() => FiltersAgentService.validateCurrentCoordinates(
      currentCoordinates,
      projectFilters
    ));
    expect(err).toBeInstanceOf(AddressOutOfScopeError);
  });

  it('should throw an error if validateCountryCodePermissionWithinProject returns an error', async () => {
    const currentCoordinates = { lat: 51.459980010986, lng: 7.006187915802 };
    const countryCode = 'POL';

    const SearchPoiService = await import(
      './address-services/search-poi.service'
    );

    jest
      .spyOn(SearchPoiService, 'queryCountryCodeFromCurrentCoordinates')
      .mockResolvedValue(countryCode);

    const FiltersAgentService = await import('./conversations-agent.service');
    const [err] = await useTryAsync(() => FiltersAgentService.validateCurrentCoordinates(
      currentCoordinates,
      projectFilters
    ));
    expect(err).toBeInstanceOf(AddressOutOfScopeError);
  });
});
