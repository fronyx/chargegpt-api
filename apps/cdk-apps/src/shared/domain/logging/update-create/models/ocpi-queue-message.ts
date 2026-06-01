import { ManageOcpiEntityRequest } from './manage-ocpi-entity-request';

export class OcpiQueueMessage implements Readonly<OcpiQueueMessage> {
  request: ManageOcpiEntityRequest;
  attributes: [string, any][];

  constructor(args: {
    request: ManageOcpiEntityRequest,
    attributes: [string, any][];
  }) {
    this.request = new ManageOcpiEntityRequest(args.request);
    this.attributes = args.attributes;
  }
}
