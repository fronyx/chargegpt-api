export class OcpiResponse implements Readonly<OcpiResponse> {
  status_code: number;
  status_message: string;
  data?: any;
  timestamp: string;

  constructor(args: Partial<OcpiResponse>) {
    Object.assign(this, args);

    this.timestamp = new Date().toISOString();
  }
}
