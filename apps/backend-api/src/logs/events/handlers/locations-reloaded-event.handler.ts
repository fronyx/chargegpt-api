import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { LocationsReloadedEvent } from '../impl/locations-reloaded.event';
import { OcpiCposService } from '@fronyx/persistence';
import { MakeLocalPutRequestsCommand } from '../../commands/impl/make-local-put-requests.command';
import { EvFreaksPartyIdConstant } from '@fronyx/data-transfer-object';
import { configService } from '@fronyx/configurations';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@EventsHandler(LocationsReloadedEvent)
export class LocationsReloadedEventHandler implements IEventHandler<LocationsReloadedEvent> {
  constructor(
    private readonly ocpiCposService: OcpiCposService,
    private readonly http: HttpService,
  ) {
  }

  async handle(command: MakeLocalPutRequestsCommand): Promise<void> {
    const cpo = await this.ocpiCposService.findByPartyId({ partyId: EvFreaksPartyIdConstant });

    const requests = command.locations.map(location => {
      const headers = { headers: { authorization: `Token ${cpo.token}` } };
      const url = `${configService.getOcpiApiUrl()}/ocpi/emsp/2.1.1/locations/${cpo.country_code}/${cpo.party_id}/${location.id}`;

      return firstValueFrom(this.http.put(url, location, headers));
    });

    await Promise.allSettled(requests);
  }
}
