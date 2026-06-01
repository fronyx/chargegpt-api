import { OcpiActionsCommandPayload } from '../../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-actions-command-payload';
import { OcpiLocation } from '../../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-location';
import { OcpiEvse } from '../../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-evse';
import { OcpiConnector } from '../../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-connector';
import { OcpiStatusLog } from '../../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-status-log';
import { getStatusLogsFromEvses } from './get-status-logs-from-evses.function';
import { getStatusLogsFromLocations } from './get-status-logs-from-locations.function';
import {
  filterByConnectorParams,
  filterByEvseParams,
  filterByLocationParams
} from './filter-by-ocpi-message-params.functions';
import {
  getEvseLastUpdatedFromConnectors,
  getLocationsLastUpdatedFromEvse
} from './get-last-updated-from-ocpi-entities.function';
import { OcpiCommandPayloadConversions } from '../models/ocpi-command-payload-convertions';

export function convertCreationsCommandPayloadToAffectedEntities(args: { payloads: OcpiActionsCommandPayload[]; }): OcpiCommandPayloadConversions {
  const connectors: OcpiConnector[] = args.payloads
    .filter(filterByConnectorParams)
    .map(({ params, data }) => OcpiConnector.createFromCreatePayload({
      ...data,
      ...params,
      id: params.connectorId,
    }));

  const evses: OcpiEvse[] = [].concat(
    getEvseLastUpdatedFromConnectors(connectors),
    args.payloads
      .filter(filterByEvseParams)
      .map(({ params, data }) => OcpiEvse.createFromCreatePayload({
        ...data,
        ...params,
      })),
  );

  const locations: OcpiLocation[] = [].concat(
    getLocationsLastUpdatedFromEvse(evses),
    args.payloads
      .filter(filterByLocationParams)
      .map(({ params, data }) => OcpiLocation.createFromCreatePayload({
        ...data,
        ...params,
      })),
  );

  const statusLogs: OcpiStatusLog[] = [].concat(
    getStatusLogsFromLocations(locations),
    getStatusLogsFromEvses(evses),
  );

  return { locations, evses, connectors, statusLogs };
}
