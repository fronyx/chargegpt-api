import { IsString } from 'class-validator';
import { isNull } from '../../../../utils/is-null.function';

export class OcpiDisplayText implements Readonly<OcpiDisplayText> {
  @IsString()
  language: string;

  @IsString()
  text: string;

  private constructor(args: Partial<OcpiDisplayText>) {
    Object.assign(this, args);
  }

  static create(args: any) {
    if (isNull(args.language) || isNull(args.text)) {
      return undefined;
    }

    return new OcpiDisplayText(args);
  }
}
