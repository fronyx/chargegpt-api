import { Injectable } from '@nestjs/common';
import { configService } from '@fronyx/configurations';
import * as sgMail from '@sendgrid/mail';
import { MailDataRequired } from '@sendgrid/helpers/classes/mail';
import { PredictionsReport } from '../../../../../apps/cdk-apps/src/shared/domain/logging';

@Injectable()
export class MailingService {
  constructor() {
    sgMail.setApiKey(configService.getSendgridApiKey());
  }

  async sendReport(data: PredictionsReport): Promise<void> {
    const msg: MailDataRequired = {
      from: 'demo@example.com',
      personalizations: [
        {
          to: data.email,
          dynamicTemplateData: {
            ...data,
            subject: `Prediction accuracy report for ${data.location}`,
          },
        }
      ],
      templateId: 'd-04e3abaae2bd4e94b8fe39b0bbae7f40',
    };

    sgMail.send(msg)
      .catch(err => console.error('Error sending report email', err));
  }

  async sendCheckAliveFailed(args: {
    url: string;
  }): Promise<void> {
    const msg: MailDataRequired = {
      from: 'demo@example.com',
      personalizations: [
        {
          to: 'example@example.com',
          dynamicTemplateData: {
            url: args.url,
            subject: `Check alive failed for ${args.url}`,
          },
        }
      ],
      templateId: 'd-eb74fc696b4a42788842c2887c1bb6d4',
    };

    sgMail.send(msg)
      .catch(err => console.error('Error sending report email', err));
  }
}

