import { sanitizeText } from './sanitize-text.function';

export const characterLimit = 280;

export function validateChargeGPTText(text: string, invalidTerms: string[]): { isError: boolean, maliciousText?: string } {
  const sanitizedText = sanitizeText(text.toLowerCase()).replace(/[.?]/gi, '');

  let isInvalid = false;
  let foundInvalidTerm = '';

  for (const term of invalidTerms) {
    const termSize = term.split(' ').length;
    const windowedTerms: string[] = [];

    const sanitizedWords = sanitizedText.split(' ');

    for (let i = 0; i < sanitizedWords.length - termSize + 1; i++) {
      windowedTerms.push(sanitizedWords.slice(i, i + termSize).join(' '));
    }

    if (!isInvalid && termSize === 1 && term.length > 5) {
      const textWithoutSpaces = sanitizedText.replace(/\s+/g, '');
      if (textWithoutSpaces.includes(term)) {
        foundInvalidTerm = term;
        isInvalid = true;
      }
    }

    if (!isInvalid) {
      if (windowedTerms.includes(term)) {
        foundInvalidTerm = term;
        isInvalid = true;
      }
    }
  }

  let result: any = {
    isError: isInvalid,
  };

  if (isInvalid) {
    result.maliciousText = foundInvalidTerm;
  }

  return result;
}

export function isTextMoreThan280Characters(text: string): boolean {
  if (!text || text?.trim().length === 0) {
    return false;
  }

  return text.length > characterLimit;
}
