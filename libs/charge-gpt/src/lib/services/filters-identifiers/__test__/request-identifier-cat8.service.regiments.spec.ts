import { disconnectRagClient } from '../../rag-services/rag-client.service';
import { ProjectOutputType, quickCompletion } from '../../chat-gpt.service';
import { getTestRegimentsPayload } from '../../__test__/test-regiment-utils.service';
import { getPrompt, necessaryInformation, parseCat8QuickTaskOutput } from '../request-identifier-cat8.service';
import { getTestCounter } from './test-counter.utils';

const filtersInScope = necessaryInformation();
const cat8Requests = getTestRegimentsPayload('cat8-unit-tests.json');

const testCounter = getTestCounter(cat8Requests);

describe.each(cat8Requests)('Regiment: Request Ident Cat8 Service', ({request, response, summary, id, prevFilters}) => {
  jest.setTimeout(10 * 60 * 1000); // 10 minutes timeout

  const filtersString = prevFilters ?? '';
  const outputType = 'recommendations' as ProjectOutputType;
  const projectName = 'Fronyx';
  const projectOutputType = 'recommendations' as ProjectOutputType;
  const conversationId = 'fooId';
  const language = 'en';

  it(`Request: [[${id}]] "${request}" should return "${response === null ? response : JSON.stringify(response)}"`, async () => {
    testCounter.log();

    const prompt = await getPrompt(Date.now(), filtersInScope, outputType, request, filtersString, !summary ? '' : summary, 'TEST');

    const { chatGptResponse } = await quickCompletion(
        prompt,
        conversationId,
        projectName,
        projectOutputType,
        language
      );

    const result = chatGptResponse === 'null' ? null : parseCat8QuickTaskOutput(chatGptResponse, undefined);
    
    if (result === null) {
      expect(result).toEqual(response);
    } else if (response === null) {
      const parsedResults = result.request;

      if ([parsedResults.connector_type].every(val => !val)) {
        expect(null).toEqual(response);
      } else {
        expect(parsedResults).toEqual(response);
      }
    } else {
      const parsedResults = result.request;

      if ([parsedResults.connector_type].every(val => val === null)) {
        expect(null).toEqual(response);
      } else {
        if (parsedResults.connector_type && response.connector_type) {
          expect((parsedResults.connector_type as string).toLowerCase()).toEqual(response.connector_type.toLowerCase());
        } else {
          expect(parsedResults.connector_type).toEqual(response.connector_type);
        }
      }
    }
  });

  afterAll(async () => {
    await disconnectRagClient();
  });
});