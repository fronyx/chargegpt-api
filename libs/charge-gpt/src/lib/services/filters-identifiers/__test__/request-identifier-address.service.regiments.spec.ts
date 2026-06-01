import {
  getPrompt,
  parseAddressIdentifierQuickTaskOutput,
} from '../../address-identifiers/request-identifier-address.service';
import { disconnectRagClient } from '../../rag-services/rag-client.service';
import { ProjectOutputType, quickCompletion } from '../../chat-gpt.service';
import { getTestRegimentsPayload } from '../../__test__/test-regiment-utils.service';
import {
  isDestinationEqual,
  parseUnconfirmedAddresses,
} from './address-identifier-helper.utils';
import { getTestCounter } from './test-counter.utils';
import { getRouteNeeds } from '../../conversations-agent.service';
import { identifyRouteNeeds } from '../../address-identifiers/route-needs.service';
import { buildHistoryAndProjectForTest } from './conversation-history-builder.utils';
import { DialogFactory } from '../../../models/prompt';

const testRequests = getTestRegimentsPayload('address-unit-tests.json');
const projectName = 'Fronyx';
const projectOutputType = 'recommendations' as ProjectOutputType;
const language = 'en';
const conversationId = 'fooId';

const testCounter = getTestCounter(testRequests);

describe.each(testRequests)(
  'Regiment: Request Ident Address Service',
  ({ request, response, summary, id, prevFilters, routeNeeds }) => {
    jest.setTimeout(10 * 60 * 1000); // 10 minutes timeout

    const filtersString = prevFilters ?? '';

    it(`Request: [[${id}]] "${request}" should return "${
      response === null ? response : JSON.stringify(response)
    }"`, async () => {
      testCounter.log();

      const prompt = await getPrompt(
        language,
        projectOutputType,
        !summary ? '' : summary,
        request,
        filtersString,
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
          : await parseAddressIdentifierQuickTaskOutput(
              chatGptResponse,
              id,
              projectName,
              projectOutputType,
              language,
              'TEST'
            );
      const result =
        parsedResult === null ? null : parsedResult.request ?? null;

      async function assertAddresses() {
        if (response.destination) {
          const expectedDestination = parseUnconfirmedAddresses(
            response.destination
          );
          const receivedDestination = parseUnconfirmedAddresses(
            result.destination
          );

          if (
            isDestinationEqual(
              response.destination,
              expectedDestination,
              receivedDestination
            )
          ) {
            expect(receivedDestination).toBeTruthy();
          } else {
            expect(result.destination).toEqual(response.destination);
          }
        } else if (result.destination) {
          expect(result.destination).toEqual(response.destination);
        } else {
          expect(result.destination).toEqual(response.destination ?? null);
        }

        if (response.origin) {
          const expectedOrigin = parseUnconfirmedAddresses(response.origin);
          const receivedOrigin = parseUnconfirmedAddresses(result.origin);
          if (expectedOrigin === receivedOrigin) {
            expect(receivedOrigin).toEqual(expectedOrigin);
          } else {
            expect(result.origin).toEqual(response.origin);
          }
        } else if (result.origin) {
          expect(result.origin).toEqual(response.origin);
        } else {
          expect(result.origin).toEqual(response.origin ?? null);
        }

        if (response.origin && response.destination && routeNeeds) {
          const { project, history } = buildHistoryAndProjectForTest();
          history.addDialog(DialogFactory.fromUser(request), true);
          history.setLastUserInput(request);
          history.setEnglishTranslation(request);
          history.setOvertConversationSummary(summary ? summary : '');
          const identifiedRouteNeeds = await getRouteNeeds(
            history,
            project,
            identifyRouteNeeds
          );
          expect(identifiedRouteNeeds).toEqual(routeNeeds);
        }
      }

      if (result === null) {
        expect(result).toEqual(response);
      } else if (response === null) {
        if (Object.values(result).filter(Boolean).length > 0) {
          expect(null).toBeNull();
        } else {
          expect(result).toEqual(response);
        }
      } else {
        if (response.is_nearby_requested) {
          if (response.is_nearby_requested[0] === '~') {
            if (!result) {
              expect(true).toBeTruthy();
            } else if (!result.destination) {
              expect(true).toBeTruthy();
            } else if (
              result.destination &&
              (result.destination as string).includes('{city}')
            ) {
              expect(
                (result.destination as string).includes(response.destination)
              ).toBeTruthy();
            } else {
              await assertAddresses();
            }
          } else {
            expect(result.is_nearby_requested).toBeTruthy();

            await assertAddresses();
          }
        } else {
          await assertAddresses();
        }

        if (response.is_location_confirmed) {
          expect(result.is_location_confirmed).toBeTruthy();
        } else {
          if (result.is_location_confirmed && !summary) {
            expect(true).toBeTruthy();
          } else {
            expect(result.is_location_confirmed).toBeFalsy();
          }
        }

        if (response.is_location_blocked) {
          expect(result.is_location_blocked).toBeTruthy();
        } else {
          expect(result.is_location_blocked).toBeFalsy();
        }
      }
    });

    afterAll(async () => {
      await disconnectRagClient();
    });
  }
);
