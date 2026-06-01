import { IChargeGPTControllerHandlerService } from '../chargegpt-controller-handler.service';
import {
  replyMessage,
  sendWelcomeMessage,
  replyMessageThatHasUserLocationInfo,
  sendNotSupportedMessage,
  replyVoiceMessage,
} from './whatsapp-chargegpt-middleware.service';

export const processWebhookEvents = async (
  headers,
  body,
  chargeGPTHandler?: IChargeGPTControllerHandlerService
): Promise<void> => {
  // TODO validate payload
  const messages = getMessagesFromBody(body);
  for (const message of messages) {
    const queries = [];
    for (const innerMessage of message) {
      const { from, type, id } = innerMessage;

      const data = innerMessage[type];

      switch (type) {
        case 'text':
          queries.push(
            replyMessage(
              from,
              {
                id,
                text: data.body,
              },
              chargeGPTHandler
            )
          );
          break;

        case 'request_welcome':
          queries.push(sendWelcomeMessage(from));
          break;

        case 'location':
          queries.push(
            replyMessageThatHasUserLocationInfo(from, data, chargeGPTHandler)
          );
          break;

        case 'audio':
          queries.push(replyVoiceMessage(from, { id, data }, chargeGPTHandler));
          break;

        case 'video':
        case 'image':
        case 'unsupported':
        case 'document':
          queries.push(sendNotSupportedMessage(from));
          break;

        case 'interactive':
          if (data.type === 'button_reply') {
            queries.push(
              replyMessage(
                from,
                {
                  id,
                  text: data.button_reply.id,
                },
                chargeGPTHandler
              )
            );
            break;
          }

          console.error('Unsupported message type: intractive: ', data.type);
          break;

        default:
          console.error('Unsupported message type:', type);
      }
    }

    await Promise.all(queries);
  }
};

export const getMessagesFromBody = (body: any): any[] => {
  if (!body || body.object !== 'whatsapp_business_account') {
    return [];
  }

  const entry = body.entry;
  const bodyMessages = entry
    .map(({ changes }) =>
      changes.flatMap(({ value: { messages } }) => messages).filter(Boolean)
    )
    .filter(Boolean);
  return bodyMessages;
};
