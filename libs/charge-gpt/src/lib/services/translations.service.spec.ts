import { getTranslation } from '@fronyx/translations';

describe('getTranslation', () => {
  it('should return correct translation for en', () => {
    const result = getTranslation('en', 'errorMessages.invalidAddress', { address: 'Coburg' });
    expect(result).toBe('I can\'t find this address, Coburg or anything close to it. Can you please provide a different address or POI?');
  });
});