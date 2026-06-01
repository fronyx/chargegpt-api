import { IsNotEmpty, IsString } from 'class-validator';

export class FindPredictionByEvseParams {
  @IsString()
  @IsNotEmpty()
  locationId: string;

  @IsString()
  @IsNotEmpty()
  evseId: string;
}
