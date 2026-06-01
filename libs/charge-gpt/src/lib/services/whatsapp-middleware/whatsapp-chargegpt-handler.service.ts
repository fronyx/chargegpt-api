import { configService } from '@fronyx/configurations';
import { IChargeGPTControllerHandlerService } from '../chargegpt-controller-handler.service';
import axios from 'axios';
import { useTryAsync } from 'no-try';
import { ToolkitProject } from '@fronyx/toolkit';

const getBaseURL = () => {
  if (configService.isStaging() || configService.isProduction()) {
    return 'https://api.example.com/api/charge-gpt/conversation';
  }

  return 'http://localhost:3333/api/charge-gpt/conversation';
};

const getFronyxClient = (project: ToolkitProject) => {
  const baseURL = getBaseURL();

  return axios.create({
    baseURL,
    headers: {
      'x-api-token': project.api_token,
    },
  });
};

export const whatsAppChargeGPTHandlerService: IChargeGPTControllerHandlerService =
  {
    findChargegptRecommendations: async (
      project,
      params,
      body,
      retryCount = 0
    ) => {
      const MAX_RETRY_COUNT = 3;

      const [err, response]: any = await useTryAsync(() => {
        return getRecommendations(project, params, body);
      });

      if (err && retryCount < MAX_RETRY_COUNT) {
        retryCount++;

        await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));

        return whatsAppChargeGPTHandlerService.findChargegptRecommendations(
          project,
          params,
          body,
          retryCount
        );
      }

      if (err) {
        console.error(
          'Error calling recommendations endpoint:',
          (err as any).response
        );

        return null;
      }

      if ((response as any).status === 201) {
        return (response as any).data;
      }

      return null;
    },
  };

const getRecommendations = (project, params, body): any => {
  const client = getFronyxClient(project);

  return client.post(`/${params.conversationId}/recommendations`, body);
};

