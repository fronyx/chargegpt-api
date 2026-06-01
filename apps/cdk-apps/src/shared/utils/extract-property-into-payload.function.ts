export function extractPropertyIntoPayload(args: { properties: string[]; data: any; }): any {
  const properties = args.properties;
  const payload: any = {};

  properties.forEach(key => payload[key] = args.data[key]);

  return payload;
}
