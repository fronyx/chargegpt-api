import {
  mapTechnicalConnectorTypeToConnectorType,
  askUserToChooseDestination,
  getChargingStationDetails,
} from './whatsapp.service';

describe('getChargingStationDetails', () => {
  const location = {
    locationId: 'DE-BDO-S754952500',
    link: 'https://www.google.com/maps/search/?api=1&query=52.524370,13.410530',
    distance: 121.47504090891454,
    lat: 52.52437,
    lng: 13.41053,
    powerType: 'AC',
    powerKw: 22,
    connectorTypes: ['IEC_62196_T2', 'chademo'],
    probability: 0,
    operatorName: 'LichtBlick eMobility GmbH',
    recommendation: 'Nearest',
  };

  it('it should return location ID, operatorName, powerKw, powerType and connectorType', () => {
    const result = getChargingStationDetails(location);

    expect(result).toBe(
      `ID: ${location.locationId} - Operator: ${location.operatorName} - ${location.powerKw}kW, ${location.powerType}, Type 2, CHADEMO`
    );
  });

  it('it should return location ID, operatorName, powerKw, powerType and one connectorType', () => {
    const locationWithOneConnectorType = {
      ...location,
      connectorTypes: ['IEC_62196_T2'],
    };

    const result = getChargingStationDetails(locationWithOneConnectorType);

    expect(result).toBe(
      `ID: ${location.locationId} - Operator: ${location.operatorName} - ${location.powerKw}kW, ${location.powerType}, Type 2`
    );
  });

  it('it should return location ID, operatorName, powerKw and powerType without connectorType', () => {
    const unrecognizedConnectorType = {
      ...location,
      connectorTypes: ['connector type'],
    };
    const result = getChargingStationDetails(unrecognizedConnectorType);

    expect(result).toBe(
      `ID: ${location.locationId} - Operator: ${location.operatorName} - ${location.powerKw}kW, ${location.powerType}`
    );

    const emptyConnectorType = {
      ...location,
      connectorTypes: [],
    };
    const resultWithoutConnectorType = getChargingStationDetails(emptyConnectorType);

    expect(resultWithoutConnectorType).toBe(
      `ID: ${location.locationId} - Operator: ${location.operatorName} - ${location.powerKw}kW, ${location.powerType}`
    );
  });
});

describe('mapTechnicalConnectorTypeToConnectorType', () => {
  it('should return the Type 2 connector type', () => {
    const connectorType = 'IEC_62196_T2';
    const result = mapTechnicalConnectorTypeToConnectorType(connectorType);

    expect(result).toBe('Type 2');
  });

  it('should return the CCS connector type', () => {
    const connectorType = 'IEC_62196_T2_COMBO';
    const result = mapTechnicalConnectorTypeToConnectorType(connectorType);

    expect(result).toBe('CCS');
  });

  it('should return the CHADEMO connector type', () => {
    const connectorType = 'CHADEMO';
    const result = mapTechnicalConnectorTypeToConnectorType(connectorType);

    expect(result).toBe('CHADEMO');
  });

  it('should return undefined for unrecognized connector type', () => {
    const connectorType = 'connector_type';
    const result = mapTechnicalConnectorTypeToConnectorType(connectorType);

    expect(result).toBeUndefined();
  });
});

describe('askUserToChooseDestination', () => {
  const recipient = '1234567890';
  const message =
    'Which of the following locations best fit your request: 1.) Kentucky Fried Chicken, Rhein Ruhr Zentrum, Humboldtring 13, 45472 Mülheim an der Ruhr, Germany, 2.) Kentucky Fried Chicken, Grothusstraße 23, 45881 Gelsenkirchen, Germany, or 3.) Kentucky Fried Chicken, Bottroper Str. 130, 45356 Essen, Germany?';

  it('should send a list of locations to the user', async () => {
    const response = await askUserToChooseDestination(recipient, message);
    
    expect(response).toBeTruthy();
  });
});
