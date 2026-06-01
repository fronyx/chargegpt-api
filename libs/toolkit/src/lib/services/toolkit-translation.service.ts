import { isObjectEmpty } from '../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';

export const getTranslationOrFallback = (
  translationArray: Record<string, string>[],
  fallback: Record<string, string>
): Record<string, string> => {
  const firstElement = translationArray ? translationArray[0] : null;
  const translation = !isObjectEmpty(firstElement) ? firstElement : fallback;
  const translationKeys = Object.keys(translation).filter((key) =>
    ['en', 'fr', 'pt', 'es', 'de', 'cz'].includes(key.toLowerCase())
  );
  const mappedTranslation = {};
  // TODO fix this so that the mapping to lower case key is not needed
  translationKeys.forEach((key) => {
    mappedTranslation[key.toLowerCase()] = translation[key]
      ? translation[key]
      : fallback[key.toUpperCase()];
  });
  return mappedTranslation;
};
