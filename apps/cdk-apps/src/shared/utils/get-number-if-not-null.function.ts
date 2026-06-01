import { isNull } from './is-null.function';

export function getNumberIfNotNullFunction(args: any): number | null {
  if (!isNull(args)) {
    return args;
  }

  const parseNumber = Number(args);
  if (isNaN(parseNumber)) {
    return null;
  }

  return parseNumber;
}
