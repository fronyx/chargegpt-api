import { configService } from '@fronyx/configurations';
import 'openai/shims/node';
import { AzureOpenAI } from 'openai';
import * as Sentry from '@sentry/minimal';
import { CircularLinkedList } from './rag-services/circular-linked-list.model';
import { useTryAsync } from 'no-try';

const MAX_COMPLETION_RETRY_COUNT = 9;

export const getChatCompletionConfig = (config) => {
  return {
    baseURL: `${config.url}/openai`,
    deployment: config.deploymentId,
    apiVersion: config.apiVersion,
    apiKey: config.apiKey,
  };
};

const azure4oConfigList = new CircularLinkedList();
azure4oConfigList.addNode(
  getChatCompletionConfig(configService.getAzureFrance4oConfig())
);
azure4oConfigList.addNode(
  getChatCompletionConfig(configService.getAzureSweden4oConfig())
);
azure4oConfigList.addNode(
  getChatCompletionConfig(configService.getAzureUKSouth4oConfig())
);

const generateTargetServerConfigs = (serversNode) => {
  let configCount = 0;
  const servers = [];

  while (configCount <= MAX_COMPLETION_RETRY_COUNT) {
    if (configCount < MAX_COMPLETION_RETRY_COUNT) {
      servers.push(serversNode);
    }

    configCount++;
  }

  return servers;
};

export const chatStreamCompletion = async (messages, streamClient) => {
  const events = await streamClient.chat.completions.create({
    stream: true,
    messages: messages,
    model: '',
  });

  const data = [];
  const output = {
    data: {
      choices: [],
    },
  };

  const processEvents = () => {
    return new Promise((resolve, reject) => {
      (async () => {
        const firstEventTimeout = setTimeout(() => {
          reject(new Error('Timeout to first event'));
        }, 10);

        for await (const event of events) {
          clearTimeout(firstEventTimeout);

          for (const choice of event.choices) {
            data.push(choice.delta?.content);

            if (choice.finish_reason === 'stop') {
              output.data.choices.push({
                finish_reason: 'stop',
                message: {
                  content: data.join(''),
                },
              });
              resolve(output);
            }

            if (choice.finish_reason === 'content_filter') {
              output.data.choices.push({
                finish_reason: 'content_filter',
                message: null,
                content_filter_results: (choice as any).content_filter_results,
              });
              resolve(output);
            }
          }
        }
      })();
    });
  };

  return processEvents();
};

export const azureCompletionClient = {
  post: async (messages) => {
    const streamText = async (
      targetConfigs = generateTargetServerConfigs(azure4oConfigList)
    ) => {
      const [targetConfig, ...restConfigs] = targetConfigs;
      const config = targetConfig.getNextNode().value;
      const client = new AzureOpenAI(config);

      const [err, res] = await useTryAsync(() =>
        chatStreamCompletion(messages, client)
      );

      if (err && restConfigs.length > 0) {
        return streamText(restConfigs);
      }

      if (err) {
        Sentry.captureException(err);
        throw err;
      }

      return res;
    };

    return streamText();
  },
};
