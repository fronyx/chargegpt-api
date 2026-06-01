import { IsString } from 'class-validator';

export class OcpiVersionResponse implements Readonly<OcpiVersionResponse> {
  @IsString()
  version: string;

  @IsString()
  url: string;

  constructor(args: { version: string; url: string }) {
    Object.assign(this, args);
  }
}
