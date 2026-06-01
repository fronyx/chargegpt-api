import { IsString } from 'class-validator';
import { isNull } from '../../../../utils/is-null.function';

export class OcpiBusinessDetails implements Readonly<OcpiBusinessDetails> {
  @IsString()
  name: string;

  @IsString()
  hotline: string;

  @IsString()
  website: string;

  @IsString()
  logo: string;

  @IsString()
  id: string;

  private constructor(args: Partial<OcpiBusinessDetails>) {
    Object.assign(this, args);
  }

  static create(args: any) {
    if (isNull(args)) {
      return null;
    }

    const properties = ['name', 'hotline', 'website', 'logo', 'id'];
    const payload: any = {};

    properties
      .filter(key => !isNull(args[key]))
      .forEach(key => payload[key] = args[key]);

    if (Object.keys(payload).length > 0) {
      return new OcpiBusinessDetails(payload);
    }

    return null;
  }
}
