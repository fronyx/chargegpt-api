export function parseOrNull(args: { body: string }): any {
  try {
    return JSON.parse(args.body);
  } catch {
    return null;
  }
}
