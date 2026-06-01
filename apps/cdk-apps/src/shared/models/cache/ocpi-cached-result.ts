export interface OcpiCachedResult<T> {
  locationId?: string;
  evseId?: string;
  uid?: string;
  data: T;
}
