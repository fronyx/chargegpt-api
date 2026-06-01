export const expectedOutputToIdentifiedFilters = (otherExpectedOutput) => {
  if (!otherExpectedOutput) {
    return undefined;
  }

  let identifiedFilters: any = {};

  if (otherExpectedOutput.cat1) {
    identifiedFilters = {
      ...identifiedFilters,
      ...otherExpectedOutput.cat1,
    };
  }

  if (otherExpectedOutput.cat7) {
    identifiedFilters = {
      ...identifiedFilters,
      ...otherExpectedOutput.cat7,
    };
  }

  if (otherExpectedOutput.cat8) {
    identifiedFilters = {
      ...identifiedFilters,
      ...otherExpectedOutput.cat8,
    };
  }

  if (otherExpectedOutput.address) {
    identifiedFilters = {
      ...identifiedFilters,
      ...otherExpectedOutput.address,
    };
  }

  if (Object.values(identifiedFilters).filter(Boolean).length === 0) {
    return undefined;
  }

  return identifiedFilters;
};
