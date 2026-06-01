import { Injectable } from '@nestjs/common';
import {
  CategoryPropertiesEnum as Cat1,
  RequestIdentifierCat1Service,
} from './request-identifier-cat1.service';
import { CategoryPropertiesEnum as Cat2, RequestIdentifierCat2Service } from './request-identifier-cat2.service';
import { CategoryPropertiesEnum as Cat3, RequestIdentifierCat3Service } from './request-identifier-cat3.service';
import { CategoryPropertiesEnum as Cat4, RequestIdentifierCat4Service } from './request-identifier-cat4.service';
import { CategoryPropertiesEnum as Cat5, RequestIdentifierCat5Service } from './request-identifier-cat5.service';
import { CategoryPropertiesEnum as Cat6, RequestIdentifierCat6Service } from './request-identifier-cat6.service';
import {
  CategoryPropertiesEnum as Cat7,
  RequestIdentifierCat7Service,
} from './request-identifier-cat7.service';
import {
  CategoryPropertiesEnum as Cat8,
  RequestIdentifierCat8Service,
} from './request-identifier-cat8.service';
import { ConversationHistory } from '../../models/conversation-history.model';
import { ProjectOutputType } from '../../models/prompt';
import { differenceInMinutes, parse } from 'date-fns';
import { ToolkitProject } from '@fronyx/toolkit';

type FiltersProperties = Cat1 | Cat2 | Cat3 | Cat4 | Cat5 | Cat6 | Cat7;
type RecommendationFiltersProperties = Cat1 | Cat7 | Cat8;

export type IdentifiedFilters = Record<
  FiltersProperties,
  string[] | number | boolean | null | string
>;

export type IdentifiedRecommendationFilters = Record<
  RecommendationFiltersProperties,
  string[] | number | boolean | null | string
>;

@Injectable()
export class FiltersCategoriesIdentifiersService {
  constructor(
    private readonly requestIdentifierCat1Service: RequestIdentifierCat1Service,
    private readonly requestIdentifierCat2Service: RequestIdentifierCat2Service,
    private readonly requestIdentifierCat3Service: RequestIdentifierCat3Service,
    private readonly requestIdentifierCat4Service: RequestIdentifierCat4Service,
    private readonly requestIdentifierCat5Service: RequestIdentifierCat5Service,
    private readonly requestIdentifierCat6Service: RequestIdentifierCat6Service,
    private readonly requestIdentifierCat7Service: RequestIdentifierCat7Service,
    private readonly requestIdentifierCat8Service: RequestIdentifierCat8Service
  ) {}

