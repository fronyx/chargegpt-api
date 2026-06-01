import { cat3FewShotExamples } from '../../rag-services/cat3-few-shots.model';
import { getPrompt } from '../request-identifier-cat3.service';
import { quickTaskService } from './quick-task.service';
import { formatJSONFewShot } from './few-shots-formatter.service';
import { disconnectRagClient } from '../../rag-services/rag-client.service';
import { ProjectOutputType } from '../../chat-gpt.service';

const testRequests = cat3FewShotExamples.map(formatJSONFewShot);

describe.each(testRequests)('Request Ident Cat3 Service', (summary, userRequest, expectedResult) => {
  const filtersString = '';
  const outputType = 'filters' as ProjectOutputType;

  it(`Request: "${userRequest}" should return "${expectedResult === null ? expectedResult : JSON.stringify(expectedResult)}"`, async () => {
    const prompt = await getPrompt(outputType, userRequest, filtersString, summary, 'TEST');
    const response = await quickTaskService(prompt);
    const result = response === 'null' ? null : JSON.parse(response);
    if (expectedResult === null) {
      expect(result).toBeNull();
    } else {
      expect({
        only_4_or_5_stars: !!result.only_4_or_5_stars,
        only_public: !!result.only_public,
      }).toEqual({
        only_4_or_5_stars: !!(expectedResult as any).only_4_or_5_stars,
        only_public: !!(expectedResult as any).only_public,
      });
    }
  });

  afterAll(async () => {
    await disconnectRagClient();
  });
});