import { ProjectOutputType } from '../../chat-gpt.service';
import {
  getPrompt,
  removeOperatorNameFromAddress,
} from '../../address-identifiers/request-identifier-address.service';
import { quickTaskService } from './quick-task.service';
import { formatJSONFewShot } from './few-shots-formatter.service';
import { addressFewShotExamples } from '../../rag-services/address-few-shots.model';
import { disconnectRagClient } from '../../rag-services/rag-client.service';

const testRequests = addressFewShotExamples.map(formatJSONFewShot);

describe.each(testRequests)(
  'Request Ident Address Service',
  (summary, userRequest, expectedResult) => {
    const outputType = 'filters' as ProjectOutputType;
    const filtersString = '';
    const language = 'pt';

    it(`Request: "${userRequest}" should return "${
      expectedResult === null ? expectedResult : JSON.stringify(expectedResult)
    }"`, async () => {
      const prompt = await getPrompt(
        language,
        outputType,
        userRequest,
        filtersString,
        summary,
        'TEST'
      );
      const response = await quickTaskService(prompt);
      const result = response === 'null' ? null : JSON.parse(response);
      expect(result).toEqual(expectedResult);
    });

    afterAll(async () => {
      await disconnectRagClient();
    });
  }
);

describe('removeOperatorNameFromAddress', () => {
  it('should remove operator name from address', () => {
    expect(
      removeOperatorNameFromAddress(
        'Allego, Rüttenscheider Straße, Essen',
        'FRK'
      )
    ).toBe('Rüttenscheider Straße, Essen');
    expect(removeOperatorNameFromAddress('EWE', 'FRK')).toBeNull();
    expect(
      removeOperatorNameFromAddress('Stadtwerke München Messe München', 'FRK')
    ).toBe('Messe München');
    expect(removeOperatorNameFromAddress('REWE, Berlin', 'FRK')).toBe(
      'REWE, Berlin'
    );
    expect(removeOperatorNameFromAddress('IBIL, Berlin', 'FRK')).toBe('Berlin');
  });
});
