import { TranslationsService } from '@fronyx/translations';
import { ConversationHistory } from '../models/conversation-history.model';
import { generateFilterFewShots, generateFilterSystemPrompt } from './filter.constants';
import { DialogFactory } from '../models/prompt';

export const initializeFilter = (history: ConversationHistory) => {
    const translation = new TranslationsService(history.language);
    const languageName = translation.getLanguageName();

    if (history.getCurrentSubComponent() === 'filter') {
      history.cleanCurrentDialogs();
    }

    history.addDialog(DialogFactory.fromSystem(generateFilterSystemPrompt(languageName)), false);

    const fewShots = generateFilterFewShots();
    fewShots.forEach(({role, text}) => {
      switch (role) {
        case 'user': {
          history.addDialog(DialogFactory.fromUser(text), false);
          break;
        }
        case 'assistant': {
          history.addDialog(DialogFactory.fromAssistant(text), false);
          break;
        }
        default: {
          break;
        }
      }
    });
  };
