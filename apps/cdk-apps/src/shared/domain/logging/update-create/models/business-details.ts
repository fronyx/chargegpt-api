import { IsString } from 'class-validator';

export class BusinessDetails implements Readonly<BusinessDetails> {
  @IsString()
  name: string;

  @IsString()
  website: string;

  constructor(args: { name: string, website: string }) {
    Object.assign(this, args);
  }
}
