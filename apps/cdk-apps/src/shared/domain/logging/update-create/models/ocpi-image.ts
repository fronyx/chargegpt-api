import { IsNumber, IsString } from 'class-validator';
import { isNull } from '../../../../utils/is-null.function';
import { isObjectEmpty } from '../../../../utils/is-object-empty.function';

export class OcpiImage implements Readonly<OcpiImage> {
  @IsString()
  url: string;

  @IsString()
  thumbnail: string;

  @IsString()
  category: string;

  @IsString()
  type: string;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  private constructor(args: Partial<OcpiImage>) {
    Object.assign(this, args);
  }

  static create(args: any) {
    if (isNull(args)) {
      return null;
    }

    const payload: any = {};
    const properties = ['url', 'thumbnail', 'category', 'type', 'width', 'height'];
    properties.forEach(key => payload[key] = args[key]);

    if (isObjectEmpty(payload)) {
      return null;
    }

    return new OcpiImage(payload);
  }
}
