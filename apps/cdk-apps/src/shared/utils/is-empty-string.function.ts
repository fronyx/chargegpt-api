import { isNull } from './is-null.function';

export function isEmptyString(value?: string): boolean {
  return isNull(value) || value === '';
}
