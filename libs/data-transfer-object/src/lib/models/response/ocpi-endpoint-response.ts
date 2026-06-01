import { IsString } from 'class-validator';

export class OcpiEndpointResponse implements Readonly<OcpiEndpointResponse> {
  @IsString()
  identifier: string;

  @IsString()
  url: string;

  constructor(args: { identifier: string; url: string }) {
    Object.assign(this, args);
  }
}
