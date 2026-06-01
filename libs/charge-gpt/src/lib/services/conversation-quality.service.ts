import { sendChargeGptCustomMetric } from '@fronyx/cloudwatch-logger';
import { configService } from '@fronyx/configurations';
import {
  conversationLanguage,
  conversationEngagement,
  interactionType,
  project,
  filtersInteractionType,
  filtersConversationLanguage,
  destinationPromptEvaluationScore,
  destinationPromptEvaluationFeedback,
  refinementPromptEvaluationScore,
  refinementPromptEvaluationFeedback,
  filterPromptEvaluationScore,
  filterPromptEvaluationFeedback,
  recommendationsTokenUsage,
  filtersTokenUsage,
  recommendations,
  recommendationsNumberOfTurnsSubcomponent,
  filtersNumberOfTurnSubcomponent,
  filterConversationCountUntilSuccess,
  filtersOverallConversationCount,
  filtersConversationEngagement,
  conversationRequestTime,
  feedbackQuality,
} from '../models/name-value-metric';

const sendMetric = async (
  property: string,
  projectName: string,
  dimensionName: string,
  dimensionValue: string,
  propertyValue?: number
) => {
  const messages = [
    {
      property,
      value: isNaN(propertyValue) ? 1 : propertyValue,
      unit: 'Count',
    },
  ];

  const dimensions = [
    {
      name: dimensionName,
      value: dimensionValue,
    },
    {
      name: project.dimension.name,
      value: projectName,
    },
  ];

  if (configService.isProduction()) {
    await sendChargeGptCustomMetric('ChargeGPT', messages, dimensions);
  }
};

export const sendRequestTimeMetric = async (
  projectName: string,
  property: string,
  propertyValue: number
) => {
  await sendMetric(
    property,
    projectName,
    conversationRequestTime.dimension.name,
    conversationRequestTime.dimension.value,
    propertyValue
  );
};

export const sendStartConversationMetric = async (projectName: string) => {
  await sendMetric(
    'start',
    projectName,
    conversationEngagement.dimension.name,
    conversationEngagement.dimension.value
  );
};

export const sendSuccessfulConversationMetric = async (projectName: string) => {
  await sendMetric(
    'successful',
    projectName,
    conversationEngagement.dimension.name,
    conversationEngagement.dimension.value
  );
};

export const sendErrorMetric = async (projectName: string) => {
  await sendMetric(
    'error',
    projectName,
    conversationEngagement.dimension.name,
    conversationEngagement.dimension.value
  );
};

export const sendVoiceInteractionMetric = async (projectName: string) => {
  await sendMetric(
    'voice',
    projectName,
    interactionType.dimension.name,
    interactionType.dimension.value
  );
};

export const sendTextInteractionMetric = async (projectName: string) => {
  await sendMetric(
    'text',
    projectName,
    interactionType.dimension.name,
    interactionType.dimension.value
  );
};

export const sendSelectedLanguageMetric = async (
  projectName: string,
  property: string
) => {
  await sendMetric(
    property,
    projectName,
    conversationLanguage.dimension.name,
    conversationLanguage.dimension.value
  );
};

export const sendRecommendationsTimeTakenForEachTurnsMetric = async (
  projectName: string,
  property: string,
  propertyValue: number
) => {
  await sendMetric(
    property,
    projectName,
    conversationEngagement.dimension.name,
    conversationEngagement.dimension.value,
    propertyValue
  );
};

export const sendRecommendationsNoTurnsMetric = async (
  projectName: string,
  property: string
) => {
  await sendMetric(
    property,
    projectName,
    conversationEngagement.dimension.name,
    conversationEngagement.dimension.value
  );
};

export const sendRecommendationsTokenUsage = async (
  projectName: string,
  property: string,
  propertyValue: number
) => {
  await sendMetric(
    property,
    projectName,
    recommendationsTokenUsage.dimension.name,
    recommendationsTokenUsage.dimension.value,
    propertyValue
  );
};

export const sendRecommendationsCountMetric = async (
  projectName: string,
  propertyValue: number
) => {
  await sendMetric(
    'recommendationsCount',
    projectName,
    recommendations.dimension.name,
    recommendations.dimension.value,
    propertyValue
  );
};

export const sendNumberOfTurnsSubcomponentMetric = async (
  projectName: string,
  propertyValue: number
) => {
  await sendMetric(
    'subcomponentSwitch',
    projectName,
    recommendationsNumberOfTurnsSubcomponent.dimension.name,
    recommendationsNumberOfTurnsSubcomponent.dimension.value,
    propertyValue
  );
};

export const sendFilterStartConversationMetric = async (
  projectName: string
) => {
  await sendMetric(
    'start',
    projectName,
    filtersConversationEngagement.dimension.name,
    filtersConversationEngagement.dimension.value
  );
};

