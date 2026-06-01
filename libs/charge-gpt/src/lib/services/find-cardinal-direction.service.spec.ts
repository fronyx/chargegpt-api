import { findCardinalDirectionFromTranslatedAddress } from './poi-search.service';

describe('findCardinalDirectionFromTranslatedAddress', () => {
  it('should return the correct cardinal direction from original string', () => {
    const result = findCardinalDirectionFromTranslatedAddress(
      'Porto, South',
      'Porto, Sul',
      'South'
    );
    expect(result).toBe('Sul');
  });
});
