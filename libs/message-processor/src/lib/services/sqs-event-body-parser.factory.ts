import { IMessageParserService } from '../interfaces/message-parser-service';
import { configService } from '@fronyx/configurations';
import { RegressionModelMessageParserService } from './regression-model-message-parser.service';
import { Injectable } from '@nestjs/common';
import { ISQSRecord } from '../../../../../apps/cdk-apps/src/shared/models/general/sqs-record';
import { parseJSONBody } from '../../../../../apps/cdk-apps/src/logs-processor-stack/services/parse-json-body.function';

interface SQSParserFactoryInput {
  Records: ISQSRecord[];
}

@Injectable()
export class SqsEventBodyParserFactory {
  private readonly messageType: string;

  constructor(
    private readonly regressionModelParserService: RegressionModelMessageParserService,
  ) {
    this.messageType = configService.getAiModel();
  }

  parse(args: SQSParserFactoryInput): any[] {
    const service = this.getService();

    return service.parse({
      records: args.Records
        .map(val => parseJSONBody(val))
        .filter(val => val !== null),
    });
  }

  private getService(): IMessageParserService {
    if (this.messageType === 'regression') {
      return this.regressionModelParserService;
    }
  }
}
