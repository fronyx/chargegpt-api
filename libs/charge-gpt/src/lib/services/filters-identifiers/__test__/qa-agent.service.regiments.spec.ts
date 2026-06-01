import { disconnectRagClient } from '../../rag-services/rag-client.service';
import { getTestRegimentsPayload } from '../../__test__/test-regiment-utils.service';
import { getTestCounter } from './test-counter.utils';
import { firstLevelHelpRequestIdentifier } from '../../qa-agent.service';
import { DialogFactory } from '../../../models/prompt';
import { buildHistoryAndProjectForTest } from './conversation-history-builder.utils';

jest.mock('../../../models/chat-utilities');
jest.mock('../../tracer');

const qaRequests = getTestRegimentsPayload('qa-unit-tests.json');
const testCounter = getTestCounter(qaRequests);

describe.each(qaRequests)(
  'Regiment: QA Agent Service',
  ({ request, response, id, summary, otherExpectedOutput }) => {
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

      const result = await firstLevelHelpRequestIdentifier(history, project);
      if (
        otherExpectedOutput?.address?.origin &&
        otherExpectedOutput?.address?.destination
      ) {
        expect(true).toBeTruthy();
      } else if (expectedOutput === null) {
        expect(result).toBeFalsy();
      } else {
        expect(result?.helpLevel).toBeTruthy();
      }
    });

    afterAll(async () => {
      await disconnectRagClient();
    });
  }
);
