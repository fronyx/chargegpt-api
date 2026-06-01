import { validateVerificationRequest } from './verification-utils.service';
jest.mock('@fronyx/configurations', () => ({
  ...(jest.requireActual('@fronyx/configurations') as any),
  configService: {
    getWhatsappWebhookVerifyToken: () => 'meatyhamhock',
  },
}));

describe('VerificationUtilsService', () => {
  describe('validateVerificationRequest', () => {
    it('should throw an error if params is falsy', () => {
      expect(() => validateVerificationRequest(null)).toThrowError(
        'Invalid verification query params'
      );
    });

    it('should return challenge value if all required properties are present', () => {
      const params = {
        'hub.mode': 'subscribe',
        'hub.verify_token': 'meatyhamhock',
        'hub.challenge': '1234',
      };

      expect(validateVerificationRequest(params)).toBe(1234);
    });
  });
});
