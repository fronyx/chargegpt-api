import { useTry } from 'no-try';

export function parseChatGPTJSON(json: string): Record<string, any> | null {
  const cleanedRawString = cleanRawString(json);
  const [err, parsed] = useTry(() => JSON.parse(cleanedRawString));

  if (err) {
    const [errFallback, parsedFallback] = useTry(() =>
      JSON.parse(cleanedRawString.replace(/\n/g, ''))
    );

    if (errFallback) {
      return null;
    } else {
      return parsedFallback;
    }
  }

  return parsed;
}

export const cleanRawString = (rawValue: string): string => {
  return rawValue
    .replace(/\n/g, '')
    .replace(/```json|```/g, '')
    .trim();
};
