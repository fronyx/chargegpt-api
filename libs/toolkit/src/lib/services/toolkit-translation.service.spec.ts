import { getTranslationOrFallback } from './toolkit-translation.service';

describe('getTranslationOrFallback', () => {
    describe('not all languages are available', () => {
        it('should return the fallback value if the language is not available', () => {
            const result = getTranslationOrFallback([
                {
                  id: 3,
                  projects: 48,
                  en: 'It seems like we hit a bit of a roadblock... Can you try rephrasing your request?',
                  de: '',
                  pt: null,
                  es: null,
                  fr: undefined
                } as any
              ] , {
                EN: 'Sorry, something in your request has triggered a safety mechanism. Can you try rephrasing your request?',
                DE: 'Entschuldigung, etwas in Ihrer Anfrage hat einen Sicherheitsmechanismus ausgelöst. Können Sie versuchen, Ihre Anfrage anders zu formulieren?',
                ES: 'Lo sentimos, algo en tu solicitud ha activado un mecanismo de seguridad. ¿Puedes intentar reformular tu solicitud?',
                FR: 'Désolé, quelque chose dans votre demande a déclenché un mécanisme de sécurité. Pouvez-vous essayer de reformuler votre demande?',
                PT: 'Desculpe, algo no seu pedido acionou um mecanismo de segurança. Tente reformular o seu pedido.'
              });

            const translationAsset = {
                en: 'It seems like we hit a bit of a roadblock... Can you try rephrasing your request?',
                de: 'Entschuldigung, etwas in Ihrer Anfrage hat einen Sicherheitsmechanismus ausgelöst. Können Sie versuchen, Ihre Anfrage anders zu formulieren?',
                pt: 'Desculpe, algo no seu pedido acionou um mecanismo de segurança. Tente reformular o seu pedido.',
                es: 'Lo sentimos, algo en tu solicitud ha activado un mecanismo de seguridad. ¿Puedes intentar reformular tu solicitud?',
                fr: 'Désolé, quelque chose dans votre demande a déclenché un mécanisme de sécurité. Pouvez-vous essayer de reformuler votre demande?',
            };

            expect(Object.keys(result)).toHaveLength(5);
            expect(Object.keys(result).every(key => ['en', 'fr', 'pt', 'es', 'de'].includes(key))).toBeTruthy();
            expect(result.de).toEqual(translationAsset.de);
            expect(result.en).toEqual(translationAsset.en);
            expect(result.pt).toEqual(translationAsset.pt);
            expect(result.es).toEqual(translationAsset.es);
            expect(result.fr).toEqual(translationAsset.fr);
        });

        it('should return the fallback value if the no config at all', () => {
          const result = getTranslationOrFallback([] , {
            EN: 'It seems like we hit a bit of a roadblock... Can you try rephrasing your request?',
            DE: 'Entschuldigung, etwas in Ihrer Anfrage hat einen Sicherheitsmechanismus ausgelöst. Können Sie versuchen, Ihre Anfrage anders zu formulieren?',
            PT: 'Desculpe, algo no seu pedido acionou um mecanismo de segurança. Tente reformular o seu pedido.',
            ES: 'Lo sentimos, algo en tu solicitud ha activado un mecanismo de seguridad. ¿Puedes intentar reformular tu solicitud?',
            FR: 'Désolé, quelque chose dans votre demande a déclenché un mécanisme de sécurité. Pouvez-vous essayer de reformuler votre demande?',
          });

          const translationAsset = {
              en: 'It seems like we hit a bit of a roadblock... Can you try rephrasing your request?',
              de: 'Entschuldigung, etwas in Ihrer Anfrage hat einen Sicherheitsmechanismus ausgelöst. Können Sie versuchen, Ihre Anfrage anders zu formulieren?',
              pt: 'Desculpe, algo no seu pedido acionou um mecanismo de segurança. Tente reformular o seu pedido.',
              es: 'Lo sentimos, algo en tu solicitud ha activado un mecanismo de seguridad. ¿Puedes intentar reformular tu solicitud?',
              fr: 'Désolé, quelque chose dans votre demande a déclenché un mécanisme de sécurité. Pouvez-vous essayer de reformuler votre demande?',
          };

          expect(Object.keys(result)).toHaveLength(5);
          expect(Object.keys(result).every(key => ['en', 'fr', 'pt', 'es', 'de'].includes(key))).toBeTruthy();
          expect(result.de).toEqual(translationAsset.de);
          expect(result.en).toEqual(translationAsset.en);
          expect(result.pt).toEqual(translationAsset.pt);
          expect(result.es).toEqual(translationAsset.es);
          expect(result.fr).toEqual(translationAsset.fr);
      });
    });
});