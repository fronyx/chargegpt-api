import { excludeRecommendedChargePoints } from './conversations-helper.service';

describe('excludeRecommendedChargePoints', () => {
  it('should return recommended charge points', () => {
    const now = Date.now();
    const availableChargePoints = [
      {
        locationId: '24c94dc1',
        link: 'https://www.google.com/maps/search/?api=1&query=51.462170,7.006600',
        distance: 115.62405169220062,
        lat: 51.46217,
        lng: 7.0066,
        powerType: 'AC',
        powerKw: 22,
        connectorTypes: ['IEC_62196_T2'],
        probability: 0,
        operatorName: 'DE*LPI',
        recommendation: 'Nearest',
        lastUsed: now,
        powerKwScore: 0,
        distanceScore: 0,
        probabilityScore: 0,
        score: 0,
        lastUsedScore: 0,
      },
      {
        locationId: '106da0f3',
        link: 'https://www.google.com/maps/search/?api=1&query=51.459198,7.010070',
        distance: 327.4174152291325,
        lat: 51.459198,
        lng: 7.01007,
        powerType: 'AC',
        powerKw: 22,
        connectorTypes: ['IEC_62196_T2'],
        probability: 0,
        operatorName: 'DE*QRM',
        lastUsed: now,
        powerKwScore: 0,
        distanceScore: 0,
        probabilityScore: 0,
        score: 0,
        lastUsedScore: 0,
      },
      {
        locationId: '3a630d8e',
        link: 'https://www.google.com/maps/search/?api=1&query=51.459198,7.010070',
        distance: 327.4174152291325,
        lat: 51.459198,
        lng: 7.01007,
        powerType: 'AC',
        powerKw: 22,
        connectorTypes: ['IEC_62196_T2'],
        probability: 0,
        operatorName: 'DE*QRM',
        lastUsed: now,
        powerKwScore: 0,
        distanceScore: 0,
        probabilityScore: 0,
        score: 0,
        lastUsedScore: 0,
      },
    ];

    const recommendedChargePoints = ['3a630d8e'];

    const result = excludeRecommendedChargePoints(
      availableChargePoints,
      recommendedChargePoints
    );

    expect(result).toEqual([
      {
        locationId: '24c94dc1',
        link: 'https://www.google.com/maps/search/?api=1&query=51.462170,7.006600',
        distance: 115.62405169220062,
        lat: 51.46217,
        lng: 7.0066,
        powerType: 'AC',
        powerKw: 22,
        connectorTypes: ['IEC_62196_T2'],
        probability: 0,
        operatorName: 'DE*LPI',
        recommendation: 'Nearest',
        lastUsed: now,
        powerKwScore: 0,
        distanceScore: 0,
        probabilityScore: 0,
        score: 0,
        lastUsedScore: 0,
      },
      {
        locationId: '106da0f3',
        link: 'https://www.google.com/maps/search/?api=1&query=51.459198,7.010070',
        distance: 327.4174152291325,
        lat: 51.459198,
        lng: 7.01007,
        powerType: 'AC',
        powerKw: 22,
        connectorTypes: ['IEC_62196_T2'],
        probability: 0,
        operatorName: 'DE*QRM',
        lastUsed: now,
        powerKwScore: 0,
        distanceScore: 0,
        probabilityScore: 0,
        score: 0,
        lastUsedScore: 0,
      },
    ]);
  });
});
