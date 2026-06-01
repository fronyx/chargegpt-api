import { IsString } from 'class-validator';

export class EvseIdParams {
  @IsString()
  evseId: string;

  value(): string {
    return this.evseId;
  }
}
