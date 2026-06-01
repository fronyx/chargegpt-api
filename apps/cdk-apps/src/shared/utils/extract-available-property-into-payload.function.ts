import { isNull } from './is-null.function';

export function extractAvailablePropertyIntoPayload(args: any): any {
  const payload: any = {};

  Object
    .keys(args)
    .filter(key => !isNull(args[key]))
    .filter(key => {
      if (!Array.isArray(args[key])) {
        return true;
      }

      return args[key].length > 0;
    })
    .forEach(key => payload[key] = args[key]);

  return payload;
}
