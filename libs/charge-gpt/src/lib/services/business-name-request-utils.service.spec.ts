import {
  ExtraChargingNeeds,
  isNotShowingAddressOptionsUseCase,
} from './business-name-request-utils.service';

const buildChargingNeeds = (
  chargingNeeds: Partial<ExtraChargingNeeds>
): ExtraChargingNeeds => {
  return {
    min_power: null,
    max_power: null,
    operator_name: null,
    connector_type: null,
    power_type: null,
    ...chargingNeeds,
  };
};

const buildConversationContext = (isNearbyRequested = false) => ({
  isNearbyRequested,
});

describe('isNotShowingAddressOptionsUseCase', () => {
  describe('when destination request', () => {
    describe('has poiName and no charging needs', () => {
      it('should show options', () => {
        expect(
          isNotShowingAddressOptionsUseCase(
            {
              poiName: 'business',
            },
            buildChargingNeeds({}),
            buildConversationContext(),
            '',
            'someDestination'
          )
        ).toBeFalsy();
      });
    });

    describe('has poiName and charging needs', () => {
      it('should not show options', () => {
        expect(
          isNotShowingAddressOptionsUseCase(
            {
              poiName: 'business',
            },
            buildChargingNeeds({ min_power: 10 }),
            buildConversationContext(),
            '',
            'someDestination'
          )
        ).toBeTruthy();
      });
    });

    describe('has no poiName but has charging needs', () => {
      it('should show options', () => {
        expect(
          isNotShowingAddressOptionsUseCase(
            {
              poiName: '',
            },
            buildChargingNeeds({ min_power: 10 }),
            buildConversationContext(),
            '',
            'someDestination'
          )
        ).toBeFalsy();
      });
    });

    describe('has poi categories and no charging needs', () => {
      it('should show options', () => {
        expect(
          isNotShowingAddressOptionsUseCase(
            {
              poiCategories: ['restaurant'],
            },
            buildChargingNeeds({}),
            buildConversationContext(),
            '',
            'someDestination'
          )
        ).toBeFalsy();
      });
    });

    describe('has poi categories and charging needs', () => {
      it('should not show options', () => {
        expect(
          isNotShowingAddressOptionsUseCase(
            {
              poiCategories: ['restaurant'],
            },
            buildChargingNeeds({ min_power: 10 }),
            buildConversationContext(),
            '',
            'someDestination'
          )
        ).toBeTruthy();
      });
    });

    describe('has poi categories and is nearby requested', () => {
      it('should not show options', () => {
        expect(
          isNotShowingAddressOptionsUseCase(
            {
              poiCategories: ['restaurant'],
            },
            buildChargingNeeds({}),
            buildConversationContext(true),
            '',
            'someDestination'
          )
        ).toBeTruthy();
      });
    });

    describe('has poi categories and not nearby requested', () => {
      it('should show options', () => {
        expect(
          isNotShowingAddressOptionsUseCase(
            {
              poiCategories: ['restaurant'],
            },
            buildChargingNeeds({}),
            buildConversationContext(),
            '',
            'someDestination'
          )
        ).toBeFalsy();
      });
    });

    describe('has poi name is nearby requested', () => {
      it('should not show options', () => {
        expect(
          isNotShowingAddressOptionsUseCase(
            {
              poiName: 'business',
            },
            buildChargingNeeds({}),
            buildConversationContext(true),
            '',
            'someDestination'
          )
        ).toBeTruthy();
      });
    });

    describe('has poi name is not nearby requested', () => {
      it('should show options', () => {
        expect(
          isNotShowingAddressOptionsUseCase(
            {
              poiName: 'business',
            },
            buildChargingNeeds({}),
            buildConversationContext(),
            '',
            'someDestination'
          )
        ).toBeFalsy();
      });
    });
  });

  describe('when routing request', () => {
    describe('has poiName and no charging needs', () => {
      it('should show options', () => {
        expect(
          isNotShowingAddressOptionsUseCase(
            {
              poiName: 'business',
            },
            buildChargingNeeds({}),
            buildConversationContext(),
            'someOrigin',
            'someDestination'
          )
        ).toBeFalsy();
      });
    });

    describe('has poiName and charging needs', () => {
      it('should show options', () => {
        expect(
          isNotShowingAddressOptionsUseCase(
            {
              poiName: 'business',
            },
            buildChargingNeeds({ min_power: 10 }),
            buildConversationContext(),
            'someOrigin',
            'someDestination'
          )
        ).toBeFalsy();
      });
    });

    describe('has no poiName but has charging needs', () => {
      it('should show options', () => {
        expect(
          isNotShowingAddressOptionsUseCase(
            {
              poiName: '',
            },
            buildChargingNeeds({ min_power: 10 }),
            buildConversationContext(),
            'someOrigin',
            'someDestination'
          )
        ).toBeFalsy();
      });
    });

    describe('has poi categories and no charging needs', () => {
      it('should show options', () => {
        expect(
          isNotShowingAddressOptionsUseCase(
            {
              poiCategories: ['restaurant'],
            },
            buildChargingNeeds({}),
            buildConversationContext(),
            'someOrigin',
            'someDestination'
          )
        ).toBeFalsy();
      });
    });

    describe('has poi categories and charging needs', () => {
      it('should show options', () => {
        expect(
          isNotShowingAddressOptionsUseCase(
            {
              poiCategories: ['restaurant'],
            },
            buildChargingNeeds({ min_power: 10 }),
            buildConversationContext(),
            'someOrigin',
            'someDestination'
          )
        ).toBeFalsy();
      });
    });

    describe('has poi categories and is nearby requested', () => {
      it('should show options', () => {
        expect(
          isNotShowingAddressOptionsUseCase(
            {
              poiCategories: ['restaurant'],
            },
            buildChargingNeeds({}),
            buildConversationContext(true),
            'someOrigin',
            'someDestination'
          )
        ).toBeFalsy();
      });
    });

    describe('has poi categories and not nearby requested', () => {
      it('should show options', () => {
        expect(
          isNotShowingAddressOptionsUseCase(
            {
              poiCategories: ['restaurant'],
            },
            buildChargingNeeds({}),
            buildConversationContext(),
            'someOrigin',
            'someDestination'
          )
        ).toBeFalsy();
      });
    });

    describe('has poi name is nearby requested', () => {
      it('should show options', () => {
        expect(
          isNotShowingAddressOptionsUseCase(
            {
              poiName: 'business',
            },
            buildChargingNeeds({}),
            buildConversationContext(true),
            'someOrigin',
            'someDestination'
          )
        ).toBeFalsy();
      });
    });

    describe('has poi name is not nearby requested', () => {
      it('should show options', () => {
        expect(
          isNotShowingAddressOptionsUseCase(
            {
              poiName: 'business',
            },
            buildChargingNeeds({}),
            buildConversationContext(),
            'someOrigin',
            'someDestination'
          )
        ).toBeFalsy();
      });
    });
  });
});
