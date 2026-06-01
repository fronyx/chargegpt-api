export class PredictionToken {
  name: string;
  token: string;
  client_id: string;

  constructor(args: {
    name: string;
    token: string;
    client_id: string;
  }) {
    Object.assign(this, args);
  }
}
