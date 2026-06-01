import { ToolkitProject } from '@fronyx/toolkit';
import { ConversationHistory } from '../models/conversation-history.model';

jest.mock('../models/chat-utilities');
jest.mock('./address-services/search-poi.service');
jest.mock('./conversations-helper.service');

describe('setBlockedLocationToHistory', () => {
  const project = { name: 'foo' } as unknown as ToolkitProject;

  describe('address options is available', () => {
    it('should add the first address option as blocked', async () => {
      const addBlockedLocationFn = jest.fn();
      const getAddressOptionsFn = jest.fn().mockImplementation(() => {
        return [
          {
            addressId: 1,
          },
          { addressId: 2 },
        ];
      });
      const history = {
        getAddressOptions: getAddressOptionsFn,
        addBlockedLocation: addBlockedLocationFn,
      } as unknown as ConversationHistory;
      const FiltersAgentService = await import('./conversations-agent.service');
      FiltersAgentService.setBlockedLocationsToHistory(history, project);
      expect(getAddressOptionsFn).toBeCalledTimes(1);
      expect(addBlockedLocationFn).toBeCalledTimes(1);
      expect(addBlockedLocationFn).toBeCalledWith(1);
    });
  });

  describe('address option is not available', () => {
    describe('address options is []', () => {
      it('should not call addBlockedLocation', async () => {
        const addBlockedLocationFn = jest.fn();
        const getAddressOptionsFn = jest.fn().mockImplementation(() => {
          return [];
        });
        const history = {
          getAddressOptions: getAddressOptionsFn,
          addBlockedLocation: addBlockedLocationFn,
        } as unknown as ConversationHistory;
        const FiltersAgentService = await import('./conversations-agent.service');
        FiltersAgentService.setBlockedLocationsToHistory(history, project);
        expect(getAddressOptionsFn).toHaveBeenCalledTimes(1);
        expect(addBlockedLocationFn).not.toHaveBeenCalled();
      });
    });

    describe('address option is null', () => {
      it('should not call addBlockedLocation', async () => {
        const addBlockedLocationFn = jest.fn();
        const getAddressOptionsFn = jest.fn().mockImplementation(() => {
          return null;
        });
        const history = {
          getAddressOptions: getAddressOptionsFn,
          addBlockedLocation: addBlockedLocationFn,
        } as unknown as ConversationHistory;
        const FiltersAgentService = await import('./conversations-agent.service');
        FiltersAgentService.setBlockedLocationsToHistory(history, project);
        expect(getAddressOptionsFn).toHaveBeenCalledTimes(1);
        expect(addBlockedLocationFn).not.toHaveBeenCalled();
      });
    });
  });
});

