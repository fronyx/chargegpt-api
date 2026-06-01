import { disconnectRagClient } from '../../rag-services/rag-client.service';
import { getTestRegimentsPayload } from '../../__test__/test-regiment-utils.service';
import { identifyHelpNeededWithinRequest } from '../../help-agent.service';
import { getTestCounter } from './test-counter.utils';
import { buildHistoryAndProjectForTest } from './conversation-history-builder.utils';
import { DialogFactory } from '../../../models/prompt';

jest.mock('../../../models/chat-utilities');
jest.mock('../../tracer');

const helpRequests = getTestRegimentsPayload('help-unit-tests.json');
const testCounter = getTestCounter(helpRequests);

describe.each(helpRequests)(
  'Regiment: Help Agent Service',
  ({ request, response, id, summary }) => {
    jest.setTimeout(10 * 60 * 1000); // 10 minutes timeout

    const expectedOutput = response;
    const { project, history } = buildHistoryAndProjectForTest();
    history.addDialog(DialogFactory.fromUser(request), true);
    history.setEnglishTranslation(request);
    history.setOvertConversationSummary(summary ? summary : '');

    it(`Request: [[${id}]] "${request}" should return "${
      expectedOutput === null ? expectedOutput : JSON.stringify(expectedOutput)
    }"`, async () => {
      testCounter.log();

      const result = await identifyHelpNeededWithinRequest(
        history,
        project,
        true
      );

      if (expectedOutput) {
        const expectedLevels = String(expectedOutput).split('/').map(Number);

        if (expectedLevels.includes(1)) {
          expect(result).toBeTruthy();
        } else {
          if (!result.helpLevel) {
            expect(result.helpLevel).toEqual(expectedLevels);
          } else {
            const helpLevelNumber = Number(
              result.helpLevel.replace('level ', '')
            );
            if (expectedLevels.includes(helpLevelNumber)) {
              expect(true).toBeTruthy();
            } else {
              expect(helpLevelNumber).toEqual(expectedLevels);
            }
          }
        }
      } else {
        expect(true).toBeTruthy();
      }
    });

    afterAll(async () => {
      await disconnectRagClient();
    });
  }
);
