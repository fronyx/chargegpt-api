import { cat7FewShotExamples } from '../../rag-services/cat7-few-shots.model';
import { getCat7DateDataTemplate, getPrompt, getValidPowerType, necessaryInformation } from '../request-identifier-cat7.service';
import { quickTaskService } from './quick-task.service';
import { formatJSONFewShot } from './few-shots-formatter.service';
import { getFewShotExamples } from '../../rag-services/get-few-shots.service';
import { disconnectRagClient } from '../../rag-services/rag-client.service';
import { ProjectOutputType } from '../../chat-gpt.service';

const currentTimestamp = 1715159600645;
const filtersInScope = necessaryInformation(currentTimestamp, 'TEST');
const testRequests = getFewShotExamples(
  cat7FewShotExamples,
  getCat7DateDataTemplate(currentTimestamp),
).map(formatJSONFewShot);

describe.each(testRequests)('Request Ident Cat7 Service', (summary, userRequest, expectedResult) => {
  const filtersString = '';
  const outputType = 'filters' as ProjectOutputType;

  it(`Request: "${userRequest}" should return "${expectedResult === null ? expectedResult : JSON.stringify(expectedResult)}"`, async () => {
    const prompt = await getPrompt(currentTimestamp, filtersInScope, outputType, userRequest, filtersString, summary, 'TEST');
    const response = await quickTaskService(prompt);
    const result = response === 'null' ? null : JSON.parse(response);
    expect(result).toEqual(expectedResult);
  });

  afterAll(async () => {
    await disconnectRagClient();
  });
});

describe('Request Ident Cat7 Service Utils', () => {
  describe('getValidPowerType', () => {
    it('should return valid power type value', () => {
      expect(getValidPowerType(null)).toBe(undefined);
      expect(getValidPowerType('null')).toBe(undefined);
      expect(getValidPowerType('')).toBe(undefined);
      expect(getValidPowerType('0')).toBe(undefined);

      expect(getValidPowerType('ac')).toBe('AC');
      expect(getValidPowerType('AC')).toBe('AC');
      expect(getValidPowerType('dc')).toBe('DC');
      expect(getValidPowerType('DC')).toBe('DC');
    });
  });
});