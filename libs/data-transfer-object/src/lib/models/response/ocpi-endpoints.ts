import { IsString } from 'class-validator';
import { OcpiEndpointResponse } from './ocpi-endpoint-response';

export class OcpiEndpoints implements Readonly<OcpiEndpoints> {
  @IsString()
  credentials: string;

  @IsString()
  locations: string;

  constructor(args: OcpiEndpointResponse[]) {
    args.forEach(({ identifier, url }) => {
      if (identifier === 'credentials') {
        this.credentials = url;
      }

      if (identifier === 'locations') {
        this.locations = url;
      }
    });
  }
}
