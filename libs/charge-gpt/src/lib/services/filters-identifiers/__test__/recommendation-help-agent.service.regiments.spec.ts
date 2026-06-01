import { disconnectRagClient } from '../../rag-services/rag-client.service';
import { getTestRegimentsPayload } from '../../__test__/test-regiment-utils.service';
import { identifyRecommendationHelpNeeded } from '../../recommendation-help-agent.service';
import { getTestCounter } from './test-counter.utils';
import { buildHistoryAndProjectForTest } from './conversation-history-builder.utils';
import { DialogFactory } from '../../../models/prompt';

jest.mock('../../../models/chat-utilities');
jest.mock('../../tracer');

const helpRequests = getTestRegimentsPayload('recommendationHelp-unit-tests.json');
const testCounter = getTestCounter(helpRequests);

describe.each(helpRequests)(
  'Regiment: Recommendation Help Agent Service',
  ({ request, response, id, summary }) => {
    jest.setTimeout(10 * 60 * 1000); // 10 minutes timeout

    const expectedOutput = response;
    const { project, history } = buildHistoryAndProjectForTest();
    history.addDialog(DialogFactory.fromUser(request), true);
    history.setEnglishTranslation(request);
    // TODO: look for the string 'previous recommendation:\n' in summary and split it to get the previous recommendation
    const summarySplit = summary ? summary.split('previous recommendation:\n') : [];
    const previousRecommendation = summarySplit.length > 1 ? summarySplit[1] : '';
    const conversationSummary = summarySplit.length > 0 ? summarySplit[0] : summary;

    history.setOvertConversationSummary(conversationSummary);

    it(`Request: [[${id}]] "${request}" should return "${
      expectedOutput === null ? expectedOutput : JSON.stringify(expectedOutput)
    }"`, async () => {
      testCounter.log();

      const result = await identifyRecommendationHelpNeeded(
        history,
        project,
        previousRecommendation
      );

      if (expectedOutput) {
        const expectedLevels = String(expectedOutput).split('/').map(Number);

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
      } else {
        expect(true).toBeTruthy();
      }
    });

    afterAll(async () => {
      await disconnectRagClient();
    });
  }
);
