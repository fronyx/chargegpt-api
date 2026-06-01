import { IsNumberString } from 'class-validator';
import { isNull } from '../../../../utils/is-null.function';

export class OcpiCoordinate implements Readonly<OcpiCoordinate> {
  @IsNumberString()
  latitude: string | null;

  @IsNumberString()
  longitude: string | null;

  private constructor(args: Partial<OcpiCoordinate>) {
    Object.assign(this, args);

    this.latitude = args && args.latitude ? String(args.latitude) : null;
    this.longitude = args && args.longitude ? String(args.longitude) : null;
  }

  static create(args: any): OcpiCoordinate | null {
    if (isNull(args)) {
      return null;
    }

    if (isNull(args.latitude) || isNull(args.longitude)) {
      return null;
    }

    return new OcpiCoordinate({
      latitude: String(args.latitude),
      longitude: String(args.longitude),
    });
  }
}
