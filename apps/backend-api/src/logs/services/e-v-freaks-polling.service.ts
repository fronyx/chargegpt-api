import { Injectable } from '@nestjs/common';
import { OcpiEvsesService, OcpiLocationsService } from '@fronyx/persistence';
import { CommandBus } from '@nestjs/cqrs';
import {
  EVFreaksLocation,
  OcpiEvse,
  OcpiLocationEntity,
  EvFreaksDuplicationLocationsByCoordinatesResponse, OcpiLocation
} from '../../../../cdk-apps/src/shared';
import { UpdateScopedEvsesCommand } from '../commands/impl/update-toolkit-scoped-evses.command';
import { AddLocationsToDictionaryCommand } from '../commands/impl/add-locations-to-dictionary.command';
import { UpdateScopedEvsesInCacheCommand } from '../commands/impl/add-toolkit-scoped-evses.command';
import {
  AddRemoveLocationsFromElasticsearchCommand
} from '../commands/impl/add-remove-locations-from-elasticsearch.command';
import { EVFreaksOcpiService } from './e-v-freaks-ocpi.service';

@Injectable()
export class EVFreaksPollingService {
  constructor(
    private readonly locationsRepo: OcpiLocationsService,
    private readonly ocpiEvsesService: OcpiEvsesService,
    private readonly commandBus: CommandBus,
    private readonly evFreaksOcpiService: EVFreaksOcpiService,
  ) {}

  async processPolledLocations(args: {
    locations: EVFreaksLocation[];
    isPolling: boolean;
  }) {
    const validLocations = args.locations.filter(({ _primary }) => _primary);

    const fastnedLocations = validLocations
      .map((val: any) => new EVFreaksLocation(val))
      .filter(
        (location) =>
          location.peerID.toLowerCase() === 'fastned'
      );

    if (fastnedLocations.length > 0) {
      await this.storeValidLocations(fastnedLocations, args.isPolling)
    }

    const locationsToBeFiltered = validLocations
      .map((val: any) => new EVFreaksLocation(val))
      .filter(
        (location) =>
          location.peerID.toLowerCase() === 'e-clearing' ||
          location.peerID.toLowerCase() === 'ionity'
      );

    if (locationsToBeFiltered.length > 0) {
      await this.filterDuplicatedLocationsAndContinueStoring(locationsToBeFiltered, args.isPolling);
    }
  }

  async filterDuplicatedLocationsAndContinueStoring(potentiallyDuplicatedLocations: EVFreaksLocation[], isPolling = true): Promise<void> {
    const listOfPotentiallyDuplicatedLocations = await this.identifyDuplicateLocationsByCoordinates({ locations: potentiallyDuplicatedLocations });

    const nonDuplicatedCoordinatesLocations = listOfPotentiallyDuplicatedLocations
      .filter(({ isDuplicated }) => !isDuplicated);

    const locations = nonDuplicatedCoordinatesLocations
      .map(({ coordinates: { latitude, longitude }, peerID }) => {
        return potentiallyDuplicatedLocations
          .filter((location: any) => {
            return String(location.ocpi.coordinates.latitude) === String(latitude)
              && String(location.ocpi.coordinates.longitude) === String(longitude)
              && (location.peerID === peerID || peerID === undefined);
          });
      })
      .reduce((acc: any, val: any) => [].concat(acc, val), []);

    if (locations.length > 0) {
      await this.storeValidLocations(locations, isPolling);
    }
  }

  async identifyDuplicateLocationsByCoordinates(args: {
    locations: EVFreaksLocation[];
  }): Promise<EvFreaksDuplicationLocationsByCoordinatesResponse[]> {
    const requests = args.locations.map((location) => {
      return this.locationsRepo.isLocationExistsOnCoordinates({
        coordinates: location.ocpi.coordinates,
      });
    });

    return Promise.all(requests);
  }

