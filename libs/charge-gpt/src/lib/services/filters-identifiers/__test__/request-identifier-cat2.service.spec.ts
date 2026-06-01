import { cat2FewShotExamples } from '../../rag-services/cat2-few-shots.model';
import { getPrompt, necessaryInformation } from '../request-identifier-cat2.service';
import { quickTaskService } from './quick-task.service';
import { formatJSONFewShot } from './few-shots-formatter.service';
import { filterValidSettingsFromResponse } from '../request-identifier.utils';
import { disconnectRagClient } from '../../rag-services/rag-client.service';
import { ProjectOutputType } from '../../chat-gpt.service';


const testRequests = cat2FewShotExamples.map(formatJSONFewShot);

describe.each(testRequests)('Request Ident Cat2 Service', (summary, userRequest, expectedResult) => {
  const filtersString = '';
  const outputType = 'filters' as ProjectOutputType;

  it(`Request: "${userRequest}" should return "${expectedResult === null ? expectedResult : JSON.stringify(expectedResult)}" ${!summary ? '' : `with summary ${summary}`}`, async () => {
    const prompt = await getPrompt(outputType, userRequest, filtersString, summary, 'TEST');
    const response = await quickTaskService(prompt);
    const result = response === 'null' ? null : JSON.parse(response);
    if (expectedResult === null) {
      expect(result).toBeNull();
    } else {
      const validFilters = result !== null ? filterValidSettingsFromResponse(result, Object.keys(necessaryInformation)) : {};

      if (!Object.keys(validFilters).length) {
        expect(null).toBeNull();
      } else {
        expect(validFilters).toEqual(expectedResult);
      }
    }
  });

  afterAll(async () => {
    await disconnectRagClient();
  });
});