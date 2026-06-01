export class MockCacheService {
  readonly cacheValues = new Map<string, any>();

  async get(args: { key: string; }): Promise<any> {
    return Promise.resolve(this.cacheValues.get(args.key));
  }

  async set(args: { key: string; value: any; }): Promise<void> {
    await Promise.resolve(() => { this.cacheValues.set(args.key, args.value) });
  }

  async hGetAll(key: string): Promise<void> {
    return Promise.resolve(this.cacheValues.get(key));
  }

  async hSet(key: string, propertyName: string, value: string): Promise<any> {
    let obj = this.cacheValues.get(key);
    if (!obj) {
      obj = {};
    }

    obj[propertyName] = value;
    return Promise.resolve(this.cacheValues.set(key, obj));
  }

  async expire(): Promise<void> {
    await Promise.resolve();
  }
}
