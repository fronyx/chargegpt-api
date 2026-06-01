import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CoordinatesDto {
  @ApiProperty({ example: 52.52198139999999 })
  lat: number;

  @ApiProperty({ example: 13.413306 })
  lng: number;
}

export class ConversationRequestPayloadDto {
  @ApiPropertyOptional({ example: 'I want to charge near Alexanderplatz, Berlin' })
  text: string;

  @ApiPropertyOptional()
  currentCoordinates: CoordinatesDto;

  @ApiPropertyOptional({ example: true })
  isVoice: boolean;

  @ApiPropertyOptional({ example: true })
  isSuggestion: boolean;

  @ApiPropertyOptional({ example: 'Location' })
  deniedContext: string;
}

export class FeedbackDto {
  @ApiProperty()
  rating: string;

  @ApiPropertyOptional()
  @ApiProperty()
  text?: string;

  @ApiPropertyOptional()
  @ApiProperty()
  responseId?: string;
}

export class FilterResponseDto {
  @ApiPropertyOptional({ example: 30 })
  min_power: number;

  @ApiPropertyOptional({ example: 69.9 })
  max_power: number;

  @ApiPropertyOptional({ example: true })
  power_enabled: boolean;

  @ApiPropertyOptional({ example: true })
  only_free: boolean;

  @ApiPropertyOptional({ example: true })
  only_4_or_5_stars: boolean;

  @ApiPropertyOptional({ example: false })
  only_public: boolean;

  @ApiPropertyOptional({ example: false })
  only_tariff_kwh: boolean;

  @ApiPropertyOptional({ example: false })
  only_tariff_min: boolean;

  @ApiPropertyOptional({ example: false })
  only_remote_start_capable: boolean;

  @ApiPropertyOptional({ example: false })
  only_auto_charge: boolean;

  @ApiPropertyOptional({ example: false })
  hide_not_available: boolean;

  @ApiPropertyOptional({ example: false })
  hide_unknown: boolean;

  @ApiPropertyOptional({ example: false })
  hide_coming_soon: boolean;

  @ApiPropertyOptional({ example: ['restaurant'] })
  type_of_locations: any[];

  @ApiPropertyOptional({ example: false })
  type_of_locations_enabled: boolean;

  @ApiPropertyOptional({ example: false })
  plug_types_enabled: boolean;

  @ApiPropertyOptional({ example: false })
  hide_no_state: boolean;
}

export class ContextUpdateRequestPayloadDto {
  @ApiProperty({ enum: ['chargegpt_filters_user_action:filters_updated'] })
  activity: string;

  @ApiPropertyOptional()
  filters: FilterResponseDto;

  @ApiPropertyOptional({ example: 'min_power' })
  filterName: string;

  @ApiPropertyOptional({ example: '0' })
  filterValue: string;
}