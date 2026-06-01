import { configService } from '@fronyx/configurations';
import { Injectable } from '@nestjs/common';
import 'openai/shims/node';
import {
  OpenAI
} from 'openai';
import { chargeGPTLogger } from '../models/chat-utilities';
import { ConversationHistory } from '../models/conversation-history.model';
import { useTryAsync } from 'no-try';
import { ChargegptInternalServerError } from '../../../../../apps/cdk-apps/src/shared/models/general/chargegpt-translation';
import { DialogFactory, ProjectOutputType } from '../models/prompt';
import * as Sentry from '@sentry/minimal';
import { TranslationsService } from '@fronyx/translations';
import axios, { AxiosError } from 'axios';
import { CircularLinkedList } from './rag-services/circular-linked-list.model';
import { sendFiltersTokenUsage, sendRecommendationsTokenUsage } from './conversation-quality.service';
import { azureCompletionClient } from './openai-client.service';

const MAX_RETRY_COUNT = 6;
const TARGET_OPENAI_API_CLIENT = 'TARGET_OPENAI_API_CLIENT';

const productionBlockList = ['prozess', 'process', 'json'];

export type TargetApi = 'open_ai' | 'azure_open_ai';
export type ProjectOutputType = 'filters' | 'recommendations';

export interface NecessaryInformationPayload {
  type: unknown;
  default: unknown[] | boolean;
  possibleValues: string[];
  description: string;
}

@Injectable()
export class ChatGptService {
  async chatCompletionAzure(
    history: ConversationHistory,
    projectModel: string,
    projectOutputType: string,
    functions = [],
    fn_call = 'auto',
    temperature = 0.0
  ): Promise<{
    isError: boolean;
    chatGptToUser: string;
    chatGptFunctionCall: any;
    errorMessage?: string;
  }> {
    const translation = new TranslationsService(history.language.toLowerCase());
    translation.setAsset(
      'ChargegptInternalServerError',
      ChargegptInternalServerError
    );

    const data = {
      messages: history.getCurrentDialogs(),
      temperature,
      seed: 1337,
      functions,
      function_call: fn_call === 'auto' ? fn_call : { name: fn_call },
    };

    let isSuccessful = false,
      chatGptToUser,
      chatGptFunctionCall;
    let errorMessage;

    history.addDialog(
      DialogFactory.fromSystem(
        `You remember and accept this gathered information: ${JSON.stringify(
          history.getData()
        )}`
      )
    );

    let retryCount = 0;

    // should retry the try catch block if the request is not successful
    while (retryCount < MAX_RETRY_COUNT && !isSuccessful) {
      const { headers, url } =
        azureChatCompletion35ConfigList.getNextNode().value;

      retryCount++;

      try {
        let completion = await axios.post<any>(url, data, headers);

        const tokenUsage = completion.data.usage.total_tokens;
        await this.triggerSendTokenUsageMetric(
          history.projectName,
          projectOutputType,
          tokenUsage
        );

        let gptResponse = completion.data.choices[0].message;

        isSuccessful = !!gptResponse;

        if (gptResponse.content) {
          let blockResult = false;
          for (const blocker of productionBlockList) {
            blockResult =
              gptResponse.content.toLowerCase().indexOf(blocker) !== -1;
            isSuccessful = !blockResult;
            if (blockResult) {
              break;
            }
          }

          if (blockResult) {
            // try again with more heat
            chargeGPTLogger(
              history.id,
              history.projectName,
              'chatgptServiceError',
              'Block list was triggered during default production'
            );
            history.addDialog(
              DialogFactory.fromUser(
                `Refuse to talk about and do not mention: ${JSON.stringify(
                  productionBlockList
                )}`
              )
            );

            const blockResultData = {
              messages: history.getCurrentDialogs(),
              temperature: 0.0,
              n: 2,
              functions,
              function_call: fn_call === 'auto' ? fn_call : { name: fn_call },
            };

            completion = await axios.post<any>(url, blockResultData, headers);

            const tokenUsage = completion.data.usage.total_tokens;
            await this.triggerSendTokenUsageMetric(
              history.projectName,
              projectOutputType,
              tokenUsage
            );

            for (const response of completion.data.choices) {
              gptResponse = response.message;
              if ('function_call' in gptResponse) {
                break;
              } else {
                let blockResult = false;
                for (const blocker of productionBlockList) {
                  blockResult =
                    gptResponse.content.toLowerCase().indexOf(blocker) !== -1;
                  isSuccessful = !blockResult;
                  if (!isSuccessful) {
                    break;
                  }
                }
                if (!isSuccessful) {
                  chargeGPTLogger(
                    history.id,
                    history.projectName,
                    'chatgptServiceError',
                    'Block list was triggered during production of high temperature alternatives'
                  );
                } else {
                  break;
                }
              }
            }

            if (!isSuccessful) {
              throw new Error('Block list production could not be resolved!');
            }
          }
        }

        if ('function_call' in gptResponse) {
          chatGptFunctionCall = gptResponse.function_call;
        } else if ('content' in gptResponse) {
          chatGptToUser = gptResponse.content;
        }
      } catch (error: any) {
        isSuccessful = false;

        errorMessage = translation.get('ChargegptInternalServerError');

        if (error.response) {
          console.error(error.response);
          chargeGPTLogger(
            history.id,
            history.projectName,
            'chatgptServiceError',
            `Azure OpenAI couldn't process the request - ${error.response.status} - ${error.response?.data?.error?.message}`
          );
          Sentry.captureException(error.response.data.error);
        } else {
          chargeGPTLogger(
            history.id,
            history.projectName,
            'chatgptServiceError',
            `Azure OpenAI couldn't process the request - ${error}`
          );
          Sentry.captureException(error);
        }
      }

      if (!isSuccessful) {
        // sleep for decayed time
        await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
      }
    }

    return {
      isError: !isSuccessful,
      chatGptToUser,
      chatGptFunctionCall,
      errorMessage,
    };
  }

