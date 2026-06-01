import axios from 'axios';
import { OcpiLocation } from '../domain/logging/update-create/models/ocpi-location';
import { axiosRetryDelayFunction } from './axios-retry-delay.function';

export async function getReverseGeocodingFunction(args: { location: OcpiLocation }): Promise<any> {
  const key = process.env.GOOGLE_MAPS_API_KEY ?? 'replace-me';
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${args.location.coordinates?.latitude},${args.location.coordinates?.longitude}&key=${key}`;

  const client = axios.create({ baseURL: url });
  return client
    .get('',)
    .then(response => response.data.results);
}
