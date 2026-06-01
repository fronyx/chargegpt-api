export class EvFreaksNewOrExistingLocationResponse implements Readonly<EvFreaksNewOrExistingLocationResponse> {
  locationId: string;
  isExists: boolean;

  constructor(args: Partial<EvFreaksNewOrExistingLocationResponse>) {
    Object.assign(this, args);
  }
}
