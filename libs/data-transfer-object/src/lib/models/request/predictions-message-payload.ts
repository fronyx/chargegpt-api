import { PredictionsMessage } from '../response';

export class PredictionsMessagePayload implements Readonly<PredictionsMessagePayload> {
  token: string;
  url: string;
  message: PredictionsMessage;
  external_api_token: string;
  rest_method: string;

  constructor(args: {
    token: string;
    url: string;
    external_api_token: string;
    rest_method: string;
    message: PredictionsMessage;
  }) {
    Object.assign(this, args);
    this.message = new PredictionsMessage(args.message);
  }
}
