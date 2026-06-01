export const parseUnconfirmedAddresses = (val) => {
  if (!val) {
    return null;
  }

  const value = removeSpecialCharacters(
    replaceWithSpace(',', replaceWithSpace('-', replaceWithSpace('.', val)))
  );
  return splitAndSort(value)
    .map((word) => word.toLowerCase())
    .filter(Boolean)
    .join('||');
};

export const replaceWithSpace = (symbolToBeReplace: string, val: string) => {
  return val
    .replace(new RegExp(`\\${symbolToBeReplace}`, 'gi'), ' ')
    .replace(/\s\s/, ' ')
    .trim();
};

export const removeSpecialCharacters = (val: string) => {
  return val.replace(/[',~]/gi, '');
};

export const splitAndSort = (val: string) => {
  return val.toLowerCase().split(/\s/).sort();
};

export const isDestinationEqual = (
  rawExpectedDestination: string,
  expectedDestinationString: string,
  receivedDestinationString: string
) => {
  const isExactComparison =
    rawExpectedDestination[0] !== '~' &&
    rawExpectedDestination[rawExpectedDestination.length - 1] !== '^';

  if (isExactComparison) {
    return expectedDestinationString === receivedDestinationString;
  }

  return receivedDestinationString.includes(expectedDestinationString);
};
