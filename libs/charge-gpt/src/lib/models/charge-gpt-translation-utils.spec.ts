describe('generateRouteRecommendationPrefix', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('current date time', () => {
    it('should return translated current text', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('current text');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateRouteRecommendationPrefix('en', true);

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(2);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.currentText'
      );
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.routing.recommendationPrefix',
        { currentPredictionText: 'current text' }
      );
    });
  });

  describe('future date time', () => {
    it('should return translated predicted text', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('prediction text');
      const TranslationUtils = await import('./charge-gpt-translation.assets');

      TranslationUtils.generateRouteRecommendationPrefix('en', false);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(2);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.predictionText'
      );
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.routing.recommendationPrefix',
        { currentPredictionText: 'prediction text' }
      );
    });
  });
});

describe('generateAddressInformationText', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('when route need is undefined', () => {
    it('should not return address information', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateAddressInformationText('en', undefined);

      expect(FronyxTranslationService.getTranslation).not.toHaveBeenCalled();
    });
  });

  describe('when route need is null', () => {
    it('should not return address information', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateAddressInformationText('en', null);

      expect(FronyxTranslationService.getTranslation).not.toHaveBeenCalled();
    });
  });

  describe('when there route need is an empty string', () => {
    it('should not return address information', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateAddressInformationText('en', '');

      expect(FronyxTranslationService.getTranslation).not.toHaveBeenCalled();
    });
  });

  describe('when route need has value', () => {
    it('should return address information text', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateAddressInformationText('en', 'someRouteNeed');

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(1);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.addressInformationText.poi',
        {
          poi: 'someRouteNeed',
        }
      );
    });
  });
});

describe('generateRoutingText', () => {
  beforeEach(() => jest.resetAllMocks());
  describe('when routing more than 50kM', () => {
    it('should return with "within 50KM text" routing text', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateRoutingText('en', true);

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(1);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.addressInformationText.route'
      );
    });
  });

  describe('when routing less than 50kM', () => {
    it('should return without "within 50KM text" routing text', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateRoutingText('en', false);

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(1);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.addressInformationText.shortenRoute'
      );
    });
  });
});

describe('generateSuggestionText', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('when power type, speed, operator name and route need are undefined', () => {
    it('should not return a date time tips', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateSuggestionText(
        'en',
        undefined,
        undefined,
        undefined,
        undefined,
        undefined
      );

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(1);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.suggestionText.dateTimeTips'
      );
    });
  });

  describe('when power type, speed, operator name and route need are null', () => {
    it('should not return a date time tips', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateSuggestionText(
        'en',
        null,
        null,
        null,
        null,
        null
      );

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(1);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.suggestionText.dateTimeTips'
      );
    });
  });

  describe('when there are no power type, speed, operator name and route need', () => {
    it('should not return a date time tips', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateSuggestionText('en', '', NaN, NaN, '', '');

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(1);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.suggestionText.dateTimeTips'
      );
    });

    it('should not return a date time tips', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateSuggestionText('en', '', null, null, '', '');

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(1);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.suggestionText.dateTimeTips'
      );
    });

    it('should not return a date time tips', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateSuggestionText(
        'en',
        '',
        undefined,
        undefined,
        '',
        ''
      );

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(1);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.suggestionText.dateTimeTips'
      );
    });
  });

  describe('when there is power type but no speed, operator name and route need', () => {
    it('should return a charging speed tips', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateSuggestionText(
        'en',
        'DC',
        undefined,
        undefined,
        undefined,
        undefined
      );

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(1);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.suggestionText.chargingSpeedTips'
      );
    });
  });

  describe('when power type has default value but speed, operator name and route need are undefined', () => {
    it('should return a date time tips', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateSuggestionText(
        'en',
        'all',
        undefined,
        undefined,
        undefined,
        undefined
      );

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.suggestionText.dateTimeTips'
      );
    });
  });

  describe('when there is speed value but operator name, power type and route need are undefined', () => {
    it('should return a charging speed tips', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateSuggestionText(
        'en',
        undefined,
        20,
        70,
        undefined,
        undefined
      );

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(1);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.suggestionText.chargingSpeedTips'
      );
    });
  });

  describe('when there speed has default value and operator name, power type and route need are undefined', () => {
    it('should return a date time tips', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateSuggestionText(
        'en',
        undefined,
        0,
        500,
        undefined,
        undefined
      );

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(1);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.suggestionText.dateTimeTips'
      );
    });
  });

  describe('when there is operator name but power type, speed and route need are undefined', () => {
    it('should return a operator name tips', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateSuggestionText(
        'en',
        undefined,
        undefined,
        undefined,
        'someOperatorName',
        undefined
      );

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(1);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.suggestionText.operatorNameTips'
      );
    });
  });

  describe('when operator name has default value but power type, speed and route need are undefined', () => {
    it('should return date time tips', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateSuggestionText(
        'en',
        undefined,
        undefined,
        undefined,
        'all',
        undefined
      );

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(1);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.suggestionText.dateTimeTips'
      );
    });
  });

  describe('when there are route need but power type, speed and operator name are undefined', () => {
    it('should return a route need tips', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateSuggestionText(
        'en',
        undefined,
        undefined,
        undefined,
        undefined,
        'someRouteNeed'
      );

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(1);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.suggestionText.addressTips',
        {
          poi: 'someRouteNeed',
        }
      );
    });
  });
});

describe('generateChargePointErrorText', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('when singular word is needed', () => {
    it('should return charge point text', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateChargePointErrorText('en', false);

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(1);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.routing.error.chargePointWord.singular'
      );
    });
  });

  describe('when plural word is needed', () => {
    it('should return charge point text', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generateChargePointErrorText('en', true);

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(1);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.routing.error.chargePointWord.plural'
      );
    });
  });
});

describe('generatePostfixText', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('when routing more than 50kM', () => {
    it('should return "within 50km" text', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generatePostfixText('en', true);

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(1);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.routing.recommendationPostfix'
      );
    });
  });

  describe('when routing less than 50kM', () => {
    it('should return "within 50km" text', async () => {
      const FronyxTranslationService = await import('@fronyx/translations');
      jest
        .spyOn(FronyxTranslationService, 'getTranslation')
        .mockReturnValue('');
      const TranslationUtils = await import('./charge-gpt-translation.assets');
      TranslationUtils.generatePostfixText('en', false);

      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledTimes(1);
      expect(FronyxTranslationService.getTranslation).toHaveBeenCalledWith(
        'en',
        'recommendationText.routing.shortenRecommendationPostfix'
      );
    });
  });
});
