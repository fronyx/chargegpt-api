import { Injectable } from '@nestjs/common';
import { OcpiEvsesService, OcpiLocationsService } from '@fronyx/persistence';
import { EvsesValue } from '../../../../cdk-apps/src/shared/domain/logging';
import { EVSEPowerType } from '../../../../cdk-apps/src/shared/domain/logging';

export interface IsValidEvseResult {
  isValid: boolean;
  evse: any;
}

@Injectable()
export class EvsesService {
  private powerTypeRequestCache = {};

  constructor(
    private readonly ocpiEvsesService: OcpiEvsesService,
    private readonly ocpiLocationsService: OcpiLocationsService,
  ) {
  }

  async isValidEvse(args: { locationId: string; uid: string; }): Promise<IsValidEvseResult> {
    const evse = await this.ocpiEvsesService.findByUidAndLocationId(args);

    const evses = EvsesValue.create({ evses: [evse] }).value;

    return {
      isValid: evses.length > 0,
      evse: evse,
    };
  }

  async findPowerTypesByEvsePrimaryId(args: { evsePrimaryIds: string[] }): Promise<EVSEPowerType[]> {
    const results = await this.ocpiEvsesService.findPowerTypesByEvsePrimaryIds({ primaryIds: args.evsePrimaryIds });

    return results
      .map(evse => {
        return evse.connectors.map(({ power_type }) => ({
          evse_id: evse.evse_id,
          evse: evse.primary_id,
          power_type,
        }));
      })
      .reduce((acc, val) => [].concat(acc, val), []);
  }

  async findLocationInDEU(args: { countryCode: string }): Promise<any> {
    return await this.ocpiLocationsService.findLocationByCountry(args);
  }
}
