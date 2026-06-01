import {
  noChargePointsAvailableError,
  noChargePointsInDBError,
} from './search-charging-stations-service/charging-station-search.service';
import { ConversationHistory } from '../models/conversation-history.model';
import {
  noChargePointsInDB,
  noChargePointsInDBForAllAddressOptions,
  noChargePointsAvailable,
  noChargePointsAvailableWithinAddressOptions,
} from '../models/charge-gpt-translation.assets';

jest.mock('../models/charge-gpt-translation.assets', () => ({
  ...(jest.requireActual('../models/charge-gpt-translation.assets') as any),
  noChargePointsInDB: jest.fn(),
  noChargePointsInDBForAllAddressOptions: jest.fn(),
  noChargePointsAvailable: jest.fn(),
  noChargePointsAvailableWithinAddressOptions: jest.fn(),
}));

const locationMocks = [
  {
    locationId: 'locationId',
    link: 'link',
    distance: 1,
    probability: 0,
    primaryIds: ['primaryIds'],
    lat: 0,
    lng: 0,
    powerType: 'powerType',
    powerKw: 22,
    recommendation: 'recommendation',
    isCurrentlyAvailable: true,
    score: 1,
    connectorTypes: ['connectorTypes'],
  },
];

const buildConversationHistoryMock = (isLocationsAvailable = false) => {
  const conversationHistoryMock = {
    getIsLocationsAreSearchBasedOnAddressOptions: () => isLocationsAvailable,
    getPowerType: () => 'both',
  } as ConversationHistory;

  return conversationHistoryMock;
};

describe('No charge points available error messages', () => {
  describe('Location available in DB, but no charge points available', () => {
    describe('User search with address options', () => {
      it('should return no available charge points for all address options', () => {
        noChargePointsAvailableError(buildConversationHistoryMock(true), locationMocks);

        expect(noChargePointsAvailableWithinAddressOptions).toBeCalledTimes(1);
        expect(noChargePointsAvailable).toBeCalledTimes(0);
      });
    });

    describe('User search only with single address option', () => {
      it('should return no available charge point for the specific location', () => {
        noChargePointsAvailableError(buildConversationHistoryMock(), locationMocks);

        expect(noChargePointsAvailable).toBeCalledTimes(1);
        expect(noChargePointsAvailableWithinAddressOptions).toBeCalledTimes(0);
      });
    });
  });

  describe('Location is not available at all in DB', () => {
    describe('User search with address options', () => {
      it('Should return no charge points in DB for all address options', () => {
        noChargePointsInDBError(buildConversationHistoryMock(true));

        expect(noChargePointsInDBForAllAddressOptions).toBeCalledTimes(1);
        expect(noChargePointsInDB).toBeCalledTimes(0);
      });
    });

    describe('User search only with single address option', () => {
      it('Should return no charge points in DB for the specific location', () => {
        noChargePointsInDBError(buildConversationHistoryMock());

        expect(noChargePointsInDB).toBeCalledTimes(1);
        expect(noChargePointsInDBForAllAddressOptions).toBeCalledTimes(0);
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
