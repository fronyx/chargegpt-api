const HighwayNameRegex = /[M|A|B]\d{1,3}/;

export const getHighwayName = (address: string): string => {
  if (!address) {
    return undefined;
  }

  const match = address.match(HighwayNameRegex);

  if (!match) {
    return undefined;
  }

  return match[0] as string;
};
