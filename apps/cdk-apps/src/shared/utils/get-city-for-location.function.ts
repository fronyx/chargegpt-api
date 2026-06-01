import { OcpiLocation } from '../domain/logging/update-create/models/ocpi-location';
import { isEmptyString } from './is-empty-string.function';
import { getReverseGeocodingFunction } from './get-reverse-geocoding.function';
import { InternalApiService } from '../services/internal-api.service';

export async function getCityForLocationFunction(args: { location: OcpiLocation }): Promise<string> {
  let city = await new InternalApiService().getLocationCity(args.location.id);

  if (isEmptyString(city)) {
    const geocoding = await getReverseGeocodingFunction(args);
    const acceptedTypes = ['sublocality', 'locality', 'administrative_area_level_1'];
    const possibleAddresses: any[] = [];
    const addressComponents = geocoding
      .map(({ address_components }: any) => address_components)
      .reduce((acc: any, val: any) => [].concat(acc, val), []);

    acceptedTypes.forEach(addressType => {
      const addresses = addressComponents.filter(({ types }: any) => {
        return types.includes(addressType);
      });
      possibleAddresses.push(...addresses);
    });

    city = possibleAddresses[0]?.long_name;
  }

  return city;
}
