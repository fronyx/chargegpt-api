import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PredictionsMessagePayload } from '@fronyx/data-transfer-object';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    private readonly http: HttpService,
  ) {
  }

  async sendMessage(args: {
    payload: PredictionsMessagePayload[];
  }): Promise<void> {
    for (let i = 0; i < args.payload.length; i++) {
      const payload = args.payload[i];
      const method = payload.rest_method === 'PUT' ? 'put' : 'post';

      console.log(`Sending predictions to ${payload.url}`);

      await firstValueFrom(
        this.http[method](
          payload.url,
          payload.message,
          { headers: this.getHeaders({ payload }) },
        ),
      );
    }

    console.log(`${args.payload.length} messages sent!`);
  }

  getHeaders(args: {
    payload: PredictionsMessagePayload,
  }): any {
    if (args.payload.external_api_token !== null && args.payload.external_api_token !== undefined) {
      return { Authorization: args.payload.external_api_token };
    }

    return { 'x-api-token': args.payload.token };
  }

  filterRecordsOlderThan5Minutes(args: { records: any[]; }): any[] {
    const now = new Date().getTime();
    return args.records
      .filter(({ attributes: { ApproximateFirstReceiveTimestamp } }) => {
        const receivedAt = Number(ApproximateFirstReceiveTimestamp);

        return (now - receivedAt) <= 300000; // 5 minutes
      });
  }

  getValidPayload(args: { records: any[] }): PredictionsMessagePayload[] {
    return args.records.map(({ body }) => {
      try {
        return JSON.parse(body);
      } catch (err) {
        return null;
      }
    })
      .filter(val => val !== null)
      .reduce((acc, val) => [].concat(acc, val), [])
      .map(message => new PredictionsMessagePayload(message))
  }
}