export const sendFiltersSuccessfulConversationMetric = async (
  projectName: string
) => {
  await sendMetric(
    'successful',
    projectName,
    filtersConversationEngagement.dimension.name,
    filtersConversationEngagement.dimension.value
  );
};

export const sendFiltersVoiceInteractionMetric = async (
  projectName: string
) => {
  await sendMetric(
    'voice',
    projectName,
    filtersInteractionType.dimension.name,
    filtersInteractionType.dimension.value
  );
};

export const sendFiltersTextInteractionMetric = async (projectName: string) => {
  await sendMetric(
    'text',
    projectName,
    filtersInteractionType.dimension.name,
    filtersInteractionType.dimension.value
  );
};

export const sendFiltersSelectedLanguageMetric = async (
  projectName: string,
  property: string
) => {
  await sendMetric(
    property,
    projectName,
    filtersConversationLanguage.dimension.name,
    filtersConversationLanguage.dimension.value
  );
};

export const sendFiltersTimeTakenForEachTurnsMetric = async (
  projectName: string,
  property: string,
  propertyValue: number
) => {
  await sendMetric(
    property,
    projectName,
    filtersConversationEngagement.dimension.name,
    filtersConversationEngagement.dimension.value,
    propertyValue
  );
};

export const sendFiltersNoTurnsUntilSuccessMetric = async (
  projectName: string,
  propertyValue: number
) => {
  await sendMetric(
    'numberOfTurn',
    projectName,
    filterConversationCountUntilSuccess.dimension.name,
    filterConversationCountUntilSuccess.dimension.value,
    propertyValue
  );
};

export const sendFiltersOverallNoTurnsMetric = async (
  projectName: string,
  propertyValue: number
) => {
  await sendMetric(
    'numberOfTurn',
    projectName,
    filtersOverallConversationCount.dimension.name,
    filtersOverallConversationCount.dimension.value,
    propertyValue
  );
};

export const sendFiltersTokenUsage = async (
  projectName: string,
  property: string,
  propertyValue: number
) => {
  await sendMetric(
    property,
    projectName,
    filtersTokenUsage.dimension.name,
    filtersTokenUsage.dimension.value,
    propertyValue
  );
};

export const sendFiltersNumberOfTurnsSubcomponentMetric = async (
  projectName: string,
  propertyValue: number
) => {
  await sendMetric(
    'subcomponentSwitch',
    projectName,
    filtersNumberOfTurnSubcomponent.dimension.name,
    filtersNumberOfTurnSubcomponent.dimension.value,
    propertyValue
  );
};

export const sendDestinationPromptEvaluationScore = async (
  projectName: string,
  property: string,
  propertyValue: number
) => {
  await sendMetric(
    property,
    projectName,
    destinationPromptEvaluationScore.dimension.name,
    destinationPromptEvaluationScore.dimension.value,
    propertyValue
  );
};

export const sendDestinationPromptEvaluationFeedback = async (
  projectName: string,
  property: string
) => {
  await sendMetric(
    property,
    projectName,
    destinationPromptEvaluationFeedback.dimension.name,
    destinationPromptEvaluationScore.dimension.value
  );
};

export const sendRefinementPromptEvaluationScore = async (
  projectName: string,
  property: string,
  propertyValue: number
) => {
  await sendMetric(
    property,
    projectName,
    refinementPromptEvaluationScore.dimension.name,
    refinementPromptEvaluationScore.dimension.value,
    propertyValue
  );
};

export const sendRefinementPromptEvaluationFeedback = async (
  projectName: string,
  property: string
) => {
  await sendMetric(
    property,
    projectName,
    refinementPromptEvaluationFeedback.dimension.name,
    refinementPromptEvaluationScore.dimension.value
  );
};

export const sendFilterPromptEvaluationScore = async (
  projectName: string,
  property: string,
  propertyValue: number
) => {
  await sendMetric(
    property,
    projectName,
    filterPromptEvaluationScore.dimension.name,
    filterPromptEvaluationScore.dimension.value,
    propertyValue
  );
};

export const sendFilterPromptEvaluationFeedback = async (
  projectName: string,
  property: string
) => {
  await sendMetric(
    property,
    projectName,
    filterPromptEvaluationFeedback.dimension.name,
    filterPromptEvaluationScore.dimension.value
  );
};

export const sendFeedbackMetric = async (
  projectName: string,
  property: string
) => {
  await sendMetric(
    property,
    projectName,
    feedbackQuality.dimension.name,
    feedbackQuality.dimension.value,
    1
  );
};

export const sendRecommendationProbabilityMetric = async (
  projectName: string,
  propertyValue: number
) => {
  await sendMetric(
    'predictedAvailability',
    projectName,
    recommendations.dimension.name,
    recommendations.dimension.value,
    propertyValue
  );
};

export const sendRecommendationDistanceMetric = async (
  projectName: string,
  propertyValue: number
) => {
  await sendMetric(
    'distance',
    projectName,
    recommendations.dimension.name,
    recommendations.dimension.value,
    propertyValue
  );
};
