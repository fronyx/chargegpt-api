import { IsNotEmpty, IsString } from 'class-validator';
import { BusinessDetails } from './business-details';

export class OcpiEntitiesBodyRequest {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  party_id: string;

  @IsString()
  @IsNotEmpty()
  country_code: string;

  @IsNotEmpty()
  business_details: BusinessDetails;

  constructor(args: OcpiEntitiesBodyRequest) {
    Object.assign(this, args);
  }
}
