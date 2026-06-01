export class OcpiLocationCoordinates implements Readonly<OcpiLocationCoordinates> {
  coordinates: string[];
  type: string;

  constructor(args: Partial<OcpiLocationCoordinates>) {
    Object.assign(this, args);
  }
}
