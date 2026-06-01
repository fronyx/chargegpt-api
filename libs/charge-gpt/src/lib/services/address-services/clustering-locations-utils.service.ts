import { distanceInMeterBetween2Locations } from './poi-search-utils.service';

const MAX_PER_GROUP = 3;

export const clusterLocationsTogether = (
  locations: any[],
  clusterSummarizerFn: null | ((input: any[]) => any),
  clusteredLocations: any[] = []
): any[] => {
  if (!locations) {
    return [];
  }

  if (locations.length < 1) {
    if (clusterSummarizerFn) {
      return clusterSummarizerFn(clusteredLocations);
    }

    return clusteredLocations;
  }

  const currentCluster = [];
  const anchorLocation = locations.shift();

  currentCluster.push(anchorLocation);

  locations.forEach((neighbour, index) => {
    const distance = distanceInMeterBetween2Locations(
      anchorLocation.position.lat,
      anchorLocation.position.lon,
      neighbour.position.lat,
      neighbour.position.lon
    );

    neighbour.distance = distance;

    if (distance <= 300 && currentCluster.length < MAX_PER_GROUP) {
      currentCluster.push(neighbour);
      locations[index] = null;
    }
  });

  clusteredLocations.push(currentCluster);
  const remainingLocations = locations.filter(Boolean);

  return clusterLocationsTogether(
    remainingLocations,
    clusterSummarizerFn,
    clusteredLocations
  );
};

export const getClusterSummarizer = (countryCode: string) => {
  const appendPostfixFn = getAppendPostfixFn(countryCode);
  return (clusters: any[]) => {
    return mapClusterIntoAddress(clusters, appendPostfixFn);
  };
};

export const getAppendPostfixFn = (
  countryCode: string
): ((val: string) => string) => {
  const dictionary = {
    EN: 'close to,,',
    DE: 'nah an,,',
    CZ: 'v blízkosti,,',
    PL: 'blisko,,',
    PT: 'próximo de,,',
    ES: 'cerca de,,',
    FR: 'proche de,,',
  };
  // Added two extra ,, in the end so that formatAddressOptions replaced it later with empty space
  const postfix = dictionary[countryCode] ?? 'close to,,';
  return (val: string) => {
    return `${val} ${postfix}`;
  };
};

export const mapClusterIntoAddress = (
  results: any,
  appendPrefixFn?: (names: string) => string
) => {
  return results.map((result) => {
    const firstLocation = result[0];

    const summarizedName = result
      .map((location) => location.poi.name)
      .join(', ');

    const getName = () => {
      // No need to append postfix if there is only one location in the cluster
      if (result.length === 1) {
        return summarizedName;
      }

      return appendPrefixFn ? appendPrefixFn(summarizedName) : '';
    };

    const poi = {
      ...firstLocation.poi,
      name: getName(),
    };

    return {
      ...firstLocation,
      poi,
    };
  });
};

export const removeExtraCommas = (address: string) => {
  return address.replace(',,,', '').replace(',,', '');
}