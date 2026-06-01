export class ScopedEvses implements Readonly<ScopedEvses> {
  static getKey(args: {apiToken: string;}): string {
    return `scoped_evses_${args.apiToken}`;
  }

  constructor(args: {
    ids: string[];
  }) {
    Object.assign(this, args);
  }
}
