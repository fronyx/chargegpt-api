import { Injectable } from '@nestjs/common';
import { EvseDictionaryService } from '../dictionary/evse-dictionary.service';
import { DuplicatedEvseError, UnknownEntityError } from '../../../../../../apps/cdk-apps/src/shared';
import { OcpiEvsesService } from '@fronyx/persistence';
import { isObjectEmpty } from '../../../../../../apps/cdk-apps/src/shared/utils/is-object-empty.function';

@Injectable()
export class EvsesService {
  constructor(
    private readonly dictionaryService: EvseDictionaryService,
    private readonly ocpiEvsesService: OcpiEvsesService,
  ) {
  }

  async getByEvseId(args: { evseId }): Promise<string> {
    const primaryIds = await this.dictionaryService.getPrimaryIds(args.evseId);
    if (primaryIds.length < 1) {
      throw new UnknownEntityError(args.evseId);
    }

    if (primaryIds.length > 1) {
      throw new DuplicatedEvseError(args.evseId);
    }

    return primaryIds[0];
  }

  async getByLocationIdEvseId(args: { locationId: string, evseId: string }): Promise<string> {
    const primaryIds = await this.dictionaryService.getPrimaryIds(args.evseId);

    if (primaryIds.length < 1) {
      throw new UnknownEntityError(`${args.locationId}_${args.evseId}`);
    } else {
      const primaryIdsFromLocationId = primaryIds.filter(primaryId => primaryId.includes(args.locationId));

      if (primaryIdsFromLocationId.length > 1) {
        throw new DuplicatedEvseError(args.evseId);
      }
      return primaryIdsFromLocationId[0];
    }
  }

  async findEvseByLocationIdUidInDB(args: { locationId: string, uid: string }): Promise<any> {
    const evseId = await this.ocpiEvsesService.findEvseIdByPrimaryId({ locationId: args.locationId, uid: args.uid });

    if (isObjectEmpty(evseId)) {
      throw new UnknownEntityError(`${args.locationId}_${args.uid}`);
    }

    return evseId;
  }

  async findEvseByEvseIdInDB(args: { evseId }): Promise<any> {
    const evse = await this.ocpiEvsesService.findPrimaryIdByEvseId(args);

    if (isObjectEmpty(evse)) {
      throw new UnknownEntityError(`${args.evseId}`);
    }

    return evse;
  }
}

