import { ToolkitProject } from '../../../../../apps/cdk-apps/src/shared';
import { serializeFilterResponse } from './filters-response-serializer';

describe('generate filter response structure', () => {
  const project = new ToolkitProject({
    chargegpt_filter_config: [{
      name: 'min_power',
      type: 'number',
      description: 'The minimum power (in kW) that a charging point must offer to be included in the search results.',
      defaultValue: '0',
      valueType: 'range',
      minAcceptedValue: '0',
      maxAcceptedValue: '500',
      acceptedValues: null
    },
      {
        name: 'max_power',
        type: 'number',
        description: 'The maximum power limit (in kW) for the charging points. Charging points above this power rating are excluded.',
        defaultValue: '500',
        valueType: 'range',
        minAcceptedValue: '0',
        maxAcceptedValue: '500',
        acceptedValues: null
      },
      {
        name: 'power_enabled',
        type: 'boolean',
        description: 'Determines whether the power filter is active.',
        defaultValue: 'true',
        valueType: 'acceptedValues',
        minAcceptedValue: null,
        maxAcceptedValue: null,
        acceptedValues: 'true, false'
      },
      {
        name: 'only_free',
        type: 'boolean',
        description: 'When set to true, only free charging points are shown.',
        defaultValue: 'false',
        valueType: 'acceptedValues',
        minAcceptedValue: null,
        maxAcceptedValue: null,
        acceptedValues: 'true, false'
      },
      {
        name: 'only_4_or_5_stars',
        type: 'boolean',
        description: 'Shows only charging points with a rating of 4 or 5 stars.',
        defaultValue: 'false',
        valueType: 'acceptedValues',
        minAcceptedValue: null,
        maxAcceptedValue: null,
        acceptedValues: 'true, false'
      },
      {
        name: 'only_public',
        type: 'boolean',
        description: 'If true, only public charging points are displayed.',
        defaultValue: 'false',
        valueType: 'acceptedValues',
        minAcceptedValue: null,
        maxAcceptedValue: null,
        acceptedValues: 'true, false'
      },
      {
        name: 'only_tariff_kwh',
        type: 'boolean',
        description: 'Filters charging points that have a tariff based on kWh.',
        defaultValue: 'false',
        valueType: 'acceptedValues',
        minAcceptedValue: null,
        maxAcceptedValue: null,
        acceptedValues: 'true, false'
      },
      {
        name: 'only_tariff_min',
        type: 'boolean',
        description: 'Filters charging points that have a tariff based on minutes.',
        defaultValue: 'false',
        valueType: 'acceptedValues',
        minAcceptedValue: null,
        maxAcceptedValue: null,
        acceptedValues: 'true, false'
      },
      {
        name: 'only_remote_start_capable',
        type: 'boolean',
        description: 'Filters charging points that can be started remotely.',
        defaultValue: 'false',
        valueType: 'acceptedValues',
        minAcceptedValue: null,
        maxAcceptedValue: null,
        acceptedValues: 'true, false'
      },
      {
        name: 'only_auto_charge',
        type: 'boolean',
        description: 'Filters for charging points that support automatic charging.',
        defaultValue: 'false',
        valueType: 'acceptedValues',
        minAcceptedValue: null,
        maxAcceptedValue: null,
        acceptedValues: 'true, false'
      },
      {
        name: 'hide_not_available',
        type: 'boolean',
        description: 'Hides charging points that are currently not available if set to true.',
        defaultValue: 'false',
        valueType: 'acceptedValues',
        minAcceptedValue: null,
        maxAcceptedValue: null,
        acceptedValues: 'true, false'
      },
      {
        name: 'hide_no_state',
        type: 'boolean',
        description: 'Hides charging points that do not have a defined status.',
        defaultValue: 'false',
        valueType: 'acceptedValues',
        minAcceptedValue: null,
        maxAcceptedValue: null,
        acceptedValues: 'true, false'
      },
      {
        name: 'hide_unknown',
        type: 'boolean',
        description: 'Hides charging points that have an unknown status.',
        defaultValue: 'false',
        valueType: 'acceptedValues',
        minAcceptedValue: null,
        maxAcceptedValue: null,
        acceptedValues: 'true, false'
      },
      {
        name: 'hide_coming_soon',
        type: 'boolean',
        description: 'Hides charging points that are not yet available or are labeled as "coming soon".',
        defaultValue: 'false',
        valueType: 'acceptedValues',
        minAcceptedValue: null,
        maxAcceptedValue: null,
        acceptedValues: 'true, false'
      },
      {
        name: 'type_of_locations',
        type: 'array',
        description: 'An array of location types to include in the search. Only these types of locations are valid.',
        defaultValue: null,
        valueType: 'acceptedValues',
        minAcceptedValue: null,
        maxAcceptedValue: null,
        acceptedValues: 'Restaurant,Hotel,Public road,Public street,Supermarket,Shopping center,House,Service station,Motorway service station,Paid parking,Free car park,Dealer,Taxi,Company,Store,Workshop,Camping,Airport,Other,Private'
      },
      {
        name: 'type_of_locations_enabled',
        type: 'boolean',
        description: 'Determines whether the type_of_locations filter is active.',
        defaultValue: 'false',
        valueType: 'acceptedValues',
        minAcceptedValue: null,
        maxAcceptedValue: null,
        acceptedValues: 'true, false'
      },
      {
        name: 'plug_types_enabled',
        type: 'boolean',
        description: 'Determines whether the plug_types filter is active.',
        defaultValue: 'false',
        valueType: 'acceptedValues',
        minAcceptedValue: null,
        maxAcceptedValue: null,
        acceptedValues: 'true, false'
      }
    ]
  } as any);

  describe('when min_power and max_power are set', () => {
    const mockConversationServiceResponse = {
      min_power: 10,
      max_power: 100,
    };
    const responseStructure = serializeFilterResponse(project, mockConversationServiceResponse);


    it('should return values of min_power and max_power that are set in the toolkit', () => {
      expect(responseStructure.min_power).toEqual(10);
      expect(responseStructure.max_power).toEqual(99.9);
      expect(responseStructure.power_enabled).toBeTruthy();
    });
  });

  describe('when min_power is set', () => {
    const mockConversationServiceResponse = {
      min_power: 10,
    };
    const responseStructure = serializeFilterResponse(project, mockConversationServiceResponse);


    it('should return values of power_enable true with only min_power value that are set in the toolkit', () => {
      expect(responseStructure.min_power).toEqual(10);
      expect(responseStructure.power_enabled).toBeTruthy();
    });
  });

  describe('when there is some of type_of_locations that are not included in the acceptedValues.', () => {
    const mockConversationServiceResponse = {
      type_of_locations: ['Shopping center', 'Supermarket', 'Test']
    };
    const responseStructure = serializeFilterResponse(project, mockConversationServiceResponse);

    it('should return only with accepted values and type_of_locations_enabled is true.', () => {
      expect(responseStructure.type_of_locations).toContain('Shopping center');
      expect(responseStructure.type_of_locations).toContain('Supermarket');
      expect(responseStructure.type_of_locations.length).toBe(2);
      expect(responseStructure.type_of_locations_enabled).toBeTruthy();
      expect(responseStructure.power_enabled).toBeFalsy();
    });
  });

  describe('when there is no type_of_locations included in the acceptedValues.', () => {
    const mockConversationServiceResponse = {
      type_of_locations: ['Test']
    };
    const responseStructure = serializeFilterResponse(project, mockConversationServiceResponse);

    it('should return only with accepted values and type_of_locations_enabled is true.', () => {
      expect(responseStructure.type_of_locations).toEqual([]);
      expect(responseStructure.type_of_locations_enabled).toBeFalsy();
    });
  });

  describe('when nothing are set', () => {
    const mockConversationServiceResponse = {};
    const responseStructure = serializeFilterResponse(project, mockConversationServiceResponse);


    it('should return default values that are set in the toolkit', () => {
      expect(responseStructure.min_power).toEqual(0);
      expect(responseStructure.max_power).toEqual(500);
      expect(responseStructure.power_enabled).toBeFalsy();
      expect(responseStructure.only_free).toBeFalsy();
      expect(responseStructure.only_4_or_5_stars).toBeFalsy();
      expect(responseStructure.only_public).toBeFalsy();
      expect(responseStructure.only_tariff_kwh).toBeFalsy();
      expect(responseStructure.only_tariff_min).toBeFalsy();
      expect(responseStructure.only_remote_start_capable).toBeFalsy();
      expect(responseStructure.only_auto_charge).toBeFalsy();
      expect(responseStructure.hide_not_available).toBeFalsy();
      expect(responseStructure.hide_no_state).toBeFalsy();
      expect(responseStructure.hide_unknown).toBeFalsy();
      expect(responseStructure.hide_coming_soon).toBeFalsy();
      expect(responseStructure.type_of_locations_enabled).toBeFalsy();
      expect(responseStructure.type_of_locations).toEqual([]);
      expect(responseStructure.plug_types_enabled).toBeFalsy();
    });
  });
});