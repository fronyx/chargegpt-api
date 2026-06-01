import { isNull } from './is-null.function';

export function validatePropertyOrThrowError(args: { properties: string[]; data: any; }): void {
  if (args.properties.some(name => isNull(args.data[name]))) {
    throw new Error(`Invalid property for the following names: ${args.properties.join(', ')}.`)
  }
}
