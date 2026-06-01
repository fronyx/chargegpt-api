import { ToolkitProject } from '@fronyx/toolkit';
import { ConversationHistory } from '../../models/conversation-history.model';
import { getTranslation } from '@fronyx/translations';
import { helpAnswer } from '../conversations-helper.service';

export const informRouteNotSupported = (
  history: ConversationHistory,
  project: ToolkitProject
) => {
  const routingHelpResponse = {
    response: getTranslation(
      history.language,
      'errorMessages.routingNotSupported'
    ),
    isError: false,
    error: null,
    outOfScope: false,
    helpLevel: '1',
    helpConversationDialogs: [],
  };

  return helpAnswer(history, routingHelpResponse, project);
};
