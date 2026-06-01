export class OcpiEntitiesPaginatedQueryParams
  implements Readonly<OcpiEntitiesPaginatedQueryParams> {
  date_to: string;
  date_from: string;
  limit: number;
  offset: number;

  constructor(
    args: {
      date_to: string;
      date_from: string;
      limit: number;
      offset: number;
    },
  ) {
    Object.assign(this, args);
  }

  getDateTo(): Date | null {
    if (this.date_to) {
      return new Date(this.date_to);
    }

    return null;
  }

  getDateFrom(): Date | null {
    if (this.date_from) {
      return new Date(this.date_from);
    }

    return null;
  }
}
