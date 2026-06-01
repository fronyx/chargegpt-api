import { ProjectOutputType } from '../../chat-gpt.service';
import { addFinalSystemPrompt, getPrompt } from '../request-identifier-postfix.service';
import { quickTaskService } from './quick-task.service';
import { formatPostfixFewShot } from './few-shots-formatter.service';
import { postfixFewShotExamples } from '../../rag-services/postfix-few-shots.model';
import { disconnectRagClient } from '../../rag-services/rag-client.service';

const testRequests = postfixFewShotExamples.map(formatPostfixFewShot);

describe.each(testRequests)('Request Ident Postfix Service', (summary, userRequest, expectedResult, identifiedFilters) => {
  const outputType = 'filters' as ProjectOutputType;
  const language = 'pt';

  it(`Request: "${userRequest}" should return "${expectedResult === null ? expectedResult : true}" ${!identifiedFilters ? '' : `with identified filters ${identifiedFilters}`}`, async () => {
    const prompt = await getPrompt(outputType, userRequest, language);
    const output = await quickTaskService(prompt);
    addFinalSystemPrompt(prompt, output, identifiedFilters, language);
    const finalOutput = await quickTaskService(prompt);
    const result = finalOutput === 'null' ? null : true;
    if (expectedResult === null) {
      const postfix = finalOutput === 'null' ? null : JSON.parse(finalOutput).postfix;
      expect(postfix).toBeNull();
    } else {
      expect(result).toEqual(expectedResult);
    }
  });

  afterAll(async () => {
    await disconnectRagClient();
  });
});