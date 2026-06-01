import {
  OcpiActionsCommandPayload
} from '../../../../cdk-apps/src/shared/domain/logging/update-create/models/ocpi-actions-command-payload';
import { isNull } from '../../../../cdk-apps/src/shared/utils/is-null.function';

export function filterByConnectorParams(payload: OcpiActionsCommandPayload): boolean {
  if (isNull(payload)) {
    return false;
  }

  return !isNull(payload.params.connectorId) &&
    !isNull(payload.params.uid) &&
    !isNull(payload.params.locationId);
}

export function filterByEvseParams(payload: OcpiActionsCommandPayload): boolean {
  if (isNull(payload)) {
    return false;
  }

  return isNull(payload.params.connectorId) &&
    !isNull(payload.params.uid) &&
    !isNull(payload.params.locationId);
}

export function filterByLocationParams(payload: OcpiActionsCommandPayload): boolean {
  if (isNull(payload)) {
    return false;
  }

  return isNull(payload.params.connectorId) &&
    isNull(payload.params.uid) &&
    !isNull(payload.params.locationId);
}