  async identifyAllFilters(
    conversationHistory: ConversationHistory,
    project: ToolkitProject
  ): Promise<IdentifiedFilters> {
    const filters = {
      [Cat1.MAX_POWER]: null,
      [Cat1.MIN_POWER]: null,
      [Cat2.HIDE_COMING_SOON]: null,
      [Cat2.HIDE_NOT_AVAILABLE]: null,
      [Cat2.ONLY_FREE]: null,
      [Cat3.ONLY_4_OR_5_STARS]: null,
      [Cat3.ONLY_PUBLIC]: null,
      [Cat4.ONLY_TARIFF_KWH]: null,
      [Cat4.ONLY_TARIFF_MIN]: null,
      [Cat5.ONLY_AUTO_CHARGE]: null,
      [Cat5.ONLY_REMOTE_START_CAPABLE]: null,
      [Cat5.RESET]: null,
      [Cat6.PLUG_TYPES_ENABLED]: null,
      [Cat6.TYPE_OF_LOCATIONS]: null,
      [Cat6.TYPE_OF_LOCATIONS_ENABLED]: null,
      [Cat7.DATE_TIME]: null,
      [Cat7.POWER_TYPE]: null,
      [Cat7.OPERATOR_NAME]: null,
      // [Cat8.CONNECTOR_TYPE]: null,
    };

    if (project.chargegpt_output_type === ProjectOutputType.filters) {
      const [
        identifiedCat1,
        identifiedCat2,
        identifiedCat3,
        identifiedCat4,
        identifiedCat5,
        identifiedCat6,
      ] = await Promise.all([
        await this.requestIdentifierCat1Service.identifyFilters(
          conversationHistory,
          project
        ),
        await this.requestIdentifierCat2Service.identifyFilters(
          conversationHistory,
          project
        ),
        await this.requestIdentifierCat3Service.identifyFilters(
          conversationHistory,
          project
        ),
        await this.requestIdentifierCat4Service.identifyFilters(
          conversationHistory,
          project
        ),
        await this.requestIdentifierCat5Service.identifyFilters(
          conversationHistory,
          project
        ),
        await this.requestIdentifierCat6Service.identifyFilters(
          conversationHistory,
          project
        ),
      ]);

      if (!identifiedCat1.error && identifiedCat1.request) {
        filters[Cat1.MAX_POWER] = identifiedCat1.request[Cat1.MAX_POWER];
        filters[Cat1.MIN_POWER] = identifiedCat1.request[Cat1.MIN_POWER];
      }

      if (!identifiedCat2.error && identifiedCat2.request) {
        filters[Cat2.HIDE_COMING_SOON] =
          identifiedCat2.request[Cat2.HIDE_COMING_SOON];
        filters[Cat2.HIDE_NOT_AVAILABLE] =
          identifiedCat2.request[Cat2.HIDE_NOT_AVAILABLE];
        filters[Cat2.ONLY_FREE] = identifiedCat2.request[Cat2.ONLY_FREE];
      }

      if (!identifiedCat3.error && identifiedCat3.request) {
        filters[Cat3.ONLY_4_OR_5_STARS] =
          identifiedCat3.request[Cat3.ONLY_4_OR_5_STARS];
        filters[Cat3.ONLY_PUBLIC] = identifiedCat3.request[Cat3.ONLY_PUBLIC];
      }

      if (!identifiedCat4.error && identifiedCat4.request) {
        filters[Cat4.ONLY_TARIFF_KWH] =
          identifiedCat4.request[Cat4.ONLY_TARIFF_KWH];
        filters[Cat4.ONLY_TARIFF_MIN] =
          identifiedCat4.request[Cat4.ONLY_TARIFF_MIN];
      }

      if (!identifiedCat5.error && identifiedCat5.request) {
        filters[Cat5.ONLY_AUTO_CHARGE] =
          identifiedCat5.request[Cat5.ONLY_AUTO_CHARGE];
        filters[Cat5.ONLY_REMOTE_START_CAPABLE] =
          identifiedCat5.request[Cat5.ONLY_REMOTE_START_CAPABLE];
        filters[Cat5.RESET] = identifiedCat5.request[Cat5.RESET];
      }

      if (!identifiedCat6.error && identifiedCat6.request) {
        filters[Cat6.PLUG_TYPES_ENABLED] =
          identifiedCat6.request[Cat6.PLUG_TYPES_ENABLED];
        filters[Cat6.TYPE_OF_LOCATIONS] =
          identifiedCat6.request[Cat6.TYPE_OF_LOCATIONS];
        filters[Cat6.TYPE_OF_LOCATIONS_ENABLED] =
          identifiedCat6.request[Cat6.TYPE_OF_LOCATIONS_ENABLED];
      }
    } else if (
      project.chargegpt_output_type === ProjectOutputType.recommendations
    ) {
      const [identifiedCat1, identifiedCat7, identifiedCat8] =
        await Promise.all([
          await this.requestIdentifierCat1Service.identifyFilters(
            conversationHistory,
            project
          ),
          await this.requestIdentifierCat7Service.identifyFilters(
            conversationHistory,
            project
          ),
          await this.requestIdentifierCat8Service.identifyFilters(
            conversationHistory,
            project
          ),
        ]);

      if (!identifiedCat1.error && identifiedCat1.request) {
        filters[Cat1.MAX_POWER] = identifiedCat1.request[Cat1.MAX_POWER];
        filters[Cat1.MIN_POWER] = identifiedCat1.request[Cat1.MIN_POWER];
      }

      if (!identifiedCat7.error && identifiedCat7.request) {
        filters[Cat7.DATE_TIME] = identifiedCat7.request[Cat7.DATE_TIME];
        filters[Cat7.POWER_TYPE] = identifiedCat7.request[Cat7.POWER_TYPE];
        filters[Cat7.OPERATOR_NAME] =
          identifiedCat7.request[Cat7.OPERATOR_NAME];
      }

      if (!identifiedCat8.error && identifiedCat8.request) {
        filters[Cat8.CONNECTOR_TYPE] =
          identifiedCat8.request[Cat8.CONNECTOR_TYPE];
      }
    }

    return filters;
  }
}

