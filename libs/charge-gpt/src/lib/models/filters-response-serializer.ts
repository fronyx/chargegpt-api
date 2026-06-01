import { FilterResponse } from './prompt';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';
import { ToolkitProject } from '@fronyx/toolkit';

export function serializeFilterResponse(project: ToolkitProject, conversationServiceResponse?: any): FilterResponse {
  const payload: any = {};

  project.chargegpt_filter_config
    .forEach(({ name, defaultValue, acceptedValues, minAcceptedValue, maxAcceptedValue }) => {
      if (name === 'min_power') {
        if (!isEmptyString(defaultValue)) {
          payload.min_power = Number(defaultValue);
        }
        if (conversationServiceResponse?.min_power) {
          if (isAcceptableValue(Number(conversationServiceResponse.min_power), Number(minAcceptedValue), Number(maxAcceptedValue))) {
            payload.min_power = Number(conversationServiceResponse.min_power);
          }
        }
      }

      if (name === 'max_power') {
        if (!isEmptyString(defaultValue)) {
          payload.max_power = Number(defaultValue);
        }
        if (conversationServiceResponse?.max_power) {
          if (isAcceptableValue(Number(conversationServiceResponse.max_power), Number(minAcceptedValue), Number(maxAcceptedValue))) {
            payload.max_power = Number(conversationServiceResponse.max_power);
          }
        }
      }

      if (name === 'power_enabled') {
        if (conversationServiceResponse?.power_enabled === false) {
          payload.power_enabled = false;
          
          const findDefaultPowerValue = (propertyName: string, fallbackValue: number) => {
            const config = project.chargegpt_filter_config.find(config => config.name === propertyName);
            return config && config.defaultValue ? Number(config.defaultValue) : fallbackValue;
          };

          payload.min_power = findDefaultPowerValue('min_power', 0);
          payload.max_power = findDefaultPowerValue('max_power', 500);
        } else {
          payload.power_enabled = !(payload.min_power === 0 && payload.max_power === 500);
        }
      }

      if (name === 'only_free') {
        const onlyFreeDefaultValue = defaultValue === 'true';
        payload.only_free = conversationServiceResponse?.only_free ? conversationServiceResponse?.only_free : onlyFreeDefaultValue;
      }

      if (name === 'only_4_or_5_stars') {
        const only4or5Stars = defaultValue === 'true';
        payload.only_4_or_5_stars = conversationServiceResponse?.only_4_or_5_stars ? conversationServiceResponse?.only_4_or_5_stars : only4or5Stars;
      }

      if (name === 'only_public') {
        const onlyPublicDefaultValue = defaultValue === 'true';
        payload.only_public = conversationServiceResponse?.only_public ? conversationServiceResponse?.only_public : onlyPublicDefaultValue;
      }

      if (name === 'only_tariff_kwh') {
        const onlyTariffKwhDefaultValue = defaultValue === 'true';
        payload.only_tariff_kwh = conversationServiceResponse?.only_tariff_kwh ? conversationServiceResponse?.only_tariff_kwh : onlyTariffKwhDefaultValue;
      }

      if (name === 'only_tariff_min') {
        const onlyTariffMinDefaultValue = defaultValue === 'true';
        payload.only_tariff_min = conversationServiceResponse?.only_tariff_min ? conversationServiceResponse?.only_tariff_min : onlyTariffMinDefaultValue;
      }

      if (name === 'only_remote_start_capable') {
        const onlyRemoteStartCapableDefaultValue = defaultValue === 'true';
        payload.only_remote_start_capable = conversationServiceResponse?.only_remote_start_capable ? conversationServiceResponse?.only_remote_start_capable : onlyRemoteStartCapableDefaultValue;
      }

      if (name === 'only_auto_charge') {
        const onlyAutoChargeDefaultValue = defaultValue === 'true';
        payload.only_auto_charge = conversationServiceResponse?.only_auto_charge ? conversationServiceResponse?.only_auto_charge : onlyAutoChargeDefaultValue;
      }

      if (name === 'hide_not_available') {
        const hideNotAvailable = defaultValue === 'true';
        if (conversationServiceResponse?.hide_not_available === undefined || conversationServiceResponse?.hide_not_available === null) {
          payload.hide_not_available = hideNotAvailable;  
        } else {
          payload.hide_not_available = conversationServiceResponse?.hide_not_available;
        }
      }

      if (name === 'hide_no_state') {
        payload.hide_no_state = payload.hide_not_available;
      }

      if (name === 'hide_unknown') {
        payload.hide_unknown = payload.hide_not_available;
      }

      if (name === 'hide_coming_soon') {
        const hideComingSoonDefaultValue = defaultValue === 'true';
        payload.hide_coming_soon = conversationServiceResponse?.hide_coming_soon ? conversationServiceResponse?.hide_coming_soon : hideComingSoonDefaultValue;
      }

      if (name === 'type_of_locations') {
        const typeOfLocationsAcceptedValues = !isEmptyString(acceptedValues) ? convertStringToAnArray(acceptedValues) : [];

        if (!isObjectEmpty(conversationServiceResponse?.type_of_locations)) {
          const typeOfLocations = conversationServiceResponse.type_of_locations;
          payload.type_of_locations = typeOfLocations.filter((typeOfLocation: string) => typeOfLocationsAcceptedValues.includes(typeOfLocation));
        } else {
          payload.type_of_locations = [];
        }
      }

      if (name === 'type_of_locations_enabled') {
        payload.type_of_locations_enabled = payload.type_of_locations?.length > 0;
      }

      if (name === 'plug_types_enabled') {
        payload.plug_types_enabled = conversationServiceResponse?.plug_types_enabled ? conversationServiceResponse?.plug_types_enabled : false;
      }
        
    });

    if (payload.max_power && payload.max_power !== 500 && payload.max_power !== payload.min_power) {
      if (isInteger(payload.max_power)) {
        payload.max_power = payload.max_power - 0.1;
      }
    }

  return payload;
}

function isInteger(number) {
  return number % 1 === 0;
}

function convertStringToAnArray(defaultValue: string): string[] {
  return defaultValue.split(',');
}

function isAcceptableValue(value: number, minAcceptedValue: number, maxAcceptedValue: number): boolean {
  return value >= minAcceptedValue && value <= maxAcceptedValue;
}
