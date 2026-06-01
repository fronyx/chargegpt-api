import { IsDateString, IsString, validateSync } from 'class-validator';

export class EvFreaksStatusLog implements Readonly<EvFreaksStatusLog> {
  @IsString()
  evse_id: string;

  @IsString()
  uid: string;

  @IsString()
  status: string;

  @IsDateString()
  last_updated: string;

  @IsString()
  location_id: string;

  private constructor(args: EvFreaksStatusLog) {
    Object.assign(this, args);
  }

  static create(args: EvFreaksStatusLog): EvFreaksStatusLog {
    const errors = validateSync(args);

    if (errors.length > 0) {
      throw new Error('Missing property for EvFreaksStatusLog');
    }

    return new EvFreaksStatusLog(args);
  }
}