export const getIdentifiedFiltersFromConversationHistoryData = (
  conversationHistory: ConversationHistory
): IdentifiedFilters => {
  return {
    [Cat1.MAX_POWER]: conversationHistory.getData().max_power,
    [Cat1.MIN_POWER]: conversationHistory.getData().min_power,
    [Cat2.HIDE_COMING_SOON]: conversationHistory.getData().hide_coming_soon,
    [Cat2.HIDE_NOT_AVAILABLE]: conversationHistory.getData().hide_not_available,
    [Cat2.ONLY_FREE]: conversationHistory.getData().only_free,
    [Cat3.ONLY_4_OR_5_STARS]: conversationHistory.getData().only_4_or_5_stars,
    [Cat3.ONLY_PUBLIC]: conversationHistory.getData().only_public,
    [Cat4.ONLY_TARIFF_KWH]: conversationHistory.getData().only_tariff_kwh,
    [Cat4.ONLY_TARIFF_MIN]: conversationHistory.getData().only_tariff_min,
    [Cat5.ONLY_AUTO_CHARGE]: conversationHistory.getData().only_auto_charge,
    [Cat5.ONLY_REMOTE_START_CAPABLE]:
      conversationHistory.getData().only_remote_start_capable,
    [Cat5.RESET]: conversationHistory.getData().reset,
    [Cat6.PLUG_TYPES_ENABLED]: conversationHistory.getData().plug_types_enabled,
    [Cat6.TYPE_OF_LOCATIONS]: conversationHistory.getData().type_of_locations,
    [Cat6.TYPE_OF_LOCATIONS_ENABLED]:
      conversationHistory.getData().type_of_locations_enabled,
    [Cat7.DATE_TIME]: conversationHistory.getData().date_time,
    [Cat7.POWER_TYPE]: conversationHistory.getData().power_type,
    [Cat7.OPERATOR_NAME]: conversationHistory.getData().operator_name,
  };
};

export const getIdentifiedRecommendationFiltersFromConversationHistoryData = (
  conversationHistory: ConversationHistory
): IdentifiedRecommendationFilters => {
  return {
    [Cat1.MAX_POWER]: conversationHistory.getData().max_power,
    [Cat1.MIN_POWER]: conversationHistory.getData().min_power,
    [Cat7.DATE_TIME]: getNonDefaultDateTimeValue(conversationHistory.getRawDateTime()),
    [Cat7.POWER_TYPE]: getNonDefaultPowerTypeValue(conversationHistory.getData().power_type),
    [Cat7.OPERATOR_NAME]: conversationHistory.getOperatorName(),
    [Cat8.CONNECTOR_TYPE]: conversationHistory.getConnectorType(),
  };
};

const getNonDefaultPowerTypeValue = (val: string) => {
  return val === 'both' ? undefined : val;
}

export const getNonDefaultDateTimeValue = (val: string) => {
  return differenceInMinutes(new Date(), parse(val, 'yyyy-MM-dd HH:mm:ss', new Date())) < 5 ? undefined : val;
}