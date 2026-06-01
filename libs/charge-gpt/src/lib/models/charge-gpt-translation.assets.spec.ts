import {
  generateAddressInformationText,
  generateSpeedInfoText,
  generateSuggestionText,
  getChargeGptRecommendationText,
  noChargePointsAvailable,
  noChargePointsInDB,
} from './charge-gpt-translation.assets';
import { format } from 'date-fns';

const generateMockConversationHistory = {
  language: 'de',
  clientTimestamp: Date.now(),
  timezoneOffset: 0,
  getData: (
    power_type?: string,
    operator_name?: string,
    address?: string,
    connector_type?: string
  ) => ({
    power_type: 'both',
    operator_name: 'all',
    address: 'someAddress',
    date_time: new Date(),
  }),
  getMinPower: () => ({
    min_power: 0,
  }),
  getMaxPower: () => ({
    max_power: 500,
  }),
  getOperatorName: () => ({
    operator_name: 'all',
  }),
  getRequestConnectorTypeValue: () => ({
    connector_type: undefined,
  }),
  getProcessedDateTime: () => format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
  getPowerType: () => ({
    power_type: 'both',
  }),
  getConnectorType: () => ({
    connector_type: '',
  }),
  getAddress: () => ({
    address: 'someAddress',
  }),
};

