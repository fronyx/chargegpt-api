export const replaceAssistantName = (
  text: string,
  assistantName: string
): string => {
  if (!text) {
    return null;
  }

  return text.replace(/chargegpt/gi, assistantName ?? 'ChargeGPT');
};
