import { IsString } from 'class-validator';

export class CompanyNetwork implements Readonly<CompanyNetwork> {
  @IsString()
  name: string;

  @IsString()
  id: string;

  constructor(args: { name: string, id: string }) {
    Object.assign(this, args);
  }
}
