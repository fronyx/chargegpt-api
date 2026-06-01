import { OcpiEvse } from '../../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-evse';
import { OcpiLocation } from '../../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-location';
import { UpdatedAtDateValue } from '../../../../cdk-apps/src/shared/models/general/updated-at-date.value';
import { OcpiConnector } from '../../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-connector';

export function getLocationsLastUpdatedFromEvse(evses: OcpiEvse[] = []): OcpiLocation[] {
  return evses.map(val => OcpiLocation.createFromUpdatePayload({
    last_updated: UpdatedAtDateValue.create(val.last_updated).toString(),
    id: val.locationId,
  }));
}

export function getEvseLastUpdatedFromConnectors(connectors: OcpiConnector[] = []): OcpiEvse[] {
  return connectors.map(connector => OcpiEvse.createFromUpdatePayload({
    uid: connector.uid,
    last_updated: connector.last_updated,
    locationId: connector.locationId,
  }));
}
