import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Route } from '../services/routes-services/routes.model';

export class DestinationDto {
  @ApiProperty({ example: 'Alexanderplatz, Berlin, Germany' })
  address: string;

  @ApiProperty({ example: 'DEU' })
  countryCode: string;

  @ApiProperty({ example: { lat: '52.52198139999999', lng: '13.413306' } })
  coordinates: {
    lat: string;
    lng: string;
  };
}

export class OriginDto {
  @ApiProperty({ example: 'Munich' })
  address: string;

  @ApiProperty({ example: 'DEU' })
  countryCode: string;

  @ApiProperty({ example: { lat: '48.13913', lng: '11.58022' } })
  coordinates: {
    lat: string;
    lng: string;
  };
}

export class PoiDto {
  @ApiProperty({
    // eslint-disable-next-line quotes
    example: "McDonald's, Stolper Weg 55, 14532 Kleinmachnow, Germany",
  })
  address: string;

  @ApiProperty({ example: 'DEU' })
  countryCode: string;

  @ApiProperty({
    example: {
      lat: '52.4029068',
      lng: '13.1866765',
    },
  })
  coordinates: {
    lat: string;
    lng: string;
  };
}

export class FiltersDto {
  @ApiPropertyOptional({ example: 30 })
  min_power: number;

  @ApiPropertyOptional({ example: 70 })
  max_power: number;

  @ApiPropertyOptional({ example: true })
  power_enabled: boolean;

  @ApiPropertyOptional({ example: true })
  only_free: boolean;

  @ApiPropertyOptional({ example: true })
  only_pay_with_neutral-payment-provider: boolean;

  @ApiPropertyOptional({ example: true })
  only_favorites: boolean;

  @ApiPropertyOptional({ example: true })
  only_4_or_5_stars: boolean;

  @ApiPropertyOptional({ example: true })
  only_public: boolean;

  @ApiPropertyOptional({ example: true })
  only_tariff_kwh: boolean;

  @ApiPropertyOptional({ example: true })
  only_tariff_min: boolean;

  @ApiPropertyOptional({ example: true })
  only_remote_start_capable: boolean;

  @ApiPropertyOptional({ example: true })
  only_auto_charge: boolean;

  @ApiPropertyOptional({ example: true })
  hide_not_available: boolean;

  @ApiPropertyOptional({ example: true })
  hide_no_state: boolean;

  @ApiPropertyOptional({ example: true })
  hide_unknown: boolean;

  @ApiPropertyOptional({ example: true })
  hide_coming_soon: boolean;

  @ApiPropertyOptional({ example: [] })
  hide_no_state_exceptions: string[];

  @ApiPropertyOptional({ example: ['Public street'] })
  type_of_locations: string[];

  @ApiPropertyOptional({ example: true })
  type_of_locations_enabled: boolean;

  @ApiPropertyOptional({ example: true })
  plug_types_enabled: boolean;
}

export class LocationDto {
  @ApiProperty({ example: 'DE-ALL-EGO002569' })
  locationId: string;

  @ApiProperty({
    example:
      'https://www.google.com/maps/search/?api=1&query=52.522747,13.413833',
  })
  link: string;

  @ApiProperty({ example: 179.326326069807 })
  distance: number;

  @ApiPropertyOptional({ example: 0 })
  probability: number;

  primaryIds: string[];

  @ApiPropertyOptional({ example: 52.522747 })
  lat: string;

  @ApiPropertyOptional({ example: 13.413833 })
  lng: string;

  @ApiPropertyOptional({ example: 'DC' })
  powerType: string;

  @ApiPropertyOptional({ example: 150 })
  powerKw: number;

  @ApiPropertyOptional({ example: ['IEC_62196_T2_COMBO'] })
  connectorTypes: string[];

  @ApiPropertyOptional({ example: 'Fastest' })
  recommendation: string;

  isCurrentlyAvailable: boolean;

  score: number;

  @ApiPropertyOptional({ example: 'Allego (DE)' })
  operatorName: number;
}

export class FiltersResultsDto {
  @ApiProperty()
  filters: FiltersDto;

  @ApiProperty()
  destination: DestinationDto;
}

