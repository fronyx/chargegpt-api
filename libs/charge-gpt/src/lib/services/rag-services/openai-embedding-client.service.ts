import { configService } from '@fronyx/configurations';
import { useTryAsync } from 'no-try';
import axios from 'axios';
import * as Sentry from '@sentry/minimal';
import { CircularLinkedList } from './circular-linked-list.model';

const getAzureOpenAIConfig = (config: any) => {
  const url = `${config.url}/openai/deployments/${config.embeddingDeploymentId}/embeddings?api-version=${config.apiVersion}`;
  const headers = {
    headers: { 'api-key': config.apiKey },
    timeout: 500,
  };

  return { url, headers };
};

const swedenConfig = configService.getAzureSwedenConfig();
const franceConfig = configService.getAzureConfig();
const ukSouthConfig = configService.getAzureUKSouthConfig();

const azureEmbeddingConfigList = new CircularLinkedList();
azureEmbeddingConfigList.addNode(getAzureOpenAIConfig(swedenConfig));
azureEmbeddingConfigList.addNode(getAzureOpenAIConfig(franceConfig));
azureEmbeddingConfigList.addNode(getAzureOpenAIConfig(ukSouthConfig));

const makeAzureApiCall = async (
  payload: {
    input: string;
  },
  retryCount = 0
) => {
  const { url, headers } = azureEmbeddingConfigList.getNextNode().value;
  const [err, completion] = await useTryAsync(() =>
    axios.post<any>(url, payload, headers)
  );

  if (err && retryCount < 3) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return makeAzureApiCall(payload, retryCount + 1);
  }

  if (err) {
    const errorResponse = (err as any).response;

    console.error('Error getting embedding:');

    if (errorResponse) {
      console.error(errorResponse);
      Sentry.captureException(errorResponse);
      throw new Error(errorResponse);
    } else {
      console.error(err);
      Sentry.captureException(err);
      throw new Error(err.message);
    }
  }

  return completion;
};

export const getEmbedding = async (input: string): Promise<number[]> => {
  const payload = { input };

  const [err, result] = await useTryAsync(() => makeAzureApiCall(payload));

  if (err) {
    return null;
  }

  return (result as any).data.data[0].embedding; // If something is weird, console log more info here
};
