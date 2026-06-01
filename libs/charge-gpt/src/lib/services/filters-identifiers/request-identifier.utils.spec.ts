import { identifyOperatorNameInRequest } from './request-identifier.utils';

describe('Request identifers utility functions', () => {
  describe('identifyOperatorNameInRequest', () => {
    it('should detect operator name regardless of the presence of special characters', () => {
      expect(identifyOperatorNameInRequest('Fastned', 'FRK')).toBe(
        'Fastned'
      );
      expect(identifyOperatorNameInRequest('Acea Innovation Srl', 'FRK')).toBe('Acea Innovation S.r.l.');
      expect(identifyOperatorNameInRequest('McDonalds', 'FRK')).toBe(undefined);
      expect(identifyOperatorNameInRequest('IBIL', 'FRK')).toBe('IBIL Gestor de Carga de VE S.A.');
      expect(identifyOperatorNameInRequest('REWE', 'FRK')).toBe(undefined);
      expect(identifyOperatorNameInRequest('BS Energy', 'FRK')).toBe('BS|ENERGY');
      expect(identifyOperatorNameInRequest('Dortmunder Energie- und Wasserversorgung', 'FRK')).toBe('Dortmunder Energie- und Wasserversorgung GmbH');
    });
  });
});