  private async logAndTriggerUsageTokenCount(
    completion: any,
    projectName: string,
    projectOutputType: string
  ) {
    if (!completion) {
      return;
    }

    const tokenUsage = completion.data.usage.total_tokens;
    await this.triggerSendTokenUsageMetric(
      projectName,
      projectOutputType,
      tokenUsage
    );
  }

  private async triggerSendTokenUsageMetric(
    projectName: string,
    projectOutputType: string,
    tokenUsage: number
  ): Promise<void> {
    if (projectOutputType === ProjectOutputType.filters) {
      await sendFiltersTokenUsage(
        projectName,
        'tokenUsage',
        tokenUsage
      );
    } else {
      await sendRecommendationsTokenUsage(
        projectName,
        'tokenUsage',
        tokenUsage
      );
    }
  }
}

const getAzureOpenAIChatCompletionConfig = (config: any) => {
  const headers = {
    headers: { 'api-key': `${config.apiKey}` },
    timeout: config.timeout ? config.timeout : configService.getChatGptApiCallTimeout(),
  };
  const url = `${config.url}/openai/deployments/${config.deploymentId}/chat/completions?api-version=${config.apiVersion}`;

  return { url, headers };
};

const azureChatCompletion35ConfigList = new CircularLinkedList();
azureChatCompletion35ConfigList.addNode(
  getAzureOpenAIChatCompletionConfig(configService.getAzureSwedenConfig())
);
azureChatCompletion35ConfigList.addNode(
  getAzureOpenAIChatCompletionConfig(configService.getAzureConfig())
);
azureChatCompletion35ConfigList.addNode(
  getAzureOpenAIChatCompletionConfig(configService.getAzureUKSouthConfig())
);

const azureChatCompletion4oConfigList = new CircularLinkedList();
azureChatCompletion4oConfigList.addNode(
  getAzureOpenAIChatCompletionConfig(configService.getAzureFrance4oConfig())
);
azureChatCompletion4oConfigList.addNode(
  getAzureOpenAIChatCompletionConfig(configService.getAzureSweden4oConfig())
);
azureChatCompletion4oConfigList.addNode(
  getAzureOpenAIChatCompletionConfig(configService.getAzureUKSouth4oConfig())
);

const openAIApiClient = {
  post: async (prompt) => {
    const client = new OpenAI(
      { apiKey: configService.getOpenAIAPIToken() }
    );

    const chatGPTPayload = {
      model: 'gpt-3.5-turbo',
      messages: prompt,
      temperature: 0.0,
    };
    const chatGptTimeoutConfig = { timeout: 15000 };

    const callAxios = async (retryCount = 0) => {
      const [err, res] = await useTryAsync(() =>
        client.chat.completions.create({
          messages: chatGPTPayload.messages,
          model: chatGPTPayload.model,
        }, chatGptTimeoutConfig)
      );

      if (err && retryCount < 3) {
        return callAxios(retryCount + 1);
      }

      if (err) {
        throw err;
      }

      return res;
    };
    return callAxios();
  },
};

