import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { map, Observable } from 'rxjs';
import { UnknownEvsesIdentifiedEvent } from '../events/impl/unknown-evses-identified.event';
import { ReloadLocationsCommand } from '../commands/impl/reload-locations.command';
import {
  OcpiEvsePrimaryIdValue
} from '../../../../cdk-apps/src/shared';

@Injectable()
export class UnknownEntitiesSagas {
  @Saga()
  unknownEvsesIdentified = (events$: Observable<any>): Observable<ICommand> => {
    return events$
      .pipe(
        ofType(UnknownEvsesIdentifiedEvent),
        map(event => {
          const locationIds = event.evsePrimaryIds.map(primaryId => OcpiEvsePrimaryIdValue.createFromPrimaryId({ primaryId }).locationId);
          return new ReloadLocationsCommand(locationIds);
        })
      );
  }
}
