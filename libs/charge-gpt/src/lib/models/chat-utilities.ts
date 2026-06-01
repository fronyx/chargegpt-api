import { configService } from '@fronyx/configurations';
import { ChatGptAddress } from './prompt';

export const getJSONLog = (
  conversationId: string,
  projectName: string,
  message: string,
  inner = null
): string => {
  const log = {
    topic: 'CHARGEGPT_CONVERSATION',
    conversationId,
    projectName,
    message,
    inner_message: inner,
  };

  let stringifiedLog = '';

  try {
    stringifiedLog = `[${log.topic}] ConversationId: ${conversationId} | Name: ${projectName} | Message: ${message} | Payload: ${inner}`;
    // stringifiedLog = JSON.stringify(log);
  } catch {
    // NOOP
  }

  return stringifiedLog;
};

export const parse2ChatGptAddress = (address: string): ChatGptAddress => {
  // parse address components from the address provided by chatGPT

  const city = address.split(',')[1]?.trim() ?? '';
  return {
    address: address,
    city,
  };
};

export const parse2ChatGptAddressWithCityCenter = (
  address: string
): ChatGptAddress => {
  const city = address.split(',')[0]?.trim() ?? '';
  return {
    address,
    city,
  };
};

export function getRandomElement(array: any[]) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

export const chargeGPTLogger = (
  conversationId: string,
  projectName: string,
  message: string,
  innerMessage?: string
) => {
  const logString = getJSONLog(
    conversationId,
    projectName,
    message,
    innerMessage
  );
  console.info(logString);
};