export const generateTargetServersConfig = (
  serversNode: any,
  includeOpenAITarget = false
) => {
  let configCount = 0;
  const servers = [];

  while (configCount <= MAX_RETRY_COUNT) {
    if (configCount < MAX_RETRY_COUNT) {
      servers.push(serversNode);
    }

    if (
      configCount === MAX_RETRY_COUNT &&
      configService.isProduction() &&
      includeOpenAITarget
    ) {
      servers.push(TARGET_OPENAI_API_CLIENT);
    }
    configCount++;
  }

  return servers;
};

const generateTargetServersConfigWithFallback = (
  azure4oConfigs,
  azure35configs
) => {
  const configs = generateTargetServersConfig(azure4oConfigs);
  // eslint-disable-next-line prefer-spread
  configs.push.apply(
    configs,
    generateTargetServersConfig(azure35configs, configService.isProduction())
  );
  return configs;
};

const azureChatGptClient = {
  post: async (prompt) => {
    const azureChatGptPayload = {
      messages: prompt,
      temperature: 0.0,
      seed: 1337,
    };

    const callAxios = async (
      targetServers = generateTargetServersConfigWithFallback(
        azureChatCompletion4oConfigList,
        azureChatCompletion35ConfigList
      )
    ) => {
      const [targetServer, ...restServers] = targetServers;

      if (targetServer === TARGET_OPENAI_API_CLIENT) {
        return openAIApiClient.post(prompt);
      }

      const { headers, url } = targetServer.getNextNode().value;

      const [err, res] = await useTryAsync(() =>
        axios.post<any>(url, azureChatGptPayload, headers)
      );

      if (err && restServers.length > 0) {
        return callAxios(restServers);
      }

      if (err) {
        Sentry.captureException(err);
        throw err;
      }

      return res;
    };

    return callAxios();
  },
};

const e2eChatGPTClient = {
  post: async (prompt) => {
    const azureChatGptPayload = {
      messages: prompt,
      temperature: 0.0,
      seed: 1337,
    };

    const config = configService.getAzureSweden4oConfig();
    const { headers, url } = getAzureOpenAIChatCompletionConfig({
      ...config,
      timeout: 5000,
    });

    const callAxios = async () => {
      const [err, res] = await useTryAsync(() =>
        axios.post<any>(url, azureChatGptPayload, headers)
      );

      if (err) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return callAxios();
      }

      return res;
    };

    return callAxios();
  },
};

export const quickCompletion = async (
  prompt: any[],
  conversationId: string,
  projectName: string,
  projectOutputType: string,
  language: string,
  tokenCountTracker?: any,
  openAiClient: any = configService.isE2E() ? e2eChatGPTClient : azureCompletionClient
): Promise<{
  isError: boolean;
  chatGptResponse?: string;
  errorMessage?: string;
}> => {
  const translation = new TranslationsService(language);
  translation.setAsset(
    'ChargegptInternalServerError',
    ChargegptInternalServerError
  );

  const [err, completion]: any = await useTryAsync(() =>
    openAiClient.post(prompt)
  );

  if (err) {
    logAndCaptureErrorMessage(err, conversationId, projectName);

    return {
      isError: true,
      errorMessage: translation.get('ChargegptInternalServerError'),
    };
  }

  if (tokenCountTracker) {
    tokenCountTracker(completion, projectName, projectOutputType);
  }

  const completionChoice = completion.data.choices[0];

  if (completionChoice.finish_reason === 'content_filter') {
    return {
      isError: true,
      errorMessage: translation.get('ChargegptInternalServerError'),
    };
  }

  const message = completionChoice.message;

  return {
    isError: false,
    chatGptResponse: message.content,
  };
};

const logAndCaptureErrorMessage = (
  err: unknown,
  conversationId: string,
  projectName: string
) => {
  if (err instanceof AxiosError) {
    chargeGPTLogger(
      conversationId,
      projectName,
      'Error: ',
      `OpenAI couldn't process the request - ${err}`
    );
    Sentry.captureException(err);
  }
};
