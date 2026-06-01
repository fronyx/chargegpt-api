export const removeUnwantedLocationsBasedOnTypes = (locations) => {
  const typeCountMap = locations
    .map(({ types }) => types)
    .map((val) => {
      val.sort();
      return val;
    })
    .map((val) => val.join(''))
    .reduce((acc, val) => {
      acc[val] = acc[val] ? acc[val] + 1 : 1;
      return acc;
    }, {} as any);

  const mostRepeatedTypeCount = Math.max(...Object.values(typeCountMap) as any);
  const wantedTypes = Object.keys(typeCountMap).filter(key => typeCountMap[key] === mostRepeatedTypeCount);

  return locations.filter(({ types }) => {
    types.sort();
    const comparableType = types.join('');
    return wantedTypes.includes(comparableType);
  });
};
