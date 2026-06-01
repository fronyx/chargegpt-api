import { ConversationHistory } from '../models/conversation-history.model';
import {
  isDestinationInformationInHistory,
  isCurrentCoordinatesInHistory,
} from './address-filter-identifiers-function';

const defaultConversationHistory = {
  getData: () => ({
    address: null,
    latitude: null,
    longitude: null,
    address_options: null,
  }),
  getCurrentCoordinates: () => ({
    lat: null,
    lng: null,
  }),
} as any as ConversationHistory;

describe('isAddressInformationInHistory', () => {
  it('should return false for undefined address, latitude, longitude and addres options', () => {
    const result = isDestinationInformationInHistory(
      defaultConversationHistory
    );
    expect(result).toBeFalsy();
  });

  it('should return false for empty string address, latitude, longitude and address option', () => {
    const history = {
      ...defaultConversationHistory,
      getData: () => ({
        ...defaultConversationHistory.getData(),
        address: '',
        latitude: 0,
        longitude: 0,
        address_options: [],
      }),
    } as any as ConversationHistory;

    const falseResult = isDestinationInformationInHistory(history);
    expect(falseResult).toBeFalsy();
  });

  it('should return false for undefined address, latitude, longitude and address option', () => {
    const history = {
      ...defaultConversationHistory,
      getData: () => ({
        ...defaultConversationHistory.getData(),
        address: undefined,
        latitude: undefined,
        longitude: undefined,
        address_options: undefined,
      }),
    } as any as ConversationHistory;

    const falseResult = isDestinationInformationInHistory(history);
    expect(falseResult).toBeFalsy();
  });

  it('should return true for existing information related to destination', () => {
    const history = {
      ...defaultConversationHistory,
      getData: () => ({
        ...defaultConversationHistory.getData(),
        address: 'anyAddress',
        latitude: 'anyLatitude',
        longitude: 'anyLongitude',
        address_options: ['anyAddressOption'],
      }),
    } as any as ConversationHistory;

    const result = isDestinationInformationInHistory(history);
    expect(result).toBeTruthy();
  });

  it('should return true for existing information related to destination options', () => {
    const history = {
      ...defaultConversationHistory,
      getData: () => ({
        ...defaultConversationHistory.getData(),
        address_options: ['anyAddressOption'],
      }),
    } as any as ConversationHistory;

    const result = isDestinationInformationInHistory(history);
    expect(result).toBeTruthy();
  });
});

describe('isCurrentCoordinatesInHistory', () => {
  it('should return false for null current coordinates', () => {
    const result = isCurrentCoordinatesInHistory(
      defaultConversationHistory
    );
    expect(result).toBeFalsy();
  });

  it('should return false for undefined current coordinates', () => {
    const history = {
      ...defaultConversationHistory,
      getCurrentCoordinates: () => ({
        lat: undefined,
        lng: undefined,
      }),
    } as any as ConversationHistory;

    const result = isCurrentCoordinatesInHistory(history);
    expect(result).toBeFalsy();
  });

  it('should return true for existing current coordinates', () => {
    const history = {
      ...defaultConversationHistory,
      getCurrentCoordinates: () => ({
        lat: 1,
        lng: 1,
      }),
    } as any as ConversationHistory;

    const result = isCurrentCoordinatesInHistory(history);
    expect(result).toBeTruthy();
  });
});
