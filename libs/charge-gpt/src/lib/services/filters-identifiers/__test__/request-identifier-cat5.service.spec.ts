import { cat5FewShotExamples } from '../../rag-services/cat5-few-shots.model';
import { getPrompt } from '../request-identifier-cat5.service';
import { quickTaskService } from './quick-task.service';
import { formatJSONFewShot } from './few-shots-formatter.service';
import { disconnectRagClient } from '../../rag-services/rag-client.service';
import { ProjectOutputType } from '../../chat-gpt.service';


const testRequests = cat5FewShotExamples.map(formatJSONFewShot);

describe.each(testRequests)('Request Ident Cat5 Service', (summary, userRequest, expectedResult) => {

  const filtersString = '';
  const outputType = 'filters' as ProjectOutputType;

  it(`Request: "${userRequest}" should return "${expectedResult === null ? expectedResult : JSON.stringify(expectedResult)}" ${!summary ? '' : `with summary ${summary}`}`, async () => {
    const prompt = await getPrompt(outputType, userRequest, filtersString, summary, 'TEST');

    const response = await quickTaskService(prompt);
    const result = response === 'null' ? null : JSON.parse(response);
    expect(result).toEqual(expectedResult);
  });

  afterAll(async () => {
    await disconnectRagClient();
  });
});
