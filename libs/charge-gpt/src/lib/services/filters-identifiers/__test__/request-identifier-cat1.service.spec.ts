import { ProjectOutputType } from '../../chat-gpt.service';
import { cat1FewShotExamples } from '../../rag-services/cat1-few-shots.model';
import { getPrompt } from '../request-identifier-cat1.service';
import { quickTaskService } from './quick-task.service';
import { formatJSONFewShot } from './few-shots-formatter.service';
import { disconnectRagClient } from '../../rag-services/rag-client.service';

const testRequests = cat1FewShotExamples.map(formatJSONFewShot);

describe.each(testRequests)('Request Ident Cat1 Service', (summary, userRequest, expectedResult) => {
  const filtersString = '';
  const outputType = 'filters' as ProjectOutputType;

  it(`Request: "${userRequest}" should return "${expectedResult === null ? expectedResult : JSON.stringify(expectedResult)}"`, async () => {
    const prompt = await getPrompt(outputType, userRequest, filtersString, summary, 'TEST');
    const response = await quickTaskService(prompt);
    const result = response === 'null' ? null : JSON.parse(response);
    expect(result).toEqual(expectedResult);
  });

  afterAll(async () => {
    await disconnectRagClient();
  });
});