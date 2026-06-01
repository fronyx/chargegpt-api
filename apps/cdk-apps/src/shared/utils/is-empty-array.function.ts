import { isNull } from './is-null.function';

export function isEmptyArray(args?: any[]): boolean {
  if (!Array.isArray(args)) {
    return true;
  }

  return isNull(args) || args.length === 0;
}
