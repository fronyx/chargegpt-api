import { isNull } from './is-null.function';

export function isObjectEmpty(payload: any): boolean {
  if (isNull(payload)) {
    return true;
  }

  return Object.keys(payload)
    .filter(key => !isNull(payload[key]))
    .filter(key => {
      if (Array.isArray(payload[key])) {
        return payload[key].length > 0;
      }

      return true;
    })
    .length < 1;
}