describe('generate text', () => {
  describe('generate error message for no locations in elasticsearch', () => {
    describe('when there is no address, no power type and no operator name', () => {
      describe('when language is German', () => {
        const message = noChargePointsInDB(
          generateMockConversationHistory as any,
          false
        );

        it('should return a message with the German text', () => {
          expect(message).toContain(
            'Ich konnte keine Ladestation in der Nähe von dir finden. Du könntest es an einem anderen Ort oder zu einer anderen Zeit versuchen.'
          );
        });
      });

      describe('when language is English', () => {
        const message = noChargePointsInDB(
          {
            ...generateMockConversationHistory,
            language: 'en',
          } as any,
          false
        );

        it('should return a message with the English text', () => {
          expect(message).toContain(
            // eslint-disable-next-line quotes
            "I couldn't find any charging stations around you. You could however try again at a different place and time."
          );
        });
      });
    });

    describe('when there is no address, no power type and operator name is EWE', () => {
      describe('when language is German', () => {
        const message = noChargePointsInDB(
          {
            ...generateMockConversationHistory,
            getData: () => ({
              ...generateMockConversationHistory.getData(),
              operator_name: 'EWE',
            }),
          } as any,
          false
        );

        it('should return a message with the German text and operator name EWE', () => {
          expect(message).toContain(
            'Ich konnte keine EWE Ladestation in der Nähe von dir finden. Du könntest versuchen alle Ladestationsbetreiber zu durchsuchen.'
          );
        });
      });

      describe('when language is English', () => {
        const message = noChargePointsInDB(
          {
            ...generateMockConversationHistory,
            language: 'en',
            getData: () => ({
              ...generateMockConversationHistory.getData(),
              operator_name: 'EWE',
            }),
          } as any,
          false
        );

        it('should return a message with the English text and operator name EWE', () => {
          expect(message).toContain(
            // eslint-disable-next-line quotes
            "I couldn't find any EWE charging stations around you. You could however try again searching for all charge point operators."
          );
        });
      });
    });

    describe('when there is no address, power type is DC and no operator name', () => {
      describe('when language is German', () => {
        const message = noChargePointsInDB(
          {
            ...generateMockConversationHistory,
            getData: () => ({
              ...generateMockConversationHistory.getData(),
              power_type: 'DC',
            }),
          } as any,
          false
        );

        it('should return a message with the German text and power type DC', () => {
          expect(message).toContain(
            'Ich konnte keine DC Ladestation in der Nähe von dir finden. Du könntest es mit einer anderen Ladegeschwindigkeit versuchen.'
          );
        });
      });

      describe('when language is English', () => {
        const message = noChargePointsInDB(
          {
            ...generateMockConversationHistory,
            language: 'en',
            getData: () => ({
              ...generateMockConversationHistory.getData(),
              power_type: 'DC',
            }),
          } as any,
          false
        );

        it('should return a message with the English text and power type DC', () => {
          expect(message).toContain(
            // eslint-disable-next-line quotes
            "I couldn't find any DC charging stations around you. You could however try again with any charging speed."
          );
        });
      });
    });

    describe('when there is no address, power type is DC and operator name is EWE', () => {
      describe('when language is German', () => {
        const message = noChargePointsInDB(
          {
            ...generateMockConversationHistory,
            getData: () => ({
              ...generateMockConversationHistory.getData(),
              power_type: 'DC',
              operator_name: 'EWE',
            }),
          } as any,
          false
        );

        it('should return a message with the German text, power type DC and operator name EWE', () => {
          expect(message).toContain(
            'Ich konnte keine DC EWE Ladestation in der Nähe von dir finden. Du könntest versuchen alle Ladestationsbetreiber zu durchsuchen.'
          );
        });
      });

      describe('when language is English', () => {
        const message = noChargePointsInDB(
          {
            ...generateMockConversationHistory,
            language: 'en',
            getData: () => ({
              ...generateMockConversationHistory.getData(),
              power_type: 'DC',
              operator_name: 'EWE',
            }),
          } as any,
          false
        );

        it('should return a message with the English text, power type DC and operator name EWE', () => {
          expect(message).toContain(
            // eslint-disable-next-line quotes
            "I couldn't find any DC EWE charging stations around you. You could however try again searching for all charge point operators."
          );
        });
      });
    });

    describe('when there is an address, power type is DC and operator name is EWE', () => {
      const messageDe = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'EWE',
            address: 'someAddress',
          }),
        } as any,
        false
      );

      it('should return a message with the German text, power type DC, operator name EWE and address', () => {
        expect(messageDe).toContain(
          'Ich konnte keine schnellen EWE Ladestation in der Nähe von someAddress finden. Du könntest versuchen alle Ladestationsbetreiber zu durchsuchen.'
        );
      });

      const messageEn = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'en',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'EWE',
            address: 'someAddress',
          }),
        } as any,
        false
      );

      it('should return a message with the English text, power type DC, operator name EWE and address', () => {
        expect(messageEn).toContain(
          // eslint-disable-next-line quotes
          "I couldn't find any fast EWE charging stations around someAddress. You could however try again searching for all charge point operators."
        );
      });

      const messageEs = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'es',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'EWE',
            address: 'someAddress',
          }),
        } as any,
        false
      );

      it('should return a message with the Spanish text, power type DC, operator name EWE and address', () => {
        expect(messageEs).toContain(
          'No pude encontrar ninguna rápidos EWE estación de carga alrededor de someAddress. No obstante, podrías intentar nuevamente buscando todos los operadores de puntos de carga.'
        );
      });

      const messageFr = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'fr',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'EWE',
            address: 'someAddress',
          }),
        } as any,
        false
      );

      it('should return a message with the French text, power type DC, operator name EWE and address', () => {
        expect(messageFr).toContain(
          // eslint-disable-next-line quotes
          "Je n'ai trouvé aucune bornes rapides EWE station de recharge autour de someAddress. Cependant, vous pourriez essayer à nouveau en recherchant tous les opérateurs de points de charge."
        );
      });
      const messagePt = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'pt',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'EWE',
            address: 'someAddress',
          }),
        } as any,
        false
      );

      it('should return a message with the Portuguese text, power type DC, operator name EWE and address', () => {
        expect(messagePt).toContain(
          'Não consegui encontrar nenhum posto de carregamento rápidos EWE em torno de someAddress. No entanto, pode tentar novamente procurando por todos os operadores de postos de carregamento.'
        );
      });
    });

    describe('when there is an address, no power type and no operator name', () => {
      describe('when language is German', () => {
        const message = noChargePointsInDB(
          {
            ...generateMockConversationHistory,
            getData: () => ({
              ...generateMockConversationHistory.getData(),
              address: 'someAddress',
            }),
          } as any,
          false
        );

        it('should return a message with the German text and address', () => {
          expect(message).toContain(
            'Ich konnte keine Ladestation in der Nähe von someAddress finden. Du könntest es an einem anderen Ort oder zu einer anderen Zeit versuchen.'
          );
        });
      });

      describe('when language is English', () => {
        const message = noChargePointsInDB(
          {
            ...generateMockConversationHistory,
            language: 'en',
            getData: () => ({
              ...generateMockConversationHistory.getData(),
              address: 'someAddress',
            }),
          } as any,
          false
        );

        it('should return a message with the English text and address', () => {
          expect(message).toContain(
            // eslint-disable-next-line quotes
            "I couldn't find any charging stations around someAddress. You could however try again at a different place and time."
          );
        });
      });
    });

    describe('when there is an address, power type is DC and no operator name', () => {
      describe('when language is German', () => {
        const message = noChargePointsInDB(
          {
            ...generateMockConversationHistory,
            getData: () => ({
              ...generateMockConversationHistory.getData(),
              power_type: 'DC',
              address: 'someAddress',
            }),
          } as any,
          false
        );

        it('should return a message with the German text and power type DC and address', () => {
          expect(message).toContain(
            'Ich konnte keine DC Ladestation in der Nähe von someAddress finden. Du könntest es mit einer anderen Ladegeschwindigkeit versuchen.'
          );
        });
      });

      describe('when language is English', () => {
        const message = noChargePointsInDB(
          {
            ...generateMockConversationHistory,
            language: 'en',
            getData: () => ({
              ...generateMockConversationHistory.getData(),
              power_type: 'DC',
              address: 'someAddress',
            }),
          } as any,
          false
        );

        it('should return a message with the English text and power type DC and address', () => {
          expect(message).toContain(
            // eslint-disable-next-line quotes
            "I couldn't find any DC charging stations around someAddress. You could however try again with any charging speed."
          );
        });
      });
    });

    describe('when there is an address, no power type and operator name is EWE', () => {
      describe('when language is German', () => {
        const message = noChargePointsInDB(
          {
            ...generateMockConversationHistory,
            getData: () => ({
              ...generateMockConversationHistory.getData(),
              operator_name: 'EWE',
              address: 'someAddress',
            }),
          } as any,
          false
        );

        it('should return a message with the German text and operator name EWE and address', () => {
          expect(message).toContain(
            'Ich konnte keine EWE Ladestation in der Nähe von someAddress finden. Du könntest versuchen alle Ladestationsbetreiber zu durchsuchen.'
          );
        });
      });

      describe('when language is English', () => {
        const message = noChargePointsInDB(
          {
            ...generateMockConversationHistory,
            language: 'en',
            getData: () => ({
              ...generateMockConversationHistory.getData(),
              operator_name: 'EWE',
              address: 'someAddress',
            }),
          } as any,
          false
        );

        it('should return a message with the English text and operator name EWE and address', () => {
          expect(message).toContain(
            // eslint-disable-next-line quotes
            "I couldn't find any EWE charging stations around someAddress. You could however try again searching for all charge point operators."
          );
        });
      });
    });

    describe('when there is an address, power type is AC and operator name is EWE', () => {
      const messageDe = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'AC',
            operator_name: 'EWE',
            address: 'someAddress',
          }),
        } as any,
        false
      );

      it('should return a message with the German text, power type DC, operator name EWE and address', () => {
        expect(messageDe).toContain(
          'Ich konnte keine langsamen EWE Ladestation in der Nähe von someAddress finden. Du könntest versuchen alle Ladestationsbetreiber zu durchsuchen.'
        );
      });

      const messageEn = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'en',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'AC',
            operator_name: 'EWE',
            address: 'someAddress',
          }),
        } as any,
        false
      );

      it('should return a message with the English text, power type DC, operator name EWE and address', () => {
        expect(messageEn).toContain(
          // eslint-disable-next-line quotes
          "I couldn't find any slow EWE charging stations around someAddress. You could however try again searching for all charge point operators."
        );
      });

      const messageEs = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'es',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'AC',
            operator_name: 'EWE',
            address: 'someAddress',
          }),
        } as any,
        false
      );

      it('should return a message with the Spanish text, power type DC, operator name EWE and address', () => {
        expect(messageEs).toContain(
          'No pude encontrar ninguna lentas EWE estación de carga alrededor de someAddress. No obstante, podrías intentar nuevamente buscando todos los operadores de puntos de carga.'
        );
      });

      const messageFr = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'fr',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'AC',
            operator_name: 'EWE',
            address: 'someAddress',
          }),
        } as any,
        false
      );

      it('should return a message with the French text, power type DC, operator name EWE and address', () => {
        expect(messageFr).toContain(
          // eslint-disable-next-line quotes
          "Je n'ai trouvé aucune borne lente EWE station de recharge autour de someAddress. Cependant, vous pourriez essayer à nouveau en recherchant tous les opérateurs de points de charge."
        );
      });
      const messagePt = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'pt',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'AC',
            operator_name: 'EWE',
            address: 'someAddress',
          }),
        } as any,
        false
      );

      it('should return a message with the Portuguese text, power type DC, operator name EWE and address', () => {
        expect(messagePt).toContain(
          'Não consegui encontrar nenhum posto de carregamento lento EWE em torno de someAddress. No entanto, pode tentar novamente procurando por todos os operadores de postos de carregamento.'
        );
      });
    });

    describe('when there is an address, operator name is EWE with at least 50 min power type', () => {
      const messageDe = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
            address: 'someAddress',
            isKwPowerRequested: true,
            min_power: 50,
            max_power: 400,
          }),
        } as any,
        false
      );

      it('should return a message with the German text, power type DC, operator name EWE and address', () => {
        expect(messageDe).toContain(
          'Ich konnte keine EWE mit mindestens 50kW Ladestation in der Nähe von someAddress finden. Du könntest versuchen alle Ladestationsbetreiber zu durchsuchen.'
        );
      });

      const messageEn = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'en',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
            address: 'someAddress',
            isKwPowerRequested: true,
            min_power: 50,
            max_power: 400,
          }),
        } as any,
        false
      );

      it('should return a message with the English text, power type DC, operator name EWE and address', () => {
        expect(messageEn).toContain(
          // eslint-disable-next-line quotes
          "I couldn't find any with at least 50kW EWE charging stations around someAddress. You could however try again searching for all charge point operators."
        );
      });

      const messageEs = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'es',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
            address: 'someAddress',
            isKwPowerRequested: true,
            min_power: 50,
            max_power: 400,
          }),
        } as any,
        false
      );

      it('should return a message with the Spanish text, power type DC, operator name EWE and address', () => {
        expect(messageEs).toContain(
          'No pude encontrar ninguna estación de carga EWE con al menos 50kW alrededor de someAddress. No obstante, podrías intentar nuevamente buscando todos los operadores de puntos de carga.'
        );
      });

      const messageFr = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'fr',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
            address: 'someAddress',
            isKwPowerRequested: true,
            min_power: 50,
            max_power: 400,
          }),
        } as any,
        false
      );

      it('should return a message with the French text, power type DC, operator name EWE and address', () => {
        expect(messageFr).toContain(
          // eslint-disable-next-line quotes
          "Je n'ai trouvé aucune EWE d'au moins 50kW station de recharge autour de someAddress. Cependant, vous pourriez essayer à nouveau en recherchant tous les opérateurs de points de charge."
        );
      });
      const messagePt = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'pt',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
            address: 'someAddress',
            isKwPowerRequested: true,
            min_power: 50,
            max_power: 400,
          }),
        } as any,
        false
      );

      it('should return a message with the Portuguese text, power type DC, operator name EWE and address', () => {
        expect(messagePt).toContain(
          'Não consegui encontrar nenhum posto de carregamento EWE com pelo menos 50kW em torno de someAddress. No entanto, pode tentar novamente procurando por todos os operadores de postos de carregamento.'
        );
      });
    });

    describe('when there is an address, operator name is EWE with max 100 power type', () => {
      const messageDe = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
            address: 'someAddress',
            isKwPowerRequested: true,
            min_power: 0,
            max_power: 100,
          }),
        } as any,
        false
      );

      it('should return a message with the German text, power type DC, operator name EWE and address', () => {
        expect(messageDe).toContain(
          'Ich konnte keine EWE mit maximal 100kW Ladestation in der Nähe von someAddress finden. Du könntest versuchen alle Ladestationsbetreiber zu durchsuchen.'
        );
      });

      const messageEn = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'en',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
            address: 'someAddress',
            isKwPowerRequested: true,
            min_power: 0,
            max_power: 100,
          }),
        } as any,
        false
      );

      it('should return a message with the English text, power type DC, operator name EWE and address', () => {
        expect(messageEn).toContain(
          // eslint-disable-next-line quotes
          "I couldn't find any with maximum 100kW EWE charging stations around someAddress. You could however try again searching for all charge point operators."
        );
      });

      const messageEs = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'es',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
            address: 'someAddress',
            isKwPowerRequested: true,
            min_power: 0,
            max_power: 100,
          }),
        } as any,
        false
      );

      it('should return a message with the Spanish text, power type DC, operator name EWE and address', () => {
        expect(messageEs).toContain(
          'No pude encontrar ninguna estación de carga EWE con un máximo de 100kW alrededor de someAddress. No obstante, podrías intentar nuevamente buscando todos los operadores de puntos de carga.'
        );
      });

      const messageFr = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'fr',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
            address: 'someAddress',
            isKwPowerRequested: true,
            min_power: 0,
            max_power: 100,
          }),
        } as any,
        false
      );

      it('should return a message with the French text, power type DC, operator name EWE and address', () => {
        expect(messageFr).toContain(
          // eslint-disable-next-line quotes
          "Je n'ai trouvé aucune EWE avec un maximum de 100kW station de recharge autour de someAddress. Cependant, vous pourriez essayer à nouveau en recherchant tous les opérateurs de points de charge."
        );
      });
      const messagePt = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'pt',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
            address: 'someAddress',
            isKwPowerRequested: true,
            min_power: 0,
            max_power: 100,
          }),
        } as any,
        false
      );

      it('should return a message with the Portuguese text, power type DC, operator name EWE and address', () => {
        expect(messagePt).toContain(
          'Não consegui encontrar nenhum posto de carregamento EWE com um máximo de 100kW em torno de someAddress. No entanto, pode tentar novamente procurando por todos os operadores de postos de carregamento.'
        );
      });
    });

    describe('when there is an address, operator name is EWE with exact 30kW power type', () => {
      const messageDe = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
            address: 'someAddress',
            isKwPowerRequested: true,
            min_power: 30,
            max_power: 30,
          }),
        } as any,
        false
      );

      it('should return a message with the German text, power type DC, operator name EWE and address', () => {
        expect(messageDe).toContain(
          'Ich konnte keine EWE mit 30kW Ladestation in der Nähe von someAddress finden. Du könntest versuchen alle Ladestationsbetreiber zu durchsuchen.'
        );
      });

      const messageEn = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'en',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
            address: 'someAddress',
            isKwPowerRequested: true,
            min_power: 30,
            max_power: 30,
          }),
        } as any,
        false
      );

      it('should return a message with the English text, power type DC, operator name EWE and address', () => {
        expect(messageEn).toContain(
          // eslint-disable-next-line quotes
          "I couldn't find any with 30kW EWE charging stations around someAddress. You could however try again searching for all charge point operators."
        );
      });

      const messageEs = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'es',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
            address: 'someAddress',
            isKwPowerRequested: true,
            min_power: 30,
            max_power: 30,
          }),
        } as any,
        false
      );

      it('should return a message with the Spanish text, power type DC, operator name EWE and address', () => {
        expect(messageEs).toContain(
          'No pude encontrar ninguna estación de carga EWE con 30kW alrededor de someAddress. No obstante, podrías intentar nuevamente buscando todos los operadores de puntos de carga.'
        );
      });

      const messageFr = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'fr',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
            address: 'someAddress',
            isKwPowerRequested: true,
            min_power: 30,
            max_power: 30,
          }),
        } as any,
        false
      );

      it('should return a message with the French text, power type DC, operator name EWE and address', () => {
        expect(messageFr).toContain(
          // eslint-disable-next-line quotes
          "Je n'ai trouvé aucune EWE de 30kW station de recharge autour de someAddress. Cependant, vous pourriez essayer à nouveau en recherchant tous les opérateurs de points de charge."
        );
      });

      const messagePt = noChargePointsInDB(
        {
          ...generateMockConversationHistory,
          language: 'pt',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
            address: 'someAddress',
            isKwPowerRequested: true,
            min_power: 30,
            max_power: 30,
          }),
        } as any,
        false
      );

      it('should return a message with the Portuguese text, power type DC, operator name EWE and address', () => {
        expect(messagePt).toContain(
          'Não consegui encontrar nenhum posto de carregamento EWE com 30kW em torno de someAddress. No entanto, pode tentar novamente procurando por todos os operadores de postos de carregamento.'
        );
      });
    });
  });

  describe('generate error message for no locations available', () => {
    describe('when date time is current date time', () => {
      const time = format(new Date(), 'HH:mm');
      const date = format(new Date(), 'dd.MM.yyyy');

      describe('when there is no address, no power type and no operator name', () => {
        describe('when language is German', () => {
          const message = noChargePointsAvailable(
            generateMockConversationHistory as any,
            1,
            false
          );

          it('should return a message with the German text', () => {
            expect(message).toContain(
              `Von 1 Ladepunkten in der Nähe von dir ist am ${date} um ${time} keine verfügbar. Du könntest es an einem anderen Ort oder zu einer anderen Zeit versuchen.`
            );
          });
        });

        describe('when language is English', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              language: 'en',
            } as any,
            1,
            false
          );

          it('should return a message with English text', () => {
            expect(message).toContain(
              `I found 1 charging stations around you but none of them is available at ${new Date()}. You could however try again at a different place and time.`
            );
          });
        });
      });

      describe('when there is no address, no power type and operator name is EWE', () => {
        describe('when language is German', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                operator_name: 'EWE',
              }),
            } as any,
            1,
            false
          );
          it('should return a message with the German text and operator name EWE', () => {
            expect(message).toContain(
              `Von 1 EWE Ladepunkten in der Nähe von dir ist am ${date} um ${time} keine verfügbar. Du könntest versuchen alle Ladestationsbetreiber zu durchsuchen.`
            );
          });
        });

        describe('when language is English', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              language: 'en',
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                operator_name: 'EWE',
              }),
            } as any,
            1,
            false
          );
          it('should return a message with the English text and operator name EWE', () => {
            expect(message).toBe(
              `I found 1 EWE charging stations around you but none of them is available at ${new Date()}. You could however try again searching for all charge point operators.`
            );
          });
        });
      });

      describe('when there is no address, power type is DC and no operator name', () => {
        describe('when language is German', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                power_type: 'DC',
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the German text and power type DC', () => {
            expect(message).toContain(
              `Von 1 DC Ladepunkten in der Nähe von dir ist am ${date} um ${time} keine verfügbar. Du könntest es mit einer anderen Ladegeschwindigkeit versuchen.`
            );
          });
        });

        describe('when language is English', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              language: 'en',
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                power_type: 'DC',
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the English text and power type DC', () => {
            expect(message).toContain(
              `I found 1 DC charging stations around you but none of them is available at ${new Date()}. You could however try again with any charging speed.`
            );
          });
        });
      });

      describe('when there is no address, power type is DC and operator name is EWE', () => {
        describe('when language is German', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                power_type: 'DC',
                operator_name: 'EWE',
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the German text, power type DC and operator name EWE', () => {
            expect(message).toContain(
              `Von 1 DC EWE Ladepunkten in der Nähe von dir ist am ${date} um ${time} keine verfügbar. Du könntest versuchen alle Ladestationsbetreiber zu durchsuchen.`
            );
          });
        });

        describe('when language is English', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              language: 'en',
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                power_type: 'DC',
                operator_name: 'EWE',
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the English text, power type DC and operator name EWE', () => {
            expect(message).toContain(
              `I found 1 DC EWE charging stations around you but none of them is available at ${new Date()}. You could however try again searching for all charge point operators.`
            );
          });
        });
      });

      describe('when there is an address, power type is DC and operator name is EWE', () => {
        describe('when language is German', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                power_type: 'DC',
                operator_name: 'EWE',
                address: 'someAddress',
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the German text, power type DC, operator name EWE and address', () => {
            expect(message).toContain(
              `Von 1 DC EWE Ladepunkten in der Nähe von someAddress ist am ${date} um ${time} keine verfügbar. Du könntest versuchen alle Ladestationsbetreiber zu durchsuchen.`
            );
          });
        });

        describe('when language is English', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              language: 'en',
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                power_type: 'DC',
                operator_name: 'EWE',
                address: 'someAddress',
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the English text, power type DC, operator name EWE and address', () => {
            expect(message).toContain(
              `I found 1 DC EWE charging stations around someAddress but none of them is available at ${new Date()}. You could however try again searching for all charge point operators.`
            );
          });
        });
      });

      describe('when there is an address, no power type and no operator name', () => {
        describe('when language is German', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                address: 'someAddress',
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the German text and address', () => {
            expect(message).toContain(
              `Von 1 Ladepunkten in der Nähe von someAddress ist am ${date} um ${time} keine verfügbar. Du könntest es an einem anderen Ort oder zu einer anderen Zeit versuchen.`
            );
          });
        });

        describe('when language is English', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              language: 'en',
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                address: 'someAddress',
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the English text and address', () => {
            expect(message).toContain(
              `I found 1 charging stations around someAddress but none of them is available at ${new Date()}. You could however try again at a different place and time.`
            );
          });
        });
      });

      describe('when there is an address, power type is DC and no operator name', () => {
        describe('when language is German', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                power_type: 'DC',
                address: 'someAddress',
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the German text, power type DC and address', () => {
            expect(message).toContain(
              `Von 1 DC Ladepunkten in der Nähe von someAddress ist am ${date} um ${time} keine verfügbar. Du könntest es mit einer anderen Ladegeschwindigkeit versuchen.`
            );
          });
        });

        describe('when language is English', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              language: 'en',
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                power_type: 'DC',
                address: 'someAddress',
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the English text, power type DC and address', () => {
            expect(message).toContain(
              `I found 1 DC charging stations around someAddress but none of them is available at ${new Date()}. You could however try again with any charging speed.`
            );
          });
        });
      });

      describe('when there is an address, no power type and operator name is EWE', () => {
        describe('when language is German', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                operator_name: 'EWE',
                address: 'someAddress',
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the German text, operator name EWE and address', () => {
            expect(message).toContain(
              `Von 1 EWE Ladepunkten in der Nähe von someAddress ist am ${date} um ${time} keine verfügbar. Du könntest versuchen alle Ladestationsbetreiber zu durchsuchen.`
            );
          });
        });

        describe('when language is English', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              language: 'en',
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                operator_name: 'EWE',
                address: 'someAddress',
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the English text, operator name EWE and address', () => {
            expect(message).toContain(
              `I found 1 EWE charging stations around someAddress but none of them is available at ${new Date()}. You could however try again searching for all charge point operators.`
            );
          });
        });
      });
    });

    describe('when date time is 1 hour ahead', () => {
      const oneHourAhead = new Date();
      oneHourAhead.setHours(oneHourAhead.getHours() + 1);

      const time = format(oneHourAhead, 'HH:mm');
      const date = format(oneHourAhead, 'dd.MM.yyyy');

      describe('when there is no address, no power type and no operator name', () => {
        describe('when language is German', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                date_time: oneHourAhead,
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the German text', () => {
            expect(message).toContain('Von 1 Ladepunkten');
            expect(message).toContain(
              `Nähe von dir ist am ${date} um ${time} vorraussichtlich`
            );
            expect(message).toContain(
              'Du könntest es an einem anderen Ort oder zu einer anderen Zeit versuchen.'
            );
          });
        });

        describe('when language is English', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              language: 'en',
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                date_time: oneHourAhead,
              }),
            } as any,
            1,
            false
          );

          it('should return a message with English text with 1 hour ahead than current time', () => {
            expect(message).toContain('1 charging stations');
            expect(message).toContain('around you');
            expect(message).toContain(
              `predicted to be available at ${oneHourAhead}.`
            );
            expect(message).toContain(
              'You could however try again at a different place and time.'
            );
          });
        });
      });

      describe('when there is no address, no power type and operator name is EWE', () => {
        describe('when language is German', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                operator_name: 'EWE',
                date_time: oneHourAhead,
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the German text, operator name EWE and time is 1 hour ahead', () => {
            expect(message).toContain('Von 1 EWE Ladepunkten');
            expect(message).toContain(
              `Nähe von dir ist am ${date} um ${time} vorraussichtlich`
            );
            expect(message).toContain(
              'Du könntest versuchen alle Ladestationsbetreiber zu durchsuchen.'
            );
          });
        });

        describe('when language is English', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              language: 'en',
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                operator_name: 'EWE',
                date_time: oneHourAhead,
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the English text, operator name EWE and time is 1 hour ahead', () => {
            expect(message).toContain('1 EWE charging stations');
            expect(message).toContain('around you');
            expect(message).toContain(
              `predicted to be available at ${oneHourAhead}`
            );
            expect(message).toContain(
              'You could however try again searching for all charge point operators.'
            );
          });
        });
      });

      describe('when there is no address, power type is DC and no operator name', () => {
        describe('when language is German', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                power_type: 'DC',
                date_time: oneHourAhead,
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the German text, power type DC and time is 1 hour ahead', () => {
            expect(message).toContain('Von 1 DC Ladepunkten');
            expect(message).toContain(
              `Nähe von dir ist am ${date} um ${time} vorraussichtlich`
            );
            expect(message).toContain(
              'Du könntest es mit einer anderen Ladegeschwindigkeit versuchen.'
            );
          });
        });

        describe('when language is English', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              language: 'en',
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                power_type: 'DC',
                date_time: oneHourAhead,
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the English text, power type DC and time is 1 hour ahead', () => {
            expect(message).toContain('1 DC charging stations');
            expect(message).toContain('around you');
            expect(message).toContain(
              `predicted to be available at ${oneHourAhead}`
            );
            expect(message).toContain(
              'You could however try again with any charging speed.'
            );
          });
        });
      });

      describe('when there is no address, power type is DC and operator name is EWE', () => {
        describe('when language is German', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                power_type: 'DC',
                operator_name: 'EWE',
                date_time: oneHourAhead,
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the German text, power type DC, operator name EWE and time is 1 hour ahead', () => {
            expect(message).toContain('Von 1 DC EWE Ladepunkten');
            expect(message).toContain(
              `Nähe von dir ist am ${date} um ${time} vorraussichtlich`
            );
            expect(message).toContain(
              'Du könntest versuchen alle Ladestationsbetreiber zu durchsuchen.'
            );
          });
        });

        describe('when language is English', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              language: 'en',
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                power_type: 'DC',
                operator_name: 'EWE',
                date_time: oneHourAhead,
              }),
            } as any,
            1,
            false
          );
          it('should return a message with the English text, power type DC, operator name EWE and time is 1 hour ahead', () => {
            expect(message).toContain('1 DC EWE charging stations');
            expect(message).toContain('around you');
            expect(message).toContain(
              `predicted to be available at ${oneHourAhead}`
            );
            expect(message).toContain(
              'You could however try again searching for all charge point operators.'
            );
          });
        });
      });

      describe('when there is an address, power type is DC and operator name is EWE', () => {
        describe('when language is German', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                power_type: 'DC',
                operator_name: 'EWE',
                address: 'someAddress',
                date_time: oneHourAhead,
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the German text, power type DC, operator name EWE, address and time is 1 hour ahead', () => {
            expect(message).toContain('Von 1 DC EWE Ladepunkten');
            expect(message).toContain(
              `Nähe von someAddress ist am ${date} um ${time} vorraussichtlich`
            );
            expect(message).toContain(
              'Du könntest versuchen alle Ladestationsbetreiber zu durchsuchen.'
            );
          });
        });

        describe('when language is English', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              language: 'en',
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                power_type: 'DC',
                operator_name: 'EWE',
                address: 'someAddress',
                date_time: oneHourAhead,
              }),
            } as any,
            1,
            false
          );
          it('should return a message with the English text, power type DC, operator name EWE, address and time is 1 hour ahead', () => {
            expect(message).toContain('1 DC EWE charging stations');
            expect(message).toContain('around someAddress');
            expect(message).toContain(
              `predicted to be available at ${oneHourAhead}`
            );
            expect(message).toContain(
              'You could however try again searching for all charge point operators.'
            );
          });
        });
      });

      describe('when there is an address, no power type and no operator name', () => {
        describe('when language is German', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                address: 'someAddress',
                date_time: oneHourAhead,
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the German text, address and time is 1 hour ahead', () => {
            expect(message).toContain('Von 1 Ladepunkten');
            expect(message).toContain(
              `Nähe von someAddress ist am ${date} um ${time} vorraussichtlich`
            );
            expect(message).toContain(
              'Du könntest es an einem anderen Ort oder zu einer anderen Zeit versuchen.'
            );
          });
        });

        describe('when language is English', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              language: 'en',
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                address: 'someAddress',
                date_time: oneHourAhead,
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the English text, address and time is 1 hour ahead', () => {
            expect(message).toContain('1 charging stations');
            expect(message).toContain('around someAddress');
            expect(message).toContain(
              `predicted to be available at ${oneHourAhead}`
            );
            expect(message).toContain(
              'You could however try again at a different place and time.'
            );
          });
        });
      });

      describe('when there is an address, power type is DC and no operator name', () => {
        describe('when language is German', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                power_type: 'DC',
                address: 'someAddress',
                date_time: oneHourAhead,
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the German text, power type DC, address and time is 1 hour ahead', () => {
            expect(message).toContain('Von 1 DC Ladepunkten');
            expect(message).toContain(
              `Nähe von someAddress ist am ${date} um ${time} vorraussichtlich`
            );
            expect(message).toContain(
              'Du könntest es mit einer anderen Ladegeschwindigkeit versuchen.'
            );
          });
        });

        describe('when language is English', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              language: 'en',
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                power_type: 'DC',
                address: 'someAddress',
                date_time: oneHourAhead,
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the English text, power type DC, address and time is 1 hour ahead', () => {
            expect(message).toContain('1 DC charging stations');
            expect(message).toContain('around someAddress');
            expect(message).toContain(
              `predicted to be available at ${oneHourAhead}`
            );
            expect(message).toContain(
              'You could however try again with any charging speed.'
            );
          });
        });
      });

      describe('when there is an address, no power type and operator name is EWE', () => {
        describe('when language is German', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                operator_name: 'EWE',
                address: 'someAddress',
                date_time: oneHourAhead,
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the German text, operator name EWE, address and time is 1 hour ahead', () => {
            expect(message).toContain('Von 1 EWE Ladepunkten');
            expect(message).toContain(
              `Nähe von someAddress ist am ${date} um ${time} vorraussichtlich`
            );
            expect(message).toContain(
              'Du könntest versuchen alle Ladestationsbetreiber zu durchsuchen.'
            );
          });
        });

        describe('when language is English', () => {
          const message = noChargePointsAvailable(
            {
              ...generateMockConversationHistory,
              language: 'en',
              getData: () => ({
                ...generateMockConversationHistory.getData(),
                operator_name: 'EWE',
                address: 'someAddress',
                date_time: oneHourAhead,
              }),
            } as any,
            1,
            false
          );

          it('should return a message with the English text, operator name EWE, address and time is 1 hour ahead', () => {
            expect(message).toContain('1 EWE charging stations');
            expect(message).toContain('around someAddress');
            expect(message).toContain(
              `predicted to be available at ${oneHourAhead}`
            );
            expect(message).toContain(
              'You could however try again searching for all charge point operators.'
            );
          });
        });
      });
    });
  });

  describe('generate recommendation text', () => {
    describe('when no power type and operator name mentioned', () => {
      const time = format(new Date(), 'HH:mm');
      describe('when language is English', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'en',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'all',
          }),
        } as any);

        const timeAMPM = new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });

        it('should return a message with English text', () => {
          expect(message).toContain(
            `Based on current availability of charge points at ${timeAMPM}, I recommend:`
          );
        });
      });

      describe('when language is German', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'all',
          }),
        } as any);

        it('should return a message with German text', () => {
          expect(message).toContain(
            `Basierend auf der aktuellen Verfügbarkeit von Ladepunkten um ${time} Uhr empfehle ich:`
          );
        });
      });

      describe('when language is Spanish', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'es',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'all',
          }),
        } as any);

        it('should return a message with Spanish text', () => {
          expect(message).toContain(
            `Basándome en la disponibilidad actual de puntos de recarga a las ${time}, recomiendo:`
          );
        });
      });

      describe('when language is French', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'fr',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'all',
          }),
        } as any);

        it('should return a message with French text', () => {
          expect(message).toContain(
            `En fonction de la disponibilité actuelle des points de recharge à ${time} heures, je recommande:`
          );
        });
      });

      describe('when language is Portuguese', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'pt',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'all',
          }),
        } as any);

        it('should return a message with Portuguse text', () => {
          expect(message).toContain(
            `Com base na atual disponibilidade de postos de carregamento às ${time}, recomendo esta opção:`
          );
        });
      });

      describe('when language is Czech', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'cz',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
          }),
        } as any);
        it('should return a message with Czech text', () => {
          expect(message).toContain('Na základě aktuální nabíjecích míst');
        });
      });
    });

    describe('when no power type and operator name is EWE', () => {
      const time = format(new Date(), 'HH:mm');
      describe('when language is English', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'en',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
          }),
        } as any);

        const timeAMPM = new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });

        it('should return a message with English text', () => {
          expect(message).toContain(
            `Based on current availability of EWE charge points at ${timeAMPM}, I recommend:`
          );
        });
      });

      describe('when language is German', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
          }),
        } as any);

        it('should return a message with German text', () => {
          expect(message).toContain(
            `Basierend auf der aktuellen Verfügbarkeit von EWE Ladepunkten um ${time} Uhr empfehle ich:`
          );
        });
      });

      describe('when language is Spanish', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'es',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
          }),
        } as any);

        it('should return a message with Spanish text', () => {
          expect(message).toContain(
            `Basándome en la disponibilidad actual de puntos de recarga EWE a las ${time}, recomiendo:`
          );
        });
      });

      describe('when language is French', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'fr',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
          }),
        } as any);

        it('should return a message with French text', () => {
          expect(message).toContain(
            `En fonction de la disponibilité actuelle des points de recharge EWE à ${time} heures, je recommande:`
          );
        });
      });

      describe('when language is Portuguese', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'pt',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'both',
            operator_name: 'EWE',
          }),
        } as any);

        it('should return a message with Portuguese text', () => {
          expect(message).toContain(
            `Com base na atual disponibilidade de postos de carregamento EWE às ${time}, recomendo esta opção:`
          );
        });
      });
    });

    describe('when power type is DC and operator name is not mentioned', () => {
      const time = format(new Date(), 'HH:mm');
      describe('when language is English', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'en',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'all',
          }),
        } as any);

        const timeAMPM = new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });

        it('should return a message with English text', () => {
          expect(message).toContain(
            `Based on current availability of fast charge points at ${timeAMPM}, I recommend:`
          );
        });
      });

      describe('when language is German', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'de',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'all',
          }),
        } as any);

        it('should return a message with German text', () => {
          expect(message).toContain(
            `Basierend auf der aktuellen Verfügbarkeit von schnellen Ladepunkten um ${time} Uhr empfehle ich:`
          );
        });
      });

      describe('when language is Spanish', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'es',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'all',
          }),
        } as any);

        it('should return a message with Spanish text', () => {
          expect(message).toContain(
            `Basándome en la disponibilidad actual de puntos de recarga rápidos a las ${time}, recomiendo:`
          );
        });
      });

      describe('when language is French', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'fr',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'all',
          }),
        } as any);

        it('should return a message with French text', () => {
          expect(message).toContain(
            `En fonction de la disponibilité actuelle des bornes rapides à ${time} heures, je recommande:`
          );
        });
      });

      describe('when language is Portuguese', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'pt',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'all',
          }),
        } as any);

        it('should return a message with Portuguese text', () => {
          expect(message).toContain(
            `Com base na atual disponibilidade de postos de carregamento rápidos às ${time}, recomendo esta opção:`
          );
        });
      });
    });

    describe('when power type is AC and operator name is not mentioned', () => {
      const time = format(new Date(), 'HH:mm');
      describe('when language is English', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'en',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'AC',
            operator_name: 'all',
          }),
        } as any);

        const timeAMPM = new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });

        it('should return a message with English text', () => {
          expect(message).toContain(
            `Based on current availability of slow charge points at ${timeAMPM}, I recommend:`
          );
        });
      });

      describe('when language is German', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'AC',
            operator_name: 'all',
          }),
        } as any);

        it('should return a message with German text', () => {
          expect(message).toContain(
            `Basierend auf der aktuellen Verfügbarkeit von langsamen Ladepunkten um ${time} Uhr empfehle ich:`
          );
        });
      });

      describe('when language is Spanish', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'es',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'AC',
            operator_name: 'all',
          }),
        } as any);

        it('should return a message with Spanish text', () => {
          expect(message).toContain(
            `Basándome en la disponibilidad actual de puntos de recarga lentos a las ${time}, recomiendo:`
          );
        });
      });

      describe('when language is French', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'fr',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'AC',
            operator_name: 'all',
          }),
        } as any);

        it('should return a message with French text', () => {
          expect(message).toContain(
            `En fonction de la disponibilité actuelle des bornes lentes à ${time} heures, je recommande:`
          );
        });
      });

      describe('when language is Portuguese', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'pt',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'AC',
            operator_name: 'all',
          }),
        } as any);

        it('should return a message with Portuguese text', () => {
          expect(message).toContain(
            `Com base na atual disponibilidade de postos de carregamento lentos às ${time}, recomendo esta opção:`
          );
        });
      });
    });

    describe('when power type is DC and operator name is EWE', () => {
      const time = format(new Date(), 'HH:mm');
      describe('when language is English', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'en',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'EWE',
          }),
        } as any);
        const timeAMPM = new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });

        it('should return a message with English text', () => {
          expect(message).toContain(
            `Based on current availability of fast EWE charge points at ${timeAMPM}, I recommend:`
          );
        });
      });

      describe('when language is German', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'de',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'EWE',
          }),
        } as any);

        it('should return a message with English text', () => {
          expect(message).toContain(
            `Basierend auf der aktuellen Verfügbarkeit von schnellen EWE Ladepunkten um ${time} Uhr empfehle ich:`
          );
        });
      });

      describe('when language is Spanish', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'es',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'EWE',
          }),
        } as any);

        it('should return a message with Spanish text', () => {
          expect(message).toContain(
            `Basándome en la disponibilidad actual de puntos de recarga rápidos EWE a las ${time}, recomiendo:`
          );
        });
      });

      describe('when language is French', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'fr',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'EWE',
          }),
        } as any);

        it('should return a message with French text', () => {
          expect(message).toContain(
            `En fonction de la disponibilité actuelle des bornes rapides EWE à ${time} heures, je recommande:`
          );
        });
      });

      describe('when language is Portuguese', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'pt',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'EWE',
          }),
        } as any);

        it('should return a message with Portuguese text', () => {
          expect(message).toContain(
            `Com base na atual disponibilidade de postos de carregamento rápidos EWE às ${time}, recomendo esta opção:`
          );
        });
      });
    });

    describe('when power type is AC and operator name is EWE', () => {
      const time = format(new Date(), 'HH:mm');
      describe('when language is English', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'en',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'AC',
            operator_name: 'EWE',
          }),
        } as any);

        const timeAMPM = new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });

        it('should return a message with English text', () => {
          expect(message).toContain(
            `Based on current availability of slow EWE charge points at ${timeAMPM}, I recommend:`
          );
        });
      });

      describe('when language is German', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'de',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'AC',
            operator_name: 'EWE',
          }),
        } as any);

        it('should return a message with German text', () => {
          expect(message).toContain(
            `Basierend auf der aktuellen Verfügbarkeit von langsamen EWE Ladepunkten um ${time} Uhr empfehle ich:`
          );
        });
      });

      describe('when language is Spanish', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'es',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'AC',
            operator_name: 'EWE',
          }),
        } as any);

        it('should return a message with Spanish text', () => {
          expect(message).toContain(
            `Basándome en la disponibilidad actual de puntos de recarga lentos EWE a las ${time}, recomiendo:`
          );
        });
      });

      describe('when language is French', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'fr',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'AC',
            operator_name: 'EWE',
          }),
        } as any);

        it('should return a message with French text', () => {
          expect(message).toContain(
            `En fonction de la disponibilité actuelle des bornes lentes EWE à ${time} heures, je recommande:`
          );
        });
      });

      describe('when language is Portuguese', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'pt',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'AC',
            operator_name: 'EWE',
          }),
        } as any);

        it('should return a message with Portuguese text', () => {
          expect(message).toContain(
            `Com base na atual disponibilidade de postos de carregamento lentos EWE às ${time}, recomendo esta opção:`
          );
        });
      });
    });

    describe('when powerkW is 50kW, operator name is EWE', () => {
      const time = format(new Date(), 'HH:mm');
      describe('when language is English', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'en',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'EWE',
            isKwPowerRequested: true,
            min_power: 50,
            max_power: 400,
          }),
        } as any);

        const timeAMPM = new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });

        it('should return a message with English text', () => {
          expect(message).toContain(
            `Based on current availability of fast EWE charge points at ${timeAMPM} with at least 50kW, I recommend:`
          );
        });
      });

      describe('when language is German', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'de',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'AC',
            operator_name: 'EWE',
            isKwPowerRequested: true,
            min_power: 50,
            max_power: 400,
          }),
        } as any);

        it('should return a message with German text', () => {
          expect(message).toContain(
            `Basierend auf der aktuellen Verfügbarkeit von langsamen EWE Ladepunkten um ${time} Uhr empfehle ich:`
          );
        });
      });

      describe('when language is Spanish', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'es',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'EWE',
            isKwPowerRequested: true,
            min_power: 50,
            max_power: 400,
          }),
        } as any);

        it('should return a message with Spanish text', () => {
          expect(message).toContain(
            `Basándome en la disponibilidad actual de puntos de recarga rápidos EWE con al menos 50kW a las ${time}, recomiendo:`
          );
        });
      });

      describe('when language is French', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'fr',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'EWE',
            isKwPowerRequested: true,
            min_power: 50,
            max_power: 400,
          }),
        } as any);

        it('should return a message with French text', () => {
          expect(message).toContain(
            `En fonction de la disponibilité actuelle des bornes rapides EWE d'au moins 50kW à ${time} heures, je recommande:`
          );
        });
      });

      describe('when language is Portuguese', () => {
        const message = getChargeGptRecommendationText({
          ...generateMockConversationHistory,
          language: 'pt',
          getData: () => ({
            ...generateMockConversationHistory.getData(),
            power_type: 'DC',
            operator_name: 'EWE',
            isKwPowerRequested: true,
            min_power: 50,
            max_power: 400,
          }),
        } as any);

        it('should return a message with Portuguese text', () => {
          expect(message).toContain(
            `Com base na atual disponibilidade de postos de carregamento rápidos EWE com pelo menos 50kW às ${time}, recomendo esta opção:`
          );
        });
      });
    });
  });
});

