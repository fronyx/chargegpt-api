import {
  getPrompt,
  necessaryInformation,
  parseCat7QuickTaskOutput,
} from '../request-identifier-cat7.service';
import { disconnectRagClient } from '../../rag-services/rag-client.service';
import { ProjectOutputType, quickCompletion } from '../../chat-gpt.service';
import { getTestRegimentsPayload } from '../../__test__/test-regiment-utils.service';
import { getTestCounter } from './test-counter.utils';
import {
  formatDateToFronyxFormat,
  isSimilarOperatorName,
  isTimeWithin15Mins,
  translateResponseDateTimeToExpectedTime,
} from './cat7-helper.utils';

const currentTimestamp = Date.now();
const filtersInScope = necessaryInformation(currentTimestamp, 'TEST');
const cat7Requests = getTestRegimentsPayload('cat7-unit-tests.json');
const projectName = 'Fronyx';
const projectOutputType = 'recommendations' as ProjectOutputType;
const conversationId = 'fooId';
const language = 'en';

const testCounter = getTestCounter(cat7Requests);

describe.each(cat7Requests)(
  'Regiment: Request Ident Cat7 Service',
  ({ request, response, summary, id, prevFilters }) => {
    jest.setTimeout(10 * 60 * 1000); // 10 minutes timeout

    const filtersString = prevFilters ?? '';

    it(`Request: [[${id}]] "${request}" should return "${
      response === null ? response : JSON.stringify(response)
    }"`, async () => {
      testCounter.log();

      const prompt = await getPrompt(
        currentTimestamp,
        filtersInScope,
        projectOutputType,
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

      const result =
        chatGptResponse === 'null'
          ? null
          : parseCat7QuickTaskOutput(chatGptResponse, request, 'TEST');

      if (result === null || result.requst === null) {
        if (response && response.date_time && response.date_time === '+00:00') {
          expect(true).toBeTruthy();
        } else {
          expect(result).toEqual(response);
        }
      } else if (response === null) {
        const parsedResults = result.request;

        if (
          [
            parsedResults.operator_name,
            parsedResults.power_type,
            parsedResults.date_time,
          ].every((val) => !val)
        ) {
          expect(null).toEqual(response);
        } else {
          if (parsedResults.operator_name === 'all') {
            expect(true).toBeTruthy();
          } else {
            expect(parsedResults.operator_name).toBeFalsy();
          }

          if (parsedResults.power_type === 'all') {
            expect(true).toBeTruthy();
          } else {
            expect(parsedResults.power_type).toBeFalsy();
          }

          if (
            parsedResults.date_time &&
            isTimeWithin15Mins(
              parsedResults.date_time,
              formatDateToFronyxFormat(new Date())
            )
          ) {
            expect(true).toBeTruthy();
          } else {
            expect(parsedResults.date_time).toBeFalsy();
          }
        }
      } else {
        const parsedResults = result.request;

        if (
          [
            parsedResults.operator_name,
            parsedResults.power_type,
            parsedResults.date_time,
          ].every((val) => val === null)
        ) {
          if (response.date_time === '+00:00') {
            expect(true).toBeTruthy();
          } else {
            expect(null).toEqual(response);
          }
        } else {
          if (parsedResults.date_time && response.date_time) {
            const expectedDateTime = translateResponseDateTimeToExpectedTime(
              response.date_time,
              currentTimestamp
            );
            if (isTimeWithin15Mins(parsedResults.date_time, expectedDateTime)) {
              expect(true).toBeTruthy();
            } else {
              expect(parsedResults.date_time).toEqual(expectedDateTime);
            }
          } else if (parsedResults.date_time && !response.date_time) {
            expect(parsedResults.date_time).toBeFalsy();
          } else if (!parsedResults.date_time && response.date_time) {
            if (response.date_time === '+00:00' && !parsedResults.date_time) {
              expect(true).toBeTruthy();
            } else {
              expect(parsedResults.date_time).toEqual(
                translateResponseDateTimeToExpectedTime(
                  response.date_time,
                  currentTimestamp
                )
              );
            }
          }

          if (!response.operator_name) {
            expect(
              [null, undefined, 'all'].includes(parsedResults.operator_name)
            ).toBeTruthy();
          } else {
            if (response.operator_name && parsedResults.operator_name) {
              const comparableExpectedOperatorName = response.operator_name.toLowerCase();
              const comparableReceivedOperatorName = parsedResults.operator_name.toLowerCase();

              if (isSimilarOperatorName(comparableExpectedOperatorName, comparableReceivedOperatorName)) {
                expect(true).toBeTruthy();
              } else {
                expect(comparableReceivedOperatorName).toEqual(comparableExpectedOperatorName);
              }
            } else {
              expect(parsedResults.operator_name).toEqual(
                response.operator_name
              );
            }
          }

          if (!response.power_type) {
            if (parsedResults.power_type === 'all') {
              expect(true).toBeTruthy();
            } else {
              if (![null, undefined].includes(parsedResults.power_type)) {
                expect(parsedResults.power_type).toBeFalsy();
              }
            }
          } else {
            expect(parsedResults.power_type).toEqual(response.power_type);
          }
        }
      }
    });

    afterAll(async () => {
      await disconnectRagClient();
    });
  }
);
