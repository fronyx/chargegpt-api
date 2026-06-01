import { OcpiEntitiesPaginatedQueryParams } from '../../../../../../apps/cdk-apps/src/shared/domain/logging';

export class OcpiEntitiesQueryRequest
  implements Readonly<OcpiEntitiesQueryRequest> {
  location_id: string;
  evse_uid: string;
  connector_id: string;
  date_to: string;
  date_from: string;
  limit: number;
  offset: number;

  constructor(
    args: {
      location_id: string;
      evse_uid: string;
      connector_id: string;
      date_to: string;
      date_from: string;
      limit: number;
      offset: number;
    },
  ) {
    Object.assign(this, args);

    if (args.offset !== null && args.offset !== undefined) {
      this.offset = Number(args.offset);
    }

    if (args.limit !== null && args.limit !== undefined) {
      this.limit = Number(args.limit);
    }

    this.offset = this.offset ?? 0;

    if (!this.limit || this.limit > 20) {
      this.limit = 20; // Default limit
    }
  }

  isQueryingConnector(): boolean {
    return this.connector_id !== null && this.connector_id !==  undefined;
  }

  isQueryingEvse(): boolean {
    return this.evse_uid !== null && this.evse_uid !== undefined
      && (this.connector_id === null || this.connector_id === undefined);
  }

  isQueryingListsOfEntities(): boolean {
    return (this.evse_uid === null || this.evse_uid === undefined)
    && (this.location_id === null || this.location_id === undefined)
    && (this.connector_id === null || this.connector_id === undefined);
  }

  getPaginatedQueryParams(): OcpiEntitiesPaginatedQueryParams {
    return new OcpiEntitiesPaginatedQueryParams({
      offset: this.offset,
      limit: this.limit,
      date_to: this.date_to,
      date_from: this.date_from,
    })
  }
}
