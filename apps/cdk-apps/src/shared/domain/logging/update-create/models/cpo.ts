import { IsString } from 'class-validator';
import { BusinessDetails } from './business-details';

export class Cpo implements Readonly<Cpo> {
  @IsString()
  party_id: string;

  @IsString()
  token: string;

  @IsString()
  token_b: string;

  @IsString()
  url: string;

  @IsString()
  credentials_url: string;

  @IsString()
  locations_url: string;

  @IsString()
  country_code: string;

  business_details: BusinessDetails;

  constructor(args: {
    party_id: string;
    token: string;
    token_b: string;
    url: string;
    credentials_url: string;
    locations_url: string;
    country_code: string;
    name: string;
    website: string;
  }) {
    Object.assign(this, args);
    this.business_details = new BusinessDetails({ name: args.name, website: args.website });
  }
}