  async saveEvfreaksLocations(
    locations: EVFreaksLocation[],
  ): Promise<void> {
    await this.locationsRepo.saveEvFreaksLocation({ locations });

    this.triggerSideEffectsStoringLocations(locations);
  }

  async triggerSideEffectsStoringLocations(locations: EVFreaksLocation[]): Promise<void> {
    const ocpiLocations: OcpiLocationEntity[] = locations.map((val) =>
      OcpiLocationEntity.fromEvfreaksPayload(val)
    );

    await this.commandBus.execute(new UpdateScopedEvsesCommand(ocpiLocations as unknown as OcpiLocation[]));

    this.commandBus
      .execute(
        new AddLocationsToDictionaryCommand(
          ocpiLocations as unknown as OcpiLocation[]
        )
      )
      .finally();

    this.commandBus
      .execute(
        new UpdateScopedEvsesInCacheCommand(
          ocpiLocations as unknown as OcpiLocation[]
        )
      )
      .finally();

    this.commandBus
      .execute(new AddRemoveLocationsFromElasticsearchCommand(ocpiLocations))
      .finally();
  }

  async updateEvseStatusAndCreateLogs(evfreaksLocations: EVFreaksLocation[]): Promise<void> {
    const evses: OcpiEvse[] = evfreaksLocations
      .map((location) => {
        const _evses = location.ocpi.evses ?? [];
        return _evses.map((val) =>
          OcpiEvse.createPartialDto({
            ...val,
            locationId: location.ocpi.id,
          })
        );
      })
      .reduce((acc: any, val: any) => [].concat(acc, val), []);

    await this.ocpiEvsesService.updateStatusAndCreateLogs({ evses });

    const locations = evfreaksLocations.map((val) =>
      OcpiLocationEntity.fromEvfreaksPayload(val)
    );
    this.commandBus
      .execute(new AddRemoveLocationsFromElasticsearchCommand(locations))
      .finally();
  }

  async storeValidLocations(locations: EVFreaksLocation[], isPolling = true): Promise<void> {
    const processedEntities: { location: EVFreaksLocation; isValid: boolean; }[] = locations
      .map((val: any) => {
        const parsedValue = OcpiLocation.validate(val.ocpi);
        const isValid = !!parsedValue;
        return {
          location: isValid ? new EVFreaksLocation(val) : val,
          isValid,
        };
      });

    const validLocations = processedEntities
      .filter(({ isValid }) => isValid)
      .map(({ location }) => location);

    if (validLocations.length > 0) {
      if (isPolling) {
        const locationIds = validLocations.map(location => location.ocpi.id);

        const mixedNewAndExistingLocations = await this.evFreaksOcpiService.checkLocationIdsExistance({
          locationIds
        });
  
        const newLocationIds = mixedNewAndExistingLocations
          .filter(location => !location.isExists)
          .map(location => location.locationId);
  
        const newLocations = newLocationIds
          .map(newLocationId => {
            return validLocations.find(({ ocpi: { id } }) => {
              return id === newLocationId;
            });
          })
          .reduce((acc: any, val: any) => [].concat(acc, val), [])
          .filter((val: any) => val !== null);
  
        if (newLocations.length > 0) {
          await this.saveEvfreaksLocations(newLocations);
        }
  
        const existingLocationIds = mixedNewAndExistingLocations
          .filter(location => location.isExists)
          .map(location => location.locationId);
  
        const locationsTobeUpdate = existingLocationIds
          .map(existingLocationId => {
            return validLocations.find(({ ocpi: { id } }) => {
              return id === existingLocationId;
            });
          })
          .reduce((acc: any, val: any) => [].concat(acc, val), [])
          .filter((val: any) => val !== null);
  
        if (locationsTobeUpdate.length > 0) {
          await this.updateEvseStatusAndCreateLogs(locationsTobeUpdate);
        }
      } else {
        try {
          await this.saveEvfreaksLocations(validLocations);
          await this.updateEvseStatusAndCreateLogs(validLocations);
        } catch (error) {
          // NOOP
        }
      }
    }
  }
}