const RoutesExample: Route[] = [
  {
    legs: [
      {
        points: [
          {
            latitude: 52.50931,
            longitude: 13.42937,
          },
          {
            latitude: 52.50904,
            longitude: 13.42913,
          },
          {
            latitude: 52.50895,
            longitude: 13.42904,
          },
          {
            latitude: 52.50868,
            longitude: 13.4288,
          },
          {
            latitude: 52.5084,
            longitude: 13.42857,
          },
          {
            latitude: 52.50816,
            longitude: 13.42839,
          },
          {
            latitude: 52.50791,
            longitude: 13.42825,
          },
          {
            latitude: 52.50757,
            longitude: 13.42772,
          },
          {
            latitude: 52.50752,
            longitude: 13.42785,
          },
          {
            latitude: 52.50742,
            longitude: 13.42809,
          },
          {
            latitude: 52.50735,
            longitude: 13.42824,
          },
          {
            latitude: 52.5073,
            longitude: 13.42837,
          },
          {
            latitude: 52.50706,
            longitude: 13.42888,
          },
          {
            latitude: 52.50696,
            longitude: 13.4291,
          },
          {
            latitude: 52.50673,
            longitude: 13.42961,
          },
          {
            latitude: 52.50619,
            longitude: 13.43092,
          },
          {
            latitude: 52.50608,
            longitude: 13.43116,
          },
          {
            latitude: 52.50574,
            longitude: 13.43195,
          },
          {
            latitude: 52.50564,
            longitude: 13.43218,
          },
          {
            latitude: 52.50528,
            longitude: 13.43299,
          },
          {
            latitude: 52.50513,
            longitude: 13.43336,
          },
          {
            latitude: 52.505,
            longitude: 13.43366,
          },
          {
            latitude: 52.50464,
            longitude: 13.43451,
          },
          {
            latitude: 52.50451,
            longitude: 13.43482,
          },
          {
            latitude: 52.50444,
            longitude: 13.43499,
          },
          {
            latitude: 52.50418,
            longitude: 13.43564,
          },
          {
            latitude: 52.50364,
            longitude: 13.4369,
          },
          {
            latitude: 52.50343,
            longitude: 13.43738,
          },
          {
            latitude: 52.5033,
            longitude: 13.43767,
          },
          {
            latitude: 52.50275,
            longitude: 13.43874,
          },
        ],
      },
    ],
  },
];

class PointDto {
  @ApiProperty({ example: 52.522747 })
  latitude: number;

  @ApiProperty({ example: 13.413833 })
  longitude: number;
}

class LegDto {
  @ApiProperty()
  points: PointDto[];
}

class RouteDto {
  @ApiProperty({ example: RoutesExample })
  legs: LegDto[];
}

export class DestinationResultsDto {
  @ApiProperty({ example: 'Destination', enum: ['Destination', 'Route'] })
  type: string;

  @ApiProperty({ type: [LocationDto] })
  data: LocationDto[];

  @ApiPropertyOptional({ example: '2024-02-02 12:26:57' })
  dateTime: string;

  @ApiPropertyOptional({ example: 'AC/DC' })
  powerType: string;

  @ApiProperty()
  destination: DestinationDto;

  @ApiPropertyOptional()
  origin: OriginDto;

  @ApiPropertyOptional()
  poi: PoiDto;

  @ApiPropertyOptional({ example: 'Allego' })
  operatorName: string;

  @ApiPropertyOptional({ example: 'IEC_62196_T2_COMBO' })
  connectorType: string;

  @ApiPropertyOptional({ example: 30 })
  minPower: number;

  @ApiPropertyOptional({ example: 500 })
  maxPower: number;

  @ApiPropertyOptional({ example: RoutesExample })
  routes: RouteDto[];
}

export class RecommendationsAnswerDto {
  @ApiProperty({ example: '2518c990-e732-4786-aa1f-1c2d1619aa49' })
  conversationId: string;

  @ApiProperty({ example: 'assistant' })
  role: string;

  @ApiProperty({
    example:
      'Based on current availability of Allego charge points at 8:38 PM, I recommend:',
  })
  prompt: string;

  @ApiProperty({ example: false })
  isClosed: boolean;

  @ApiPropertyOptional({ example: 'https://polly-audio.url' })
  audioUrl: string;

  @ApiProperty({
    example: '2518c990-e732-4786-aa1f-1c2d1619aa49_1707390689408',
  })
  responseId: string;

  @ApiPropertyOptional({ example: 'Location' })
  provideContext: string;

  @ApiProperty({ example: '2.0.16' })
  versionNumber: string;

  @ApiPropertyOptional()
  results: DestinationResultsDto;
}

export class FiltersAnswerDto {
  @ApiProperty({ example: '2518c990-e732-4786-aa1f-1c2d1619aa49' })
  conversationId: string;

  @ApiProperty({ example: 'assistant' })
  role: string;

  @ApiProperty({
    example:
      'Near Alexanderplatz, Berlin, Germany, you can find the following charge points that match your request:',
  })
  prompt: string;

  @ApiProperty({ example: false })
  isClosed: boolean;

  @ApiPropertyOptional({ example: 'https://polly-audio.url' })
  audioUrl: string;

  @ApiProperty({
    example: '2518c990-e732-4786-aa1f-1c2d1619aa49_1707390689408',
  })
  responseId: string;

  @ApiPropertyOptional({ example: 'Location' })
  provideContext: string;

  @ApiProperty({ example: '2.0.16' })
  versionNumber: string;

  @ApiPropertyOptional()
  results: FiltersResultsDto;
}

