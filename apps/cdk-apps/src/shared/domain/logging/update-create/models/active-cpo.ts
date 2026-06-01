export class ActiveCpo implements Readonly<ActiveCpo> {
  locations_url: string;
  credentials_url: string;
  token: string;
  party_id: string;

  constructor(args: Partial<ActiveCpo>) {
    Object.assign(this, args);
  }
}
