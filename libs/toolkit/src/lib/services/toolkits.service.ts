import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { configService } from '@fronyx/configurations';
import { firstValueFrom, map } from 'rxjs';
import { PROJECT_QUERY_ATTRIBUTES } from '../../../../../apps/cdk-apps/src/shared/models/general/toolkit.constants';
import {
  ChargegptFilterDefaultText,
  ContentFilterError,
  StartRecommendationConversation,
  ReachConversationTurnLimitError,
  RestartConversationText,
  StartFilterConversation,
} from '../../../../../apps/cdk-apps/src/shared/models/general/chargegpt-translation';
import { getTranslationOrFallback } from './toolkit-translation.service';
import { differenceInMinutes } from 'date-fns';
import axios from 'axios';
import { ToolkitProject } from '../models';

const projectsCache = new Map();

@Injectable()
export class ToolkitsService {
  constructor(private readonly http: HttpService) {}

  async getAllProjects(): Promise<ToolkitProject[]> {
    const url = `${configService.getToolkitUrl()}/items/Project?access_token=${configService.getToolkitAccessToken()}&${PROJECT_QUERY_ATTRIBUTES}`;
    const projects = await firstValueFrom(
      this.http
        .get(url)
        .pipe(
          map(({ data: { data } }) =>
            data.map((project) => new ToolkitProject(project2Payload(project)))
          )
        )
    );

    return projects.map((project) => new ToolkitProject(project));
  }

  async findProjectByApiToken(args: {
    apiToken: string;
  }): Promise<ToolkitProject> {
    const lastUpdatedKey = `${args.apiToken}_lastUpdated`;
    const lastUpdated = projectsCache.get(lastUpdatedKey);
    if (
      !lastUpdated ||
      differenceInMinutes(new Date(), new Date(lastUpdated)) > 15
    ) {
      const project = await queryProjectByToken(args.apiToken);
      projectsCache.set(args.apiToken, project);
      projectsCache.set(lastUpdatedKey, new Date());
    } else {
      return projectsCache.get(args.apiToken);
    }

    return projectsCache.get(args.apiToken);
  }
}

export const queryProjectByToken = async (
  apiToken: string
): Promise<ToolkitProject> => {
  const url = `${configService.getToolkitUrl()}/items/Project?access_token=${configService.getToolkitAccessToken()}&filter[api_token][_eq]=${apiToken}&${PROJECT_QUERY_ATTRIBUTES}`;
  const response = await axios.get(url);

  const projects = response.data.data.map(
    (project) => new ToolkitProject(project2Payload(project))
  );

  if (projects && projects.length > 0) {
    return projects[0];
  }

  return null;
};

const project2Payload = (project: any): any => {
  const startConversationDefaultText =
    project.chargegpt_output_type !== 'filters'
      ? StartFilterConversation
      : StartRecommendationConversation;

  return {
    id: project.id,
    filters: project.filters ?? [],
    is_active: project.is_active,
    api_token: project.api_token,
    data_source: project.data_source,
    name: project.name,
    queue: project.queue,
    max_timeframe: project.max_timeframe,
    server_url: project.server_url,
    is_availability: project.is_availability,
    is_chargegpt: project.is_chargegpt,
    chargegpt_languages: project.chargegpt_languages ?? [],
    chargegpt_allowed_input: project.chargegpt_allowed_input,
    chargegpt_allowed_output: project.chargegpt_allowed_output,
    chargegpt_model: project.chargegpt_model,
    external_api_token: project.external_api_token,
    rest_method: project.rest_method,
    ai_model: project.ai_model,
    party_id: project.party_id,
    prediction_frequency: project.prediction_frequency,
    response: project.response_structures,
    featureFlags: project.feature_flags ?? [],
    featureFlagsStaging: project.feature_flags_staging ?? [],
    chargegpt_accepted_urls: project.chargegpt_accepted_urls ?? [],
    chargegpt_output_type: project.chargegpt_output_type,
    chargegpt_filter_config: project.chargegpt_filter_config ?? [],
    chargegpt_assistant_name: project.chargegpt_assistant_name ?? 'ChargeGPT',
    chargegpt_company_name: project.chargegpt_company_name ?? 'Fronyx',
    chargegpt_filter_text: getTranslationOrFallback(
      project.chargegpt_filter_tex,
      ChargegptFilterDefaultText
    ),
    chargegpt_filter_text_address: getTranslationOrFallback(
      project.chargegpt_filter_text_address,
      ChargegptFilterDefaultText
    ),
    chargegpt_filter_text_nearby: getTranslationOrFallback(
      project.chargegpt_filter_text_nearby,
      ChargegptFilterDefaultText
    ),
    chargegpt_filter_start: getTranslationOrFallback(
      project.chargegpt_filter_start,
      startConversationDefaultText
    ),
    chargegpt_filter_turns_limit: getTranslationOrFallback(
      project.chargegpt_filter_turns_limit,
      ReachConversationTurnLimitError
    ),
    chargegpt_filter_malicious_term: getTranslationOrFallback(
      project.chargegpt_filter_malicious_term,
      ContentFilterError
    ),
    chargegpt_restart_conversation: getTranslationOrFallback(
      project.chargegpt_restart_conversation,
      RestartConversationText
    ),
    chargegpt_support_contact: project.chargegpt_support_contact,
    chargegpt_charge_point_recommendation_count:
      getRecommendationChargePointCount(
        project.chargegpt_charge_point_recommendation_count
      ),
  };
};

export const getSupportedCountriesFromProject = (
  project: ToolkitProject
): string[] => {
  return project.filters
    .filter(({ attribute }) => attribute === 'country')
    .map(({ value }) => value);
};

const getRecommendationChargePointCount = (count: number): number => {
  const defaultValue = 3;

  if (isNaN(count)) {
    return defaultValue;
  }

  if (count > defaultValue) {
    return defaultValue;
  }

  return count;
};

export const isRoutingEnabled = (project: ToolkitProject) => {
  const featureFlags = project.getFeatureFlags(configService.isProduction());

  return featureFlags['chargegpt_routing_subcomponent'] ?? false;
};
