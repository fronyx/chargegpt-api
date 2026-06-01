import { IsString } from 'class-validator';

export class ManageOcpiEntityRequest
  implements Readonly<ManageOcpiEntityRequest> {
  @IsString()
  country_code: string;

  @IsString()
  party_id: string;

  @IsString()
  location_id: string;

  @IsString()
  evse_uid: string;

  @IsString()
  connector_id: string;

  created_at: Date;

  constructor(
    args: {
      country_code: string;
      party_id: string;
      location_id: string;
      evse_uid: string;
      connector_id: string;
      created_at: Date;
    },
  ) {
    Object.assign(this, args);
    this.created_at = args.created_at ? new Date(args.created_at) : new Date();
  }

  isUpdatingConnector(): boolean {
    return !!this.connector_id;
  }

  isUpdatingEvse(): boolean {
    return !!this.evse_uid && !this.connector_id;
  }
}
