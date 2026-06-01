import { Module } from '@nestjs/common';
import { MailingService } from './services/mailing.service';
import { HttpModule } from '@nestjs/axios';

const services = [
  MailingService,
];

@Module({
  imports: [HttpModule],
  providers: [...services],
  exports: [...services],
})
export class MailingModule {
}
