import { ProjectOutputType, quickCompletion } from '../../chat-gpt.service';
import {
  getPrompt as getCat1Prompt,
  parseCat1QuickTaskOutput,
} from '../request-identifier-cat1.service';
import { getTestRegimentsPayload } from '../../__test__/test-regiment-utils.service';
import { disconnectRagClient } from '../../rag-services/rag-client.service';
import { getTestCounter } from './test-counter.utils';

const cat1Requests = getTestRegimentsPayload('cat1-unit-tests.json');
const projectName = 'Fronyx';
const projectOutputType = 'recommendations' as ProjectOutputType;
const language = 'en';
const conversationId = 'fooId';

const testCounter = getTestCounter(cat1Requests);

describe.each(cat1Requests)(
  'Regiment: Request Ident Cat1 Service',
  ({ request, response, summary, id, prevFilters }) => {
    jest.setTimeout(10 * 60 * 1000); // 10 minutes timeout

    const filtersString = prevFilters ?? '';
    const outputType = 'recommendations' as ProjectOutputType;

    it(`Request: [[${id}]] "${request}" should return "${
      response === null ? response : JSON.stringify(response)
    }"`, async () => {
      testCounter.log();

      const prompt = await getCat1Prompt(
        outputType,
        request,
        filtersString,
        !summary ? '' : summary,
        'TEST'
      );

      const { chatGptResponse } = await quickCompletion(
        prompt,
        conversationId,
        projectName,
        projectOutputType,
        language
      );
      const parsedResult =
        chatGptResponse === 'null'
          ? null
          : parseCat1QuickTaskOutput(chatGptResponse);
      const result = parsedResult?.request ?? null;

      function assertMinMaxPower() {
        if (response !== null) {
          const expectedMinPowerValues = getExpectedPower(response.min_power);
          const expectedMaxPowerValues = getExpectedPower(response.max_power);

          if (result !== null) {
            if (!expectedMinPowerValues.includes(Number(result.min_power))) {
              expect(Number(result.min_power)).toEqual(expectedMinPowerValues);
            }

            if (!expectedMaxPowerValues.includes(Number(result.max_power))) {
              expect(Number(result.max_power)).toEqual(expectedMaxPowerValues);
            }
          } else {
            expect(result).toEqual(response);
          }
        } else {
          expect(result).toEqual(response);
        }
      }

      if (response === null) {
        if (result !== null) {
          if (result.min_power === 0 && result.max_power === 500) {
            expect(true).toBeTruthy();
          } else {
            assertMinMaxPower();
          }
        } else {
          assertMinMaxPower();
        }
      } else {
        assertMinMaxPower();
      }
    });

    afterAll(async () => {
      await disconnectRagClient();
    });
  }
);

const getExpectedPower = (power: string | number) => {
  if (power !== 0 && !power) {
    return null;
  }

  if (String(power).includes('/')) {
    const values = (power as string).split('/');
    return values.map((val) => Number(val));
  }

  return [Number(power)];
};
