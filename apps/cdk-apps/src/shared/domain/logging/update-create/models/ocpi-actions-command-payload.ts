export interface OcpiActionsCommandPayload {
  params: {
    locationId: string;
    uid: string;
    connectorId: string;
  };
  data: any;
}
