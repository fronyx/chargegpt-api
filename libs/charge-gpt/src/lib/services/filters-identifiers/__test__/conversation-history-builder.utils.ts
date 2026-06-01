import { ToolkitProject } from '@fronyx/toolkit';
import { initializeChargeGPTConversation } from '../../conversation-factory.service';

interface FF {
  chargegpt_routing_subcomponent: boolean;
  chargegpt_recommendations_power_type_fallback: boolean;
}

const DefaultFF = {
  chargegpt_routing_subcomponent: false,
  chargegpt_recommendations_power_type_fallback: false,
};

export const buildProjectForTest = (
  overrideFF: {
    chargegpt_routing_subcomponent: boolean;
    chargegpt_recommendations_power_type_fallback: boolean;
  } = { ...DefaultFF }
) => {
  const featureFlags = [];

  if (overrideFF.chargegpt_routing_subcomponent) {
    featureFlags.push('chargegpt_routing_subcomponent');
  }

  if (overrideFF.chargegpt_recommendations_power_type_fallback) {
    featureFlags.push('chargegpt_recommendations_power_type_fallback');
  }

  const project = new ToolkitProject({
    chargegpt_output_type: 'recommendations',
    chargegpt_assistant_name: 'Fronyx Assistant',
    chargegpt_company_name: 'Fronyx',
    chargegpt_charge_point_recommendation_count: 3,
    data_source: 'FRK',
    chargegpt_filter_malicious_term: {},
    response: [],
    filters: [{ attribute: 'country', value: 'DEU' }],
    chargegpt_support_contact: [
      { attribute: 'phone', value: '1234' },
      { attribute: 'email', value: 'email' },
    ],
    featureFlags,
    featureFlagsStaging: featureFlags,
    name: 'Fronyx',
    lang: 'en',
  } as any);

  return project;
};

export const buildHistoryAndProjectForTest = (overrideFF?: FF) => {
  const project = buildProjectForTest(overrideFF);

  const history = initializeChargeGPTConversation({
    clientTimestamp: Date.now(),
    language: 'en',
    featureFlags: {
      chargegpt_routing_subcomponent:
        project.feature_flags.chargegpt_routing_subcomponent,
      chargegpt_recommendations_power_type_fallback:
        project.feature_flags.chargegpt_recommendations_power_type_fallback,
    },
    timezoneOffset: -120,
    project,
  });

  return {
    history,
    project,
  };
};
