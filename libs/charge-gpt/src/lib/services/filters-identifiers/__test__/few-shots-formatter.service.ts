import { FewShot } from '../../rag-services/few-shot.model';

export const formatFewShot = (resultParser: (input: string) => unknown): (payload: FewShot) => [string, string, unknown] => {
  return ({
    user,
    assistant,
  }: FewShot) => {
    const requestLine = getUserRequest(user);
    const summaryLine = getConversationSummary(user);
    const expectedResult = assistant === 'null' ? null : resultParser(assistant);
    return [summaryLine, requestLine, expectedResult];
  }
}

const postfixResultParser = (input: string) => true;
export const formatPostfixFewShot = ({
  user,
  assistant,
  projectIds,
}: FewShot): string[] => {
  const [summaryLine, requestLine, expectedResult] = formatFewShot(postfixResultParser)({ user, assistant, projectIds: [] }) as string[];
  const identifiedFilters = getIdentifiedFilters(user);
  return [summaryLine, requestLine, expectedResult, identifiedFilters];
};

export const formatJSONFewShot = formatFewShot(JSON.parse);

export const getUserRequest = (request: string): string => {
  return request
  .split('\n')
  .find((line) => line.includes('User request:'))
  .trim()
  .replace('User request:', '')
  .trim()
}

export const getConversationSummary = (request: string): string => {
  const firstIndex = request.indexOf('Conversation history: {');
  const secondIndex = request.indexOf('}', firstIndex);
  return request.substring(firstIndex, secondIndex).replace('Conversation history: {', '').trim();
};

export const getIdentifiedFilters = (request: string): string => {
  const prefix = 'Successfully matched request parts: {';
  const firstIndex = request.indexOf(prefix);
  const secondIndex = request.indexOf('}', firstIndex);
  return `{${request.substring(firstIndex, secondIndex).replace(prefix, '').trim()}}`
};