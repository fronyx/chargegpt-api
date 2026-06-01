import { OcpiLocationsService } from '@fronyx/persistence';
import { Injectable } from '@nestjs/common';
import { DuplicatedLocationError, UnknownEntityError } from '../../../../../../apps/cdk-apps/src/shared';
import { cleanId } from '../../../../../../apps/cdk-apps/src/shared/database/entities/crawling/ocpi-location.entity';

@Injectable()
export class LocationsService {
  constructor(
    private readonly locationsService: OcpiLocationsService,
  ) {
  }

  async getById(
    id: string
  ): Promise<{ id: string; evses: { uid: string; status: string; }[] }> {
    const repo = this.locationsService.repo;
    let result = await repo
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.evses', 'evses')
      .select(['location.id', 'evses.uid', 'evses.status'])
      .where('id = :id', { id })
      .getOne();

    if (!result) {
      const results = await repo
        .createQueryBuilder('location')
        .leftJoinAndSelect('location.evses', 'evses')
        .select(['location.id', 'evses.uid'])
        .where('location.id_stripped = :id', { id: `%${cleanId(id)}%` })
        .getMany();

      if (results.length < 1) {
        throw new UnknownEntityError(id);
      } else if (results.length > 1) {
        throw new DuplicatedLocationError(id);
        //TODO check results behaviour exact match can be considered as a good result if too many 500 thrown
      }

      result = results[0];
    }
    return result;
  }
}