describe('continueWithAddressProcessing', () => {
  beforeEach(() => jest.resetModules());
  const history = new ConversationHistory({});
  const project = { name: 'foo' } as ToolkitProject;

  describe('routing request detected', () => {
    it('should return help', async () => {
      const addressFiltersRequests = {
        request: {
          origin: 'origin',
          destination: 'destination',
        },
      } as any;
      const userNeedHelpFn = jest.fn();
      const helperService = {
        userNeedHelp: userNeedHelpFn,
      } as any;

      const FiltersAgentService = await import('./conversations-agent.service');

      FiltersAgentService.continueWithAddressProcessing(
        {} as any,
        {} as any,
        addressFiltersRequests,
        {} as any,
        helperService
      );

      expect(userNeedHelpFn).toBeCalledTimes(1);
    });
  });

  describe('preventing {city} from polluting subsequent requests', () => {
    describe('destination contains {city}', () => {
      it('should set destination without {city}', async () => {
        const setDestinationAddressFn = jest.fn();
        history.setDestinationAddress = setDestinationAddressFn;
        history.getIsNearbyRequested = jest.fn().mockImplementation(() => true);
        const addressFiltersRequests = {
          request: {
            destination: 'destination {city}',
          },
        } as any;
        const FiltersAgentService = await import('./conversations-agent.service');

        FiltersAgentService.continueWithAddressProcessing(
          history,
          project,
          addressFiltersRequests,
          {} as any,
          {
            askForLocationContext: jest.fn(),
          } as any
        );

        expect(setDestinationAddressFn).toBeCalledTimes(1);
        expect(setDestinationAddressFn).toBeCalledWith('destination ');
      });
    });
  });

  describe('user requested nearby search', () => {
    describe('user has not provided a location', () => {
      it('should ask for location context', async () => {
        history.getIsNearbyRequested = jest.fn().mockImplementation(() => true);
        const addressFiltersRequests = {
          request: {
            destination: 'destination {city}',
          },
        } as any;
        const askForLocationContextFn = jest.fn();

        const FiltersAgentService = await import('./conversations-agent.service');

        FiltersAgentService.continueWithAddressProcessing(
          history,
          project,
          addressFiltersRequests,
          {} as any,
          {
            askForLocationContext: askForLocationContextFn,
          } as any
        );
        expect(askForLocationContextFn).toBeCalledTimes(1);
      });
    });

    describe('user has already provide a location', () => {
      describe('but no destination (poi or poi category) detected', () => {
        it('should not ask again for location context', async () => {
          jest.mock('./filters-agent.service', () => ({
            ...(jest.requireActual('./filters-agent.service') as any),
            getClosestAddressOption: jest.fn(),
          }));

          history.setLastUserInput('I want to charge nearby');
          history.setLocationEnabled(true);
          history.setCurrentCoordinates({ lat: 10, lng: 20 });

          const historySpies = getConversationHistorySpies(history);

          const identifiedAddressFilters = generateAddressFiltersRequests({
            is_nearby_requested: true,
          });
          const identifiedFiltersByCategories = {} as any;
          const helperService = generateMockConversationHelperService();

          const FiltersAgentService = await import('./conversations-agent.service');
          const getClosesAddressOptionSpy = jest.spyOn(
            FiltersAgentService,
            'getClosestAddressOption'
          );
          await FiltersAgentService.continueWithAddressProcessing(
            history,
            project,
            identifiedAddressFilters,
            identifiedFiltersByCategories,
            helperService
          );

          expect(helperService.askForLocationContext).not.toHaveBeenCalled();
          expect(helperService.addressSearch).not.toHaveBeenCalled();
          expect(
            helperService.addressInvalidErrorMessage
          ).not.toHaveBeenCalled();
          expect(historySpies.setLatSpy).toHaveBeenCalledWith('10');
          expect(historySpies.setLngSpy).toHaveBeenCalledWith('20');
          expect(
            historySpies.setIsCurrentCoordinatesRequestedSpy
          ).toHaveBeenCalledWith(false);
          expect(
            historySpies.setLastAddressQueryStringSpy
          ).toHaveBeenCalledWith(null);
          expect(getClosesAddressOptionSpy).not.toHaveBeenCalled();
          expect(helperService.returnResults).toBeCalledTimes(1);
        });
      });

      describe('and destination (poi or poi category) detected', () => {
        beforeEach(() => jest.resetModules());
        it('should not ask for location context and search for the destination', async () => {
          history.setLastUserInput('I want to charge nearby');
          history.setLocationEnabled(true);
          history.setCurrentCoordinates({ lat: 10, lng: 20 });

          const helperService = generateMockConversationHelperService();
          const identifiedAddressFilters = generateAddressFiltersRequests({
            is_nearby_requested: true,
            destination: 'destination',
          });
          const identifiedFiltersByCategories = {} as any;
          const FiltersAgentService = await import('./conversations-agent.service');
          const getClosesAddressOptionSpy = jest.spyOn(
            FiltersAgentService,
            'getClosestAddressOption'
          );
          await FiltersAgentService.continueWithAddressProcessing(
            history,
            project,
            identifiedAddressFilters,
            identifiedFiltersByCategories,
            helperService
          );

          expect(helperService.askForLocationContext).not.toHaveBeenCalled();
          expect(helperService.addressSearch).toBeCalledTimes(1);
          expect(getClosesAddressOptionSpy).not.toHaveBeenCalled();
        });
      });

      describe('and already presented an option', () => {
        it('should select the nearest address to user location', async () => {
          history.setLocationEnabled(true);
          history.setCurrentCoordinates({ lat: 10, lng: 20 });
          history.setAddressOptions([
            {
              address: 'address1',
              addressId: 'addressId1',
              lat: 10,
              lng: 20,
            },
            {
              address: 'address2',
              addressId: 'addressId2',
              lat: 30,
              lng: 40,
            },
          ]);

          const addressFiltersRequests = {
            request: {
              is_nearby_requested: true,
            },
          } as any;

          const FiltersAgentService = await import('./conversations-agent.service');
          const getClosesAddressOptionSpy = jest.spyOn(
            FiltersAgentService,
            'getClosestAddressOption'
          );

          const helperService = generateMockConversationHelperService();

          await FiltersAgentService.continueWithAddressProcessing(
            history,
            project,
            addressFiltersRequests,
            {} as any,
            helperService
          );

          expect(getClosesAddressOptionSpy).toBeCalledTimes(1);
          expect(helperService.returnResults).toBeCalledTimes(1);
        });
      });

      describe('destination contains {city}', () => {
        it('should remove {city} from the destination', async () => {
          history.setLocationEnabled(true);
          history.setCurrentCoordinates({ lat: 10, lng: 20 });
          history.setLastUserInput('I want to charge at restaurant');

          const helperService = generateMockConversationHelperService();
          const addressFiltersRequests = {
            request: {
              destination: 'destination, {city}',
            },
          } as any;
          const historySpies = getConversationHistorySpies(history);

          const FiltersAgentService = await import('./conversations-agent.service');

          FiltersAgentService.continueWithAddressProcessing(
            history,
            project,
            addressFiltersRequests,
            {} as any,
            helperService
          );

          expect(helperService.askForLocationContext).not.toHaveBeenCalled();
          expect(helperService.addressSearch).toBeCalledTimes(1);
          expect(historySpies.setSwitchReason).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('destination contains {city}', () => {
    it('should ask which city to the user', async () => {
      history.setLastUserInput('I want to charge at restaurant');

      const helperService = generateMockConversationHelperService();
      const identifiedAddressFilters = generateAddressFiltersRequests({
        destination: 'destination {city}',
      });

      const FiltersAgentService = await import('./conversations-agent.service');
      const historySpies = getConversationHistorySpies(history);

      FiltersAgentService.continueWithAddressProcessing(
        history,
        project,
        identifiedAddressFilters,
        {} as any,
        helperService
      );

      expect(helperService.askForLocationContext).not.toHaveBeenCalled();
      expect(helperService.returnQuestion).not.toHaveBeenCalled();
      expect(helperService.addressSearch).toBeCalledTimes(1);
      expect(historySpies.setSwitchReason).toHaveBeenCalledWith(
        '<CITY_REQUIRED>'
      );
    });
  });
});

export const generateAddressFiltersRequests = (input: any): any => {
  if (!input) {
    return {} as any;
  }

  return {
    request: {
      ...input,
    },
  } as any;
};

export const generateMockConversationHelperService = () => {
  return {
    returnResults: jest.fn(),
    askForLocationContext: jest.fn(),
    addressSearch: jest.fn(),
    addressInvalidErrorMessage: jest.fn(),
  } as any;
};

export const getConversationHistorySpies = (history: ConversationHistory) => {
  const setLatSpy = jest.spyOn(history, 'setLatitude');
  const setLngSpy = jest.spyOn(history, 'setLongitude');
  const setIsCurrentCoordinatesRequestedSpy = jest.spyOn(
    history,
    'setIsCurrentCoordinatesRequested'
  );
  const setLastAddressQueryStringSpy = jest.spyOn(
    history,
    'setLastAddressQueryString'
  );

  const setSwitchReason = jest.spyOn(history, 'setSwitchReason');

  return {
    setLatSpy,
    setLngSpy,
    setIsCurrentCoordinatesRequestedSpy,
    setLastAddressQueryStringSpy,
    setSwitchReason,
  };
};
