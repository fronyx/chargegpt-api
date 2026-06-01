import { Location } from '../../models/general/models';
import { isEmptyString } from '../is-empty-string.function';

export class OcpiLocationFactory {
  private static readonly location: any = {
    'id': 'DE-GCE-EACCA00147332',
    'address': 'Berliner Ring 2  ',
    'city': 'Wolfsburg',
    'postal_code': '38440',
    'country': 'DEU',
    coordinates: {
      'latitude': 52.437091,
      'longitude': 52.437091,
    },
    'last_updated': '2022-05-05T12:30:34.503Z',
    'evses': [
      {
        'uid': '00147332',
        'evse_id': 'DE*GCE*EACCA00147332',
        'status': 'AVAILABLE',
        'last_updated': new Date('2022-05-05T12:30:12.524Z'),
        'connectors': [
          {
            'id': 'c0',
            'standard': 'IEC_62196_T2',
            'format': 'SOCKET',
            'power_type': 'AC_3_PHASE',
            'voltage': 230,
            'amperage': 16,
            'last_updated': new Date('2022-03-01T06:15:01.000Z')
          }
        ]
      }
    ]
  };

  static omit(args: { property: any; }): Location {
    if (isEmptyString(args.property)) {
      return OcpiLocationFactory.location;
    }

    if (args.property === 'evses') {
      return {
        ...this.location,
        evses: [],
      };
    }

    const { [args.property]: discard, ...rest } = this.location;
    return rest;
  }
}
