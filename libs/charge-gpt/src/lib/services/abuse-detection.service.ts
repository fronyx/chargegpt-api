import { Injectable } from '@nestjs/common';
import {
  characterLimit,
  isTextMoreThan280Characters,
  validateChargeGPTText
} from '../../../../../apps/cdk-apps/src/shared/utils/validate-chargegpt-text.function';
import { generateCharacterLimitErrorMessage, getChargeGptFilterMaliciousTermErrorMessage } from '../models/charge-gpt-translation.assets';
import { chargeGPTLogger } from '../models/chat-utilities';
import { ConversationHistory } from '../models/conversation-history.model';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import { ToolkitProject } from '@fronyx/toolkit';

@Injectable()
export class AbuseDetectionService {
  async validateAbusiveTerm(text: string, history: ConversationHistory, project: ToolkitProject): Promise<{
    isError: boolean,
    error?: {
      message?: string;
      internalMessage?: string
    },
    metaData?: {
      isCharacterLimitReached?: boolean;
      isContainsBlockedTerm?: boolean;
    }
  }> {

    const invalidTerms = [
      'llm',
      'large language model',
      'large language',
      'harassment',
      'harass',
      'harassing',
      'abuse',
      'abusive',
      'abusing',
      'serious',
      'feel',
      'feeling',
      'instruction',
      'tease',
      'prompt',
      'developer',
      'rules',
      'openai',
      'align',
      'print out',
      'beleidigt',
      'beleidigen',
      'beleidigung',
      'belästigt',
      'belästigen',
      'belästigung',
      'beschimpft',
      'beschimpfen',
      'beschimpfung',
      'ernst genommen',
      'fühle',
      'fühlen',
      'anweisungen',
      'witz',
      'modus',
      'entwickler',
      'regeln',
      'component',
      'ausdrucken',
      'komponent',
      'acoso',
      'acosar',
      'acosando',
      'abuso',
      'abusivo',
      'abusando',
      'grave',
      'sentir',
      'sensación',
      'instrucción',
      'burlar',
      'indicación',
      'desarrollador',
      'reglas',
      'alinear',
      'imprimir',
      'harcèlement',
      'harcèlent',
      'harcelant',
      'abus',
      'abusif',
      'abusant',
      'ressentir',
      'sentiment',
      'taquiner',
      'développeur',
      'règles',
      'aligner',
      'imprimer',
      'assédio',
      'assediar',
      'assediando',
      'sentimento',
      'instrução',
      'provocar',
      'promp',
      'desenvolvedor',
      'regras',
      'alinhamento',
      'chatgpt',
      'open.ai',
      'chat.gpt'
    ];

    if (isTextMoreThan280Characters(text)) {
      const message = generateCharacterLimitErrorMessage(history, characterLimit);

      return {
        isError: true,
        error: {
          message,
          internalMessage: message
        },
        metaData: {
          isCharacterLimitReached: true,
        }
      };
    }

    const { isError, maliciousText } = validateChargeGPTText(text, invalidTerms);

    if (isError && !isEmptyString(maliciousText)) {
      const message = getChargeGptFilterMaliciousTermErrorMessage(project, history.language);

      chargeGPTLogger(history.id, history.projectName, 'abuseDetectionServiceError', `Conversation contain malicious term: ${maliciousText}`);

      return {
        isError: true,
        error: {
          message,
          internalMessage: message,
        },
        metaData: {
          isContainsBlockedTerm: true
        }
      };
    }
    return {
      isError: false
    };
  }
}
