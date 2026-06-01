import { Injectable } from '@nestjs/common';
import { EvFreaksPartyIdConstant } from '@fronyx/data-transfer-object';
import { OcpiCposService, OcpiLocationsService } from '@fronyx/persistence';
import { OcpiLocation } from '../../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-location';
import { isEmptyString } from '../../../../cdk-apps/src/shared/utils/is-empty-string.function';
import axios from 'axios';
import {
  EvFreaksNewOrExistingLocationResponse
} from '../../../../cdk-apps/src/shared/domain/logging/update-create/models/ev-freaks-new-or-existing-location-response';
import { Cpo } from '../../../../cdk-apps/src/shared/domain/logging';

@Injectable()
export class EVFreaksOcpiService {
  private lastUpdated = Date.now();
  private cachedCpo: Cpo = null;

  constructor(
    private readonly cpoService: OcpiCposService,
    private readonly ocpiLocationsService: OcpiLocationsService,
  ) {
  }

  async getLocationDetails(args: {
    locationId: string;
    evseId?: string;
    connectorId?: string;
  }): Promise<OcpiLocation> {
    const payloads = [args.locationId, args.evseId, args.connectorId]
      .filter(val => !isEmptyString(val))
      .join('/');

    // 1 hour
    if (this.cachedCpo === null || this.lastUpdated > 36e5) {
      const cpos = await this.cpoService.findAll();
      this.cachedCpo = cpos.find(({ party_id }) => EvFreaksPartyIdConstant === party_id);
      this.lastUpdated = Date.now();
    }

    const headers = { headers: { authorization: `Token ${this.cachedCpo.token}` } };
    const url = `${this.cachedCpo.locations_url}/${payloads}`;

    try {
      const result = await axios.get(url, headers).then(({ data }) => data).then(({ data }) => data);
      return OcpiLocation.createFromCreatePayload(result);
    } catch (error) {
      if (error.response.status === 404) {
        return null;
      }

      return undefined;
    }
  }

  async checkLocationIdsExistance(args: { locationIds: string[] }): Promise<EvFreaksNewOrExistingLocationResponse[]> {
    const response = [];
    for (let i = 0; i < args.locationIds.length; i++) {
      const locationId = args.locationIds[i];
      const isExists = await this.ocpiLocationsService.findByIdForLocationPolling({ locationId });

      response.push(new EvFreaksNewOrExistingLocationResponse({
        locationId,
        isExists,
      }));
    }

    return response;
  }
}
