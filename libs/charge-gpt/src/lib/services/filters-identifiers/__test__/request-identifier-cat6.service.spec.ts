import { getPrompt } from '../request-identifier-cat6.service';
import { quickTaskService } from './quick-task.service';
import { formatJSONFewShot } from './few-shots-formatter.service';
import { cat6FewShotExamples } from '../../rag-services/cat6-few-shots.model';
import { addFinalSystemPrompt } from '../request-identifier-cat6.service';
import { disconnectRagClient } from '../../rag-services/rag-client.service';
import { ProjectOutputType } from '../../chat-gpt.service';

const testRequests = cat6FewShotExamples.map(formatJSONFewShot);

describe.each(testRequests)('Request Ident Cat6 Service', (summary, userRequest, expectedResult) => {

  const filtersString = '';
  const outputType = 'filters' as ProjectOutputType;

  it(`Request: "${userRequest}" should return "${expectedResult === null ? expectedResult : JSON.stringify(expectedResult)}" ${!summary ? '' : `with summary ${summary}`}`, async () => {

    const prompt = await getPrompt(outputType, userRequest, filtersString, summary, 'TEST');    
    const output = await quickTaskService(prompt);
    addFinalSystemPrompt(prompt, output);
    const finalOutput = await quickTaskService(prompt);
    const result = finalOutput === 'null' ? null : JSON.parse(finalOutput);

    if (expectedResult === null) {
      if (result === null) {
        expect(result).toBeNull();
      } else {
        expect(result?.type_of_locations ?? []).toHaveLength(0);
        expect(!!result?.type_of_locations_enabled).toBe(false);
        expect(!!result?.power_enabled).toBe(false);
      }
    } else {
      if (result === null) {
        expect(result).toEqual(expectedResult);
      } else {
        expect((result.type_of_locations ?? []).map((item: any) => item.toLowerCase()).sort()).toEqual(((expectedResult as any).type_of_locations ?? []).map((item: any) => item.toLowerCase()).sort());
        expect(result.type_of_locations_enabled).toBe((expectedResult as any).type_of_locations_enabled);
        expect(result.power_enabled).toBe((expectedResult as any).power_enabled); 
      }
    }
  });

  afterAll(async () => {
    await disconnectRagClient();
  });
});
