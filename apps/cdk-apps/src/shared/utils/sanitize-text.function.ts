export const sanitizeText = (text: string): string => {
  // eslint-disable-next-line no-useless-escape
  return text.replace(/[`~!@#$%^&*()_|+=;'"<>\{\}\[\]\\\/]/gi, '');
};
