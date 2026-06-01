export class OcpiPaginatedQueryResults implements Readonly<OcpiPaginatedQueryResults> {
  static paginationLimit = 20;
  limit: number;
  offset: number;
  total: number;
  data: any[];

  constructor(args: OcpiPaginatedQueryResults) {
    Object.assign(this, args);

    this.offset = this.offset ?? 0;
    this.total = this.total ?? 0;
    this.limit = this.limit ?? OcpiPaginatedQueryResults.paginationLimit;
    this.data = this.data ?? [];
  }
}
