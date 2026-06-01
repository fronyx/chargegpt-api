import {
  distanceInMeterBetween2Locations,
  filterOptionsTooCloseFromEachOther,
} from './poi-search-utils.service';

describe('filterOptionsTooCloseFromEachOther', () => {
  it('should remove options when all options has the same coordinates', () => {
    const addressOptions = [
      {
        address: 'option 1',
        lat: 51.451834,
        lng: 7.013569,
      },
      {
        address: 'option 2',
        lat: 51.451834,
        lng: 7.013569,
      },
      {
        address: 'option 3',
        lat: 51.451834,
        lng: 7.013569,
      },
    ];
    const results = filterOptionsTooCloseFromEachOther(addressOptions);

    expect(results).toEqual([
      {
        address: 'option 1',
        lat: 51.451834,
        lng: 7.013569,
      },
    ]);
  });

  it('should keep the available options in case of only 1 available', () => {
    const addressOptions = [
      {
        address: 'option 1',
        lat: 51.451834,
        lng: 7.013569,
      },
    ];
    const results = filterOptionsTooCloseFromEachOther(addressOptions);

    expect(results).toEqual([
      {
        address: 'option 1',
        lat: 51.451834,
        lng: 7.013569,
      },
    ]);
  });

  it('should remove option 3 when option 3 is too close to option 2', () => {
    const addressOptions = [
      {
        address: 'option 1',
        lat: 51.451834,
        lng: 7.013569,
      },
      {
        address: 'option 2',
        lat: 51.451834,
        lng: 7.02357,
      },
      {
        address: 'option 3',
        lat: 51.451834,
        lng: 7.024,
      },
    ];
    const results = filterOptionsTooCloseFromEachOther(addressOptions);

    expect(results).toEqual([
      {
        address: 'option 1',
        lat: 51.451834,
        lng: 7.013569,
      },
      {
        address: 'option 2',
        lat: 51.451834,
        lng: 7.02357,
      },
    ]);
  });

  it('should remove option 2 when option 2 is too close to option 1', () => {
    const addressOptions = [
      {
        address: 'option 1',
        lat: 51.451834,
        lng: 7.013569,
      },
      {
        address: 'option 2',
        lat: 51.451834,
        lng: 7.01357,
      },
      {
        address: 'option 3',
        lat: 51.451834,
        lng: 7.024,
      },
    ];
    const results = filterOptionsTooCloseFromEachOther(addressOptions);

    expect(results).toEqual([
      {
        address: 'option 1',
        lat: 51.451834,
        lng: 7.013569,
      },
      {
        address: 'option 3',
        lat: 51.451834,
        lng: 7.024,
      },
    ]);
  });
});

const location1 = {
  address: 'Am Hauptbahnhof, Essen, Germany',
  addressId:
    'Eh9BbSBIYXVwdGJhaG5ob2YsIEVzc2VuLCBHZXJtYW55Ii4qLAoUChIJZaoWDcrCuEcR-pe7U3u7YvgSFAoSCTn2q5a3wrhHEZ0sraQR4QBq',
  lat: 51.45133329999999,
  lng: 7.013014999999999,
};

const location2 = {
  address: 'Essen Hbf, Am Hauptbahnhof, Essen, Germany',
  addressId: 'ChIJicfwQcrCuEcRBScpoj9SRJg',
  lat: 51.4509379,
  lng: 7.013883,
};

const location3 = {
  address: "McDonald's, Karnaper Straße, Essen, Germany",
  addressId: 'ChIJw2AIXf7puEcRYJ1XUktyzc4',
  lat: 51.5259928,
  lng: 7.0081339,
};

describe('distanceInMeterBetween2Locations', () => {
  it('should return the distance less than 200m', () => {
    const distance = distanceInMeterBetween2Locations(
      location1.lat,
      location1.lng,
      location2.lat,
      location2.lng
    );
    expect(distance).toBeLessThan(200);
  });

  it('should return the distance more than 200m', () => {
    const distance = distanceInMeterBetween2Locations(
      location1.lat,
      location1.lng,
      location3.lat,
      location3.lng
    );

    expect(distance).toBeGreaterThan(200);
  });

  it('should return the distance more than 200m', () => {
    const distance = distanceInMeterBetween2Locations(
      location1.lat,
      location1.lng,
      0,
      0
    );

    expect(distance).toBeGreaterThan(200);
  });

  it('should throw an error for null coordinates', () => {
    expect(() => {
      distanceInMeterBetween2Locations(
        null as any,
        null as any,
        null as any,
        null as any
      );
    }).toThrow('Invalid coordinates.');
  });

  it('should throw an error for undefined coordinates', () => {
    expect(() => {
      distanceInMeterBetween2Locations(
        undefined as any,
        undefined as any,
        undefined as any,
        undefined as any
      );
    }).toThrow('Invalid coordinates.');
  });
});
