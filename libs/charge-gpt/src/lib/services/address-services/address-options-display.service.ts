import { alpha2to3Map } from '@fronyx/data-transfer-object';
import {
  AddressOption,
  TomTomAddressDetails,
  TomTomLocation,
} from './models/address.model';

export interface SearchPoiAddress extends TomTomLocation {
  poi: { name: string };
}

interface AttachAddressLineData extends SearchPoiAddress {
  addressLine: string;
  poiName: string;
}

type AddressAttribute =
  | 'poiName'
  | 'freeformAddress'
  | 'municipality'
  | 'countrySubdivisionName'
  | 'countrySecondarySubdivision'
  | 'countryCode';

export const mapTomTomLocationIntoSearchPoiAddress = (
  location: TomTomLocation
): SearchPoiAddress => {
  return {
    ...location,
    poi: { name: '' },
  };
};

export const mapAddressResultsIntoAddressOptions = (
  addresses: SearchPoiAddress[]
): AddressOption[] => {
  const uniqueAddressList = generateUniqueAddressLineList(
    addresses.map(mapSearchPoiAddressIntoAttachAddressLineData)
  );

  return uniqueAddressList.map(mapAttachAddressLineDataIntoAddressOptions);
};

const DefaultAddressAttributes: AddressAttribute[] = [
  'poiName',
  'freeformAddress',
  'municipality',
  'countrySubdivisionName',
  'countrySecondarySubdivision',
  'countryCode',
];

const generateUniqueAddressLineList = (
  attachAddressLineDataList: AttachAddressLineData[],
  addressAttributesInput: AddressAttribute[] = DefaultAddressAttributes
): AttachAddressLineData[] => {
  if (!attachAddressLineDataList || attachAddressLineDataList.length === 0) {
    return [];
  }

  if (addressAttributesInput.length === 0) {
    return attachAddressLineDataList;
  }

  const addressAttributes = addressAttributesInput.slice();
  const currentAttribute = addressAttributes.shift();

  const updatedAddressLineList = attachAddressLineDataList.map((address) =>
    attachAddressAttributesToAddressLine(address, currentAttribute)
  );

  if (currentAttribute === 'poiName') {
    return generateUniqueAddressLineList(
      updatedAddressLineList,
      addressAttributes
    );
  }

  return someOptionHasSameAddressLine(updatedAddressLineList)
    ? generateUniqueAddressLineList(updatedAddressLineList, addressAttributes)
    : updatedAddressLineList;
};

const mapSearchPoiAddressIntoAttachAddressLineData = (
  address: SearchPoiAddress
): AttachAddressLineData => {
  return {
    ...address,
    addressLine: '',
    poiName: address.poi ? address.poi.name ?? '' : '',
  };
};

const someOptionHasSameAddressLine = (
  addresses: AttachAddressLineData[]
): boolean => {
  if (addresses.length < 2) {
    return false;
  }

  const uniqueAddressLine = new Set<string>();
  addresses.forEach((address) => uniqueAddressLine.add(address.addressLine));

  return uniqueAddressLine.size !== addresses.length;
};

const mapAttachAddressLineDataIntoAddressOptions = (
  addressLineData: AttachAddressLineData
): AddressOption => {
  const matchConfidence = addressLineData.matchConfidence
    ? addressLineData.matchConfidence.score
    : 1;

  return {
    address: addressLineData.addressLine,
    addressId: addressLineData.id,
    name: addressLineData.poi.name,
    matchConfidence,
    countryCode: getISO3CountryCode(addressLineData.address),
    municipality: addressLineData.address.municipality,
    secondarySubDivision: '',
    type: addressLineData.type,
    lat: addressLineData.position.lat,
    lng: addressLineData.position.lon,
  };
};

const getISO3CountryCode = (address: TomTomAddressDetails): string => {
  if (address.countryCodeISO3) {
    return address.countryCodeISO3;
  }

  if (!address.countryCode) {
    throw new Error('Country code is missing');
  }

  if (address.countryCode.length === 2) {
    return alpha2to3Map[address.countryCode.toUpperCase()];
  }

  return address.countryCode.toUpperCase();
};

const attachAddressAttributesToAddressLine = (
  address: AttachAddressLineData,
  attribute: AddressAttribute
): AttachAddressLineData => {
  const uniqueAddressLine = new Set<string>();
  address.addressLine
    .split(',')
    .map((val) => val.trim())
    .forEach((val) => uniqueAddressLine.add(val));

  if (attribute === 'poiName') {
    uniqueAddressLine.add(address[attribute]);
  } else {
    uniqueAddressLine.add(address.address[attribute]);
  }

  return {
    ...address,
    addressLine: Array.from(uniqueAddressLine)
      .filter((val) => val !== '' && val !== undefined && val !== null)
      .join(', '),
  };
};
