import { OcpiLocation } from '../../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-location';
import { OcpiEvse } from '../../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-evse';
import { OcpiConnector } from '../../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-connector';
import { OcpiStatusLog } from '../../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-status-log';

export interface OcpiCommandPayloadConversions {
  locations: OcpiLocation[];
  evses: OcpiEvse[];
  connectors: OcpiConnector[];
  statusLogs: OcpiStatusLog[];
}
