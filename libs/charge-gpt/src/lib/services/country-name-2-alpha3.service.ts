import { countryName2Alpha3 } from './country-name-2-alpha3.constant';
import { isEmptyString } from '../../../../../apps/cdk-apps/src/shared/utils/is-empty-string.function';
import * as Sentry from '@sentry/minimal';

export class CountryName2Alpha3Service {
  static convert(args: any): string | undefined {
    if (isEmptyString(args)) {
      return undefined;
    }

    const countryCode = countryName2Alpha3[args];

    if (isEmptyString(countryCode)) {
      Sentry.captureException(new Error(`Missing country code for country "${args}" in the library.`));
      return undefined;
    }

    return countryCode.toLowerCase();
  }
}