describe('generateSpeedInfoText', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('when min power is default 0, max power is default 500', () => {
    it('should not return undefined value', () => {
      const results = generateSpeedInfoText('en', 0, 500);
      expect(results).toBeUndefined();
    });
  });

  describe('when undefined min and max power', () => {
    it('should return undefined value', () => {
      const results = generateSpeedInfoText('en', undefined, undefined);
      expect(results).toBeUndefined();
    });
  });

  describe('when min and max power is not NaN', () => {
    it('should return undefined value', () => {
      const results = generateSpeedInfoText('en', NaN, NaN);
      expect(results).toBeUndefined();
    });
  });

  describe('when min and max power is null', () => {
    it('should return undefined value', () => {
      const results = generateSpeedInfoText('en', null, null);
      expect(results).toBeUndefined();
    });
  });

  describe('when min power is 30, max power 500', () => {
    it('should return a message with English text', () => {
      const results = generateSpeedInfoText('en', 30, 500);
      expect(results).toContain('with at least');
    });

    it('should return a message with German text', () => {
      const results = generateSpeedInfoText('de', 30, 500);
      expect(results).toContain('mit mindestens');
    });

    it('should return a message with Portuguese text', () => {
      const results = generateSpeedInfoText('pt', 30, 500);
      expect(results).toContain('com pelo menos');
    });

    it('should return a message with Czech text', () => {
      const results = generateSpeedInfoText('cz', 30, 500);
      expect(results).toContain('s výkonem alespoň');
    });

    it('should return a message with Spanish text', () => {
      const results = generateSpeedInfoText('es', 30, 500);
      expect(results).toContain('con al menos');
    });

    it('should return a message with French text', () => {
      const results = generateSpeedInfoText('fr', 30, 500);
      expect(results).toContain('d’au moins');
    });
  });

  describe('when max power is 50, min power is 0', () => {
    it('should return a message with English text', () => {
      const results = generateSpeedInfoText('en', 0, 50);
      expect(results).toContain('with maximum');
    });

    it('should return a message with German text', () => {
      const results = generateSpeedInfoText('de', 0, 50);
      expect(results).toContain('mit maximal');
    });

    it('should return a message with Portuguese text', () => {
      const results = generateSpeedInfoText('pt', 0, 50);
      expect(results).toContain('com um máximo de');
    });

    it('should return a message with Czech text', () => {
      const results = generateSpeedInfoText('cz', 0, 50);
      expect(results).toContain('s maximálním výkonem');
    });

    it('should return a message with Spanish text', () => {
      const results = generateSpeedInfoText('es', 0, 50);
      expect(results).toContain('con un máximo de');
    });

    it('should return a message with French text', () => {
      const results = generateSpeedInfoText('fr', 0, 50);
      expect(results).toContain('avec un maximum de');
    });
  });

  describe('when max power is 22, min power is 22', () => {
    const minPower = 22;
    it('should return a message with English text', () => {
      const results = generateSpeedInfoText('en', minPower, minPower);
      expect(results).toContain(`with ${minPower}kW`);
    });

    it('should return a message with German text', () => {
      const results = generateSpeedInfoText('de', minPower, minPower);
      expect(results).toContain(`mit ${minPower}kW`);
    });

    it('should return a message with Portuguese text', () => {
      const results = generateSpeedInfoText('pt', minPower, minPower);
      expect(results).toContain(`com ${minPower}kW`);
    });

    it('should return a message with Czech text', () => {
      const results = generateSpeedInfoText('cz', minPower, minPower);
      expect(results).toContain(`s ${minPower}kW`);
    });

    it('should return a message with Spanish text', () => {
      const results = generateSpeedInfoText('es', minPower, minPower);
      expect(results).toContain(`con ${minPower}kW`);
    });

    it('should return a message with French text', () => {
      const results = generateSpeedInfoText('fr', minPower, minPower);
      expect(results).toContain(`de ${minPower}kW`);
    });
  });
});
