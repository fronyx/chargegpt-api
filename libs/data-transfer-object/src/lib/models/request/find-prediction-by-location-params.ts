import { IsNotEmpty, IsString } from 'class-validator';

export class FindPredictionByLocationParams {
  @IsString()
  @IsNotEmpty()
  locationId: string;
}
