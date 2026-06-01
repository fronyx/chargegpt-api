import { SUPPORTED_PEER_ID } from '@fronyx/data-transfer-object';
import { FilterConfig } from './filter-config';
import { LocationFilter } from './location-filter.interface';
import { ResponseStructure } from './response-structure.interface';
import { SupportContact } from './support-contact.interface';

export class ToolkitProject implements Readonly<ToolkitProject> {
  id: number;
  filters: LocationFilter[];
  api_token: string;
  is_active: boolean;
  data_source: SUPPORTED_PEER_ID;
  queue: string;
  name: string;
  max_timeframe: number;
  server_url: string;
  rest_method: string;
  external_api_token: string;
  ai_model: string;
  party_id: string;
  prediction_frequency: 'PERIODIC' | 'REAL_TIME';
  is_availability: boolean;
  is_chargegpt: boolean;
  chargegpt_languages: string[];
  feature_flags: Record<string, boolean>;
  feature_flags_staging: Record<string, boolean>;
  chargegpt_allowed_input: string;
  chargegpt_allowed_output: string;
  chargegpt_model: string;
  response: ResponseStructure[];
  chargegpt_accepted_urls: string[];
  chargegpt_output_type: string;
  chargegpt_filter_config: FilterConfig[]; // TODO seems like this data type is wrong
  chargegpt_assistant_name: string;
  chargegpt_company_name: string;
  chargegpt_filter_text: Record<string, string>;
  chargegpt_filter_text_address: Record<string, string>;
  chargegpt_filter_text_nearby: Record<string, string>;
  chargegpt_filter_start: Record<string, string>;
  chargegpt_filter_turns_limit: Record<string, string>;
  chargegpt_filter_malicious_term: Record<string, string>;
  chargegpt_restart_conversation: Record<string, string>;
  chargegpt_support_contact: SupportContact[];
  chargegpt_charge_point_recommendation_count: number;

  constructor(args: {
    id: number;
    filters: LocationFilter[];
    api_token: string;
    is_active: boolean;
    data_source: string;
    queue: string;
    name: string;
    max_timeframe: number;
    server_url: string;
    rest_method: string;
    external_api_token: string;
    ai_model: string;
    party_id: string;
    prediction_frequency: string;
    is_availability: boolean;
    is_chargegpt: boolean;
    chargegpt_languages: string[];
    chargegpt_allowed_input: string;
    chargegpt_allowed_output: string;
    chargegpt_model: string;
    response: ResponseStructure[];
    featureFlags: string[];
    featureFlagsStaging: string[];
    chargegpt_accepted_urls: string[];
    chargegpt_output_type: string;
    chargegpt_filter_config: FilterConfig[];
    chargegpt_assistant_name: string;
    chargegpt_company_name: string;
    chargegpt_filter_text: Record<string, string>;
    chargegpt_filter_text_address: Record<string, string>;
    chargegpt_filter_text_nearby: Record<string, string>;
    chargegpt_filter_start: Record<string, string>;
    chargegpt_filter_turns_limit: Record<string, string>;
    chargegpt_filter_malicious_term: Record<string, string>;
    chargegpt_restart_conversation: Record<string, string>;
    chargegpt_support_contact: SupportContact[];
    chargegpt_charge_point_recommendation_count: number;
  }) {
    Object.assign(this, args);

    this.feature_flags = {
      chargegpt_routing_subcomponent: false,
      chargegpt_recommendations_power_type_fallback: false,
    };

    this.feature_flags_staging = {
      chargegpt_routing_subcomponent: false,
      chargegpt_recommendations_power_type_fallback: false,
    };

    this.chargegpt_languages = args.chargegpt_languages
      ? args.chargegpt_languages
          .filter((val) => !!val)
          .map((val) => val.toLowerCase())
      : ['de'];

    const activatedFeatureFlags = args.featureFlags
      ? args.featureFlags.filter((val) => !!val).map((val) => val.toLowerCase())
      : [];
    Object.keys(this.feature_flags).forEach(
      (key: string) =>
        (this.feature_flags[key] = activatedFeatureFlags.includes(key))
    );

    const activatedFeatureFlagsStaging = args.featureFlagsStaging
      ? args.featureFlagsStaging
          .filter((val) => !!val)
          .map((val) => val.toLowerCase())
      : [];
    Object.keys(this.feature_flags_staging).forEach(
      (key: string) =>
        (this.feature_flags_staging[key] =
          activatedFeatureFlagsStaging.includes(key))
    );

    // this.feature_flags['chargegpt_routing_subcomponent'] = false; // TODO
    // this.feature_flags_staging['chargegpt_routing_subcomponent'] = false; // TODO
    // this.feature_flags['chargegpt_recommendations_power_type_fallback'] = true; // TODO
    // this.feature_flags_staging['chargegpt_recommendations_power_type_fallback'] = true; // TODO
  }

  isLocationWithinScope(location: { city: string; country: string }): boolean {
    const locationFilters = this.filters.filter(
      ({ attribute }) => attribute !== 'power_type'
    );

    if (locationFilters.length < 1) {
      return true;
    }

    const countryFilters = locationFilters
      .filter(({ attribute }) => attribute === 'country')
      .map(({ value }) => value.toLowerCase());
    const cityFilters = locationFilters
      .filter(({ attribute }) => attribute === 'city')
      .map(({ value }) => value.toLowerCase());

    return (
      countryFilters.includes(location.country.toLowerCase()) ||
      cityFilters.includes(location.city.toLowerCase())
    );
  }

  isEvseWithinScope(evse: { connectors: { power_type: string }[] }): boolean {
    const powerTypeFilters = this.filters
      .filter(({ attribute }) => attribute === 'power_type')
      .map(({ value }) => value);

    if (powerTypeFilters.length < 1) {
      return true;
    }

    const powerTypes = evse.connectors.map((connector) => connector.power_type);

    return powerTypes.some((powerType) => powerTypeFilters.includes(powerType));
  }

  getFeatureFlags(isProduction: boolean) {
    return isProduction ? this.feature_flags : this.feature_flags_staging;
  }
}
